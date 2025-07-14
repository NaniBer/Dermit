import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  Phone,
  Video,
  MoreVertical,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import FileUpload from "@/components/FileUpload";
import EmptyState from "@/components/EmptyState";
import PatientHeader from "@/components/PatientHeader";
import { useChat } from "@/hooks/useChat";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const PatientChat = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const activeConversationId = searchParams.get("conversation") || "";
  const [message, setMessage] = useState("");
  const [conversations, setConversations] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { messages, loading, sendMessage } = useChat(activeConversationId);

  // Fetch user's consultations
  useEffect(() => {
    if (!user) return;

    const fetchConsultations = async () => {
      const { data } = await supabase
        .from("consultations")
        .select("*")
        .eq("patient_id", user.id)
        .order("created_at", { ascending: false });

      setConversations(data || []);
    };

    fetchConsultations();
  }, [user]);

  const activeConversation = conversations.find(
    (conv) => conv.id === activeConversationId
  );

  const handleSendMessage = () => {
    if (message.trim() && activeConversationId) {
      sendMessage(message);
      setMessage("");
    }
  };

  const handleFileSelect = (file: File, type: "image" | "file" | "camera") => {
    if (activeConversationId) {
      sendMessage(
        `📎 ${file.name}`,
        type === "image" || type === "camera" ? "image" : "file"
      );
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const selectConversation = (conversationId: string) => {
    setSearchParams({ conversation: conversationId });
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  useEffect(() => {
    console.log("Fetching messages for", activeConversationId);
    // fetch messages logic
  }, [activeConversationId]);

  if (!user) {
    return <div>Please log in to access chat.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <PatientHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8 h-[calc(100vh-200px)]">
          {/* Chat Sidebar */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg h-full">
              <CardHeader>
                <CardTitle className="text-lg">Your Conversations</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {conversations.length > 0 ? (
                  <div className="space-y-3">
                    {conversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        onClick={() => selectConversation(conversation.id)}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          activeConversationId === conversation.id
                            ? "bg-blue-50 border-blue-200"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarFallback>Dr</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">
                              {conversation.title}
                            </h4>
                            <p className="text-xs text-gray-600 line-clamp-1 mt-1">
                              {conversation.description}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-gray-400">
                                {new Date(
                                  conversation.created_at
                                ).toLocaleDateString()}
                              </span>
                              <Badge
                                className={`text-xs ${
                                  conversation.status === "in_progress"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {conversation.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState type="conversations" />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-3">
            {activeConversation ? (
              <Card className="shadow-lg h-full flex flex-col">
                {/* Chat Header */}
                <CardHeader className="border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback className="bg-green-100 text-green-600">
                          Dr
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {activeConversation.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Consultation • {activeConversation.status}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
                  {loading ? (
                    <div className="flex justify-center">
                      Loading messages...
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${
                          msg.sender_id === user.id
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            msg.sender_id === user.id
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          {msg.message_type === "image" && (
                            <div className="flex items-center space-x-2 mb-1">
                              <ImageIcon className="w-4 h-4" />
                              <span className="text-xs">Image</span>
                            </div>
                          )}
                          {msg.message_type === "file" && (
                            <div className="flex items-center space-x-2 mb-1">
                              <FileText className="w-4 h-4" />
                              <span className="text-xs">File</span>
                            </div>
                          )}
                          <p className="text-sm">{msg.content}</p>
                          <p
                            className={`text-xs mt-1 ${
                              msg.sender_id === user.id
                                ? "text-blue-100"
                                : "text-gray-500"
                            }`}
                          >
                            {new Date(msg.created_at!).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </CardContent>

                {/* Message Input */}
                <div className="border-t border-gray-200 p-4">
                  <div className="flex items-center space-x-2">
                    <FileUpload onFileSelect={handleFileSelect} />
                    <Input
                      placeholder="Type your message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      onKeyDown={handleKeyDown}
                      className="flex-1"
                      disabled={activeConversation.status === "completed"}
                    />
                    <Button
                      onClick={handleSendMessage}
                      className="bg-blue-600 hover:bg-blue-700"
                      disabled={activeConversation.status === "completed"}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  {activeConversation.status === "completed" && (
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      This consultation is closed. No new messages can be sent.
                    </p>
                  )}
                </div>
              </Card>
            ) : (
              <Card className="shadow-lg h-full flex items-center justify-center">
                <EmptyState type="conversations" />
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientChat;
