import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { SecureMessage, SecureChat, isSecureMessage, isSecureChat, sanitizeInput, validateUUID } from '@/lib/securityTypes';

type MessageInsert = {
  chat_id: string;
  consultation_id: string;
  sender_id: string;
  content: string;
  message_type?: string;
  file_url?: string;
};

export const useOptimizedChat = (chatId: string) => {
  const [messages, setMessages] = useState<SecureMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [chat, setChat] = useState<SecureChat | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const channelRef = useRef<any>(null);
  const messagesCache = useRef<Set<string>>(new Set());

  // Optimized message fetching with pagination
  const fetchMessages = useCallback(async (limit = 50) => {
    if (!chatId) return;
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true })
        .limit(limit);

      if (error) throw error;
      
      // Update cache and state with validation
      const rawMessages = data || [];
      const validMessages = (rawMessages as any[]).filter((msg: any) => isSecureMessage(msg)) as SecureMessage[];
      messagesCache.current.clear();
      validMessages.forEach(msg => messagesCache.current.add(msg.id));
      setMessages(validMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [chatId, toast]);

  // Fetch chat details
  const fetchChat = useCallback(async () => {
    if (!chatId) return;
    
    try {
      const { data, error } = await supabase
        .from('chats')
        .select('*')
        .eq('id', chatId)
        .single();

      if (error) throw error;
      if (data && isSecureChat(data)) {
        setChat(data);
      }
    } catch (error) {
      console.error('Error fetching chat:', error);
    }
  }, [chatId]);

  // Optimized message sending with immediate UI update
  const sendMessage = useCallback(async (
    content: string, 
    messageType: 'text' | 'image' | 'file' = 'text', 
    fileUrl?: string
  ) => {
    if (!user || !chatId || !content.trim()) return;
    
    if (!validateUUID(chatId) || !validateUUID(user.id)) {
      console.error("Invalid chat or user ID");
      return;
    }

    // Optimistic update - add message immediately to UI
    const tempMessage: SecureMessage = {
      id: `temp-${Date.now()}`,
      chat_id: chatId,
      consultation_id: chat?.consultation_id || '',
      sender_id: user.id,
      content: sanitizeInput(content.trim()),
      message_type: messageType,
      file_url: fileUrl || null,
      created_at: new Date().toISOString(),
    };

    setMessages(prev => [...prev, tempMessage]);

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          chat_id: chatId,
          consultation_id: chat?.consultation_id || '',
          sender_id: user.id,
          content: sanitizeInput(content.trim()),
          message_type: messageType,
          file_url: fileUrl,
        })
        .select()
        .single();

      if (error) throw error;

      // Replace temp message with real one
      if (data && isSecureMessage(data)) {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === tempMessage.id ? data as SecureMessage : msg
          )
        );
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove temp message on error
      setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  }, [user, chatId, chat?.consultation_id, toast]);

  // Set up optimized real-time subscription
  useEffect(() => {
    if (!chatId) return;
    
    // Cleanup previous subscription
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    fetchChat();
    fetchMessages();

    // Create unique channel name for this chat
    const channelName = `chat-${chatId}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${chatId}`
        },
        (payload) => {
          const newMessage = payload.new as SecureMessage;
          if (!isSecureMessage(newMessage)) {
            console.error("Invalid message received:", newMessage);
            return;
          }
          
          // Avoid duplicates using cache
          if (!messagesCache.current.has(newMessage.id)) {
            messagesCache.current.add(newMessage.id);
            setMessages(prev => {
              // Check if it's replacing a temp message
              const existingTempIndex = prev.findIndex(msg => 
                msg.sender_id === newMessage.sender_id && 
                msg.content === newMessage.content &&
                msg.id.startsWith('temp-')
              );
              
              if (existingTempIndex !== -1) {
                // Replace temp message
                const newMessages = [...prev];
                newMessages[existingTempIndex] = newMessage;
                return newMessages;
              } else {
                // Add new message if not from current user (avoid double display)
                if (newMessage.sender_id !== user?.id) {
                  return [...prev, newMessage];
                }
                return prev;
              }
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'chats',
          filter: `id=eq.${chatId}`
        },
        (payload) => {
          const updatedChat = payload.new as SecureChat;
          if (isSecureChat(updatedChat)) {
            setChat(updatedChat);
          }
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [chatId, fetchMessages, fetchChat, user?.id]);

  // Typing indicator (can be extended)
  const sendTypingIndicator = useCallback(() => {
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 2000);
  }, []);

  return {
    messages,
    loading,
    chat,
    isTyping,
    sendMessage,
    sendTypingIndicator,
    refreshMessages: fetchMessages,
  };
};