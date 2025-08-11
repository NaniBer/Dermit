import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { SecureMessage, isSecureMessage, sanitizeInput, validateUUID } from "@/lib/securityTypes";

type MessageInsert = {
  consultation_id: string;
  sender_id: string;
  content: string;
  message_type?: string;
  file_url?: string;
};
type MessageWithUrl = SecureMessage & { signedUrl?: string };

export const useChat = (consultationId: string) => {
  const [messages, setMessages] = useState<SecureMessage[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, session } = useAuth();
  const { toast } = useToast();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = session?.access_token;

  // Fetch existing messages
  const fetchMessages = useCallback(async () => {
    if (!consultationId) return;

    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("consultation_id", consultationId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      const messagesWithSignedUrls = await Promise.all(
        (data || []).map(async (msg: any) => {
          if (!isSecureMessage(msg)) {
            console.error("Invalid message data:", msg);
            return null;
          }
          if (msg.message_type === "image") {
            try {
              const res = await fetch(`${backendUrl}/chat-signed-images`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ image_url: msg.file_url }), // this should be like "secure_uploads/..."
              });

              const { signedUrl } = await res.json();
              return {
                ...msg,
                signedUrl,
              };
            } catch (err) {
              console.error("Error fetching signed URL:", err);
              return msg; // fallback without signedUrl
            }
          }

          return msg;
        })
      );

      const validMessages = messagesWithSignedUrls.filter(Boolean) as SecureMessage[];
      setMessages(validMessages);

      // Fetch status
      const { data: statusData, error: statusError } = await supabase
        .from("consultations")
        .select("status")
        .eq("id", consultationId);

      if (statusError) throw statusError;
      setStatus((statusData as any)?.[0]?.status);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [consultationId, toast]);

  // Send a message
  const sendMessage = useCallback(
    async (
      content: string,
      messageType: "text" | "image" | "file" = "text",
      fileUrl?: string
    ) => {
      if (!user || !consultationId) return;

      if (!validateUUID(consultationId) || !validateUUID(user.id)) {
        throw new Error("Invalid user or consultation ID");
      }

      const newMessage: MessageInsert = {
        consultation_id: consultationId,
        sender_id: user.id,
        content: sanitizeInput(content),
        message_type: messageType,
        file_url: fileUrl,
      };

      try {
        const { error } = await supabase.from("messages").insert(newMessage);

        if (error) throw error;
      } catch (error) {
        console.error("Error sending message:", error);
        toast({
          title: "Error",
          description: "Failed to send message",
          variant: "destructive",
        });
      }
    },
    [user, consultationId, toast]
  );

  // Set up real-time subscription
  useEffect(() => {
    if (!consultationId) return;

    fetchMessages();

    const channel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `consultation_id=eq.${consultationId}`,
        },
        (payload) => {
          const newMessage = payload.new as MessageWithUrl;
          console.log("New message received:", newMessage);

          if (newMessage.message_type === "image") {
            (async () => {
              try {
                const res = await fetch(`${backendUrl}/chat-signed-images`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({ image_url: newMessage.file_url }),
                });

                const { signedUrl } = await res.json();
                newMessage.signedUrl = signedUrl;
              } catch (err) {
                console.error("Error fetching signed URL:", err);
              }
            })();
          }

          setMessages((prev) => [...prev, newMessage]);
        }
      )

      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "consultations",
          filter: `id=eq.${consultationId}`,
        },
        (payload) => {
          const updated = payload.new;
          setStatus(updated.status);
        }
      )

      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [consultationId, fetchMessages]);

  return {
    messages,
    loading,
    sendMessage,
    status,
  };
};
