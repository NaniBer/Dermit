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
  User,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useOptimizedChat } from "@/hooks/useOptimizedChat";
import { useAuth } from "@/hooks/useAuth";
import DoctorHeader from "@/components/DoctorHeader";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const DoctorChatPage = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, loading, chat, sendMessage } = useOptimizedChat(chatId!);
  const { user } = useAuth();
  const [patientName, setPatientName] = useState<string | null>(null);
  const [showEndDialog, setShowEndDialog] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };
  useEffect(() => {
    if (!chat?.patient_id) return;

    const fetchPatientName = async () => {
      const { data: patient } = await supabase
        .from("profiles")
        .select("first_name, last_name")
        .eq("id", chat.patient_id)
        .maybeSingle();

      if (patient) {
        setPatientName(
          `${patient.first_name || ""} ${patient.last_name || ""}`.trim() ||
            "Patient"
        );
      }
    };

    fetchPatientName();
  }, [chat?.patient_id]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    await sendMessage(message);
    setMessage("");
  };
  const endConsultation = async () => {
    if (!chatId) return;

    const { data, error } = await supabase
      .from("chats")
      .select("consultation_id")
      .eq("id", chatId);
    console.log("Consultation ended:", data);
    const consultationId = data?.[0]?.consultation_id;
    if (!consultationId) {
      console.error("No consultation found for this chat.");
      return;
    }
    const { data: updateData, error: updateError } = await supabase
      .from("consultations")
      .update({ status: "completed" })
      .eq("id", consultationId);
    if (updateError) {
      console.error("Error updating consultation status:", updateError);
      return;
    }
    console.log("Consultation status updated:", updateData);

    if (error) {
      console.error("Error ending consultation:", error);
      return;
    }

    // Optionally, redirect or show success message
    setShowEndDialog(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <DoctorHeader />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Chat Header */}
        <Card className="shadow-lg mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-brand-primary text-brand-secondary-600">
                    <User className="w-6 h-6" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{patientName}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-green-100 text-green-800">
                      Active Chat
                    </Badge>
                    <span className="text-sm text-gray-600">Patient</span>
                  </div>
                </div>
              </div>
              <Button
                variant="destructive"
                className="ml-4"
                onClick={() => setShowEndDialog(true)}
              >
                End Consultation
              </Button>
            </div>
          </CardHeader>
        </Card>
        <Dialog open={showEndDialog} onOpenChange={setShowEndDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>End Consultation?</DialogTitle>
            </DialogHeader>
            <p>
              Are you sure you want to end this consultation? This action cannot
              be undone.
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEndDialog(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setShowEndDialog(false);
                  endConsultation();
                }}
              >
                Yes, End Consultation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Chat Messages */}
        <Card className="shadow-lg">
          <CardContent className="p-0">
            <div className="h-[500px] overflow-y-auto p-6 space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary mx-auto"></div>
                  <p className="text-gray-600 mt-2">Loading messages...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">
                    No messages yet. Start the conversation with your patient!
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
                          ? "bg-brand-secondary text-white shadow-md"
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
                {/* <Button type="button" variant="outline" size="sm">
                  <Paperclip className="w-4 h-4" />
                </Button> */}
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message to the patient..."
                  className="flex-1 bg-white"
                  disabled={loading}
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={!message.trim() || loading}
                  className="bg-brand-primary"
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

export default DoctorChatPage;
