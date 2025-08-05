import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Star,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useChat } from "@/hooks/useChat";
import { useAuth } from "@/hooks/useAuth";
import PatientHeader from "@/components/PatientHeader";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

const PatientConsultationChat = () => {
  const { id } = useParams<{ id: string }>();
  const [message, setMessage] = useState("");
  const [chatReady, setChatReady] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const { messages, loading, sendMessage, status } = useChat(
    chatReady ? id : ""
  );
  const { user, session } = useAuth();
  const navigate = useNavigate();
  const [doctorName, setDoctorName] = useState<string | null>(null);
  const [feedbackData, setFeedbackData] = useState(null);
  const token = session?.access_token;
  const getDoctorNameFromConsultation = async (consultationId: string) => {
    // 1️⃣ Fetch consultation to get doctor_id
    const { data: consultation, error: consultError } = await supabase
      .from("consultations")
      .select("doctor_id")
      .eq("id", consultationId)
      .maybeSingle();

    if (consultError || !consultation?.doctor_id) {
      console.error("Failed to fetch consultation or doctor ID:", consultError);
      return null;
    }

    const doctorId = consultation.doctor_id;

    // 2️⃣ Fetch doctor's profile
    const { data: doctor, error: doctorError } = await supabase
      .from("profiles")
      .select("first_name") // or "name", "first_name", etc., based on your schema
      .eq("id", doctorId)
      .maybeSingle();

    if (doctorError || !doctor) {
      console.error("Failed to fetch doctor profile:", doctorError);
      return null;
    }

    return doctor.first_name; // 🧠 Or whatever field you use for name
  };
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const { data: fetchedFeedbackData, error } = await supabase
          .from("patient_feedback")
          .select(
            "allow_contact, contact_method, contact_value, feedback_message,rating"
          )
          .eq("consultation_id", id)
          .maybeSingle();

        if (error) {
          console.error("Error fetching feedback:", error);
          return;
        }

        if (fetchedFeedbackData) {
          setFeedbackData(fetchedFeedbackData);
          console.log("Feedback data:", fetchedFeedbackData);
        } else navigate(`/patient/feedback/${id}`);
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };
    if (status === "completed") {
      fetchFeedback();
    }
  }, [status, id]);
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedImage(file);

    // Create a preview URL using FileReader
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  useEffect(() => {
    if (!id) return;

    const fetchDoctorName = async () => {
      const name = await getDoctorNameFromConsultation(id);
      setDoctorName(name);
    };

    fetchDoctorName();
  }, [id]);
  useEffect(() => {
    if (id) setChatReady(true);
  }, [id]);
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadedImage) {
      const myUuid = uuidv4();
      const formData = new FormData();

      formData.append("file", uploadedImage);
      formData.append("filename", myUuid);
      formData.append("consultation_id", id);
      formData.append("image_type", "chat");
      // Replace with your API endpoint

      const URL = "http://localhost:3000/upload-image";
      const response = await fetch(URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData, // NO content-type header! The browser adds it automatically with boundary
      });
      if (!response.ok) {
        // Handle error...
        console.error("Failed to send image");
        return;
      }
      const { imageUrl } = await response.json();
      console.log("Image URL:", imageUrl);
      await sendMessage("Image sent", "image", imageUrl);
      setUploadedImage(null);
      setImagePreview("");
    } else {
      if (!message.trim()) return;

      await sendMessage(message);
      setMessage("");
    }
  };
  useEffect(() => {
    console.log(messages);
  }, [messages]);

  // const handleSendMessage = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (!message.trim()) return;

  //   await sendMessage(message);
  //   setMessage("");
  // };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <PatientHeader />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Chat Header */}
        <Card className="shadow-lg mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    DR
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">Dr. {doctorName}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-green-100 text-green-800">
                      Online
                    </Badge>
                    <span className="text-sm text-gray-600">Dermatologist</span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Chat Messages */}
        <Card className="shadow-lg">
          <CardContent className="p-0">
            <div className="h-96 overflow-y-auto p-6 space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-600 mt-2">Loading messages...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">
                    No messages yet. Start the conversation!
                  </p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      msg.sender_id === user?.id
                        ? "bg-brand-primary text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    {msg.message_type === "image" && msg.file_url ? (
                      <img
                        src={msg.signedUrl || msg.file_url}
                        alt="chat attachment"
                        className="rounded-md max-w-full h-auto"
                      />
                    ) : (
                      <p className="text-sm">{msg.content}</p>
                    )}

                    {msg.file_url && msg.message_type !== "image" && (
                      <div className="mt-2">
                        <div className="flex items-center space-x-2 text-xs">
                          <FileText className="w-3 h-3" />
                          <a
                            href={msg.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline"
                          >
                            Download Attachment
                          </a>
                        </div>
                      </div>
                    )}
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
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            {status === "completed" ? (
              <div className="border-t p-4 text-center text-sm text-gray-500 italic">
                💬 This chat has ended. Thank you for your message!
              </div>
            ) : (
              <div className="border-t p-4">
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                  {imagePreview && (
                    <div className="mb-2 relative">
                      <img
                        src={imagePreview}
                        alt="Image preview"
                        className="h-20 w-auto rounded border"
                      />
                      <Button
                        variant="ghost"
                        size="xs"
                        className="absolute top-0 right-0"
                        onClick={() => {
                          setUploadedImage(null);
                          setImagePreview("");
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                  {/* Hidden file input */}
                  <input
                    type="file"
                    accept="image/*"
                    id="chat-image-upload"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={loading}
                  />

                  {/* Upload Button */}
                  <Button
                    type="button"
                    variant="ghost"
                    className="p-2"
                    disabled={loading}
                    onClick={() =>
                      document.getElementById("chat-image-upload")?.click()
                    }
                  >
                    <Paperclip className="w-5 h-5" />
                  </Button>
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1"
                  />
                  <Button type="submit" size="sm">
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            )}
          </CardContent>
        </Card>
        {feedbackData && (
          <Card className="shadow-lg mb-6">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Feedback</CardTitle>
              <CardDescription className="mt-2 text-sm text-gray-600">
                {feedbackData.feedback_message || "No feedback provided."}
              </CardDescription>

              {/* Read-only Star Rating */}
              <div className="mt-4 flex gap-1">
                {[1, 2, 3, 4, 5].map((num) => (
                  <Star
                    key={num}
                    className={`w-5 h-5 transition-transform hover:scale-105 ${
                      feedbackData.rating && feedbackData.rating >= num
                        ? "text-brand-primary"
                        : "text-gray-300"
                    }`}
                    fill={
                      feedbackData.rating && feedbackData.rating >= num
                        ? "#3BC4B2"
                        : "white"
                    }
                    color={
                      feedbackData.rating && feedbackData.rating >= num
                        ? "hsl(var(--brand-primary))"
                        : "#D1D5DB"
                    }
                  />
                ))}
              </div>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PatientConsultationChat;
