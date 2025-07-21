import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Send,
  Paperclip,
  Phone,
  Video,
  MoreVertical,
  Stethoscope,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useOptimizedChat } from "@/hooks/useOptimizedChat";
import { useAuth } from "@/hooks/useAuth";
import PatientHeader from "@/components/PatientHeader";
import { supabase } from "@/integrations/supabase/client";

const PatientChatPage = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, loading, chat, sendMessage } = useOptimizedChat(chatId!);
  const { user } = useAuth();
  const [doctorName, setDoctorName] = useState<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  console.log("hello");

  useEffect(() => {
    if (!chat?.doctor_id) return;

    const fetchDoctorName = async () => {
      const { data: doctor } = await supabase
        .from("profiles")
        .select("first_name, last_name")
        .eq("id", chat.doctor_id)
        .maybeSingle();

      if (doctor) {
        setDoctorName(
          `Dr. ${doctor.first_name || ""} ${doctor.last_name || ""}`.trim() ||
            "Doctor"
        );
      }
    };

    fetchDoctorName();
  }, [chat?.doctor_id]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    await sendMessage(message);
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <PatientHeader />
      <p>fghjk</p>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Chat Header */}
        <Card className="shadow-lg mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    <Stethoscope className="w-6 h-6" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{doctorName}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-green-100 text-green-800">
                      Active Chat
                    </Badge>
                    <span className="text-sm text-gray-600">Doctor</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Video className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Chat Messages */}
        <Card className="shadow-lg">
          <CardContent className="p-0">
            <div className="h-[500px] overflow-y-auto p-6 space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-600 mt-2">Loading messages...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">
                    Your doctor will respond shortly. Feel free to share any
                    additional details!
                  </p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender_id === user?.id
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg transition-all duration-200 ${
                        msg.sender_id === user?.id
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-gray-100 text-gray-900 shadow-sm"
                      } ${
                        msg.id.startsWith("temp-")
                          ? "opacity-70"
                          : "opacity-100"
                      }`}
                    >
                      <p className="break-words">{msg.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          msg.sender_id === user?.id
                            ? "text-blue-100"
                            : "text-gray-500"
                        }`}
                      >
                        {new Date(msg.created_at!).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="border-t p-4 bg-gray-50">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <Button type="button" variant="outline" size="sm">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message to the doctor..."
                  className="flex-1 bg-white"
                  disabled={loading}
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={!message.trim() || loading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PatientChatPage;
