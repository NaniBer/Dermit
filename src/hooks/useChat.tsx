import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type Message = Database["public"]["Tables"]["messages"]["Row"];
type MessageInsert = Database["public"]["Tables"]["messages"]["Insert"];

export const useChat = (consultationId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

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
      setMessages(data || []);
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

      const newMessage: MessageInsert = {
        consultation_id: consultationId,
        sender_id: user.id,
        content,
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
          const newMessage = payload.new as Message;
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
