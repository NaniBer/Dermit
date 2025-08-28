import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Star } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useChat } from "@/hooks/useChat";
import { useAuth } from "@/hooks/useAuth";
import PatientHeader from "@/components/PatientHeader";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import MessageItem from "@/components/MessageItem";
import ChatInput from "@/components/MessageInput";
import PatientChatHeader from "@/components/patientChat/PatientChatHeader";
import PatientDashboardButton from "@/components/PatientDashboardButton";
import { useTranslation } from "react-i18next";

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
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { user, session } = useAuth();
  const navigate = useNavigate();
  const [feedbackData, setFeedbackData] = useState(null);
  const token = session?.access_token;
  const { t } = useTranslation();

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

      const URL = `${backendUrl}/upload-image`;
      const response = await fetch(URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!response.ok) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <PatientHeader />
      <PatientDashboardButton />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Chat Header */}
        <PatientChatHeader consultationId={id} />

        {/* Chat Messages */}
        <Card className="shadow-lg">
          <CardContent className="p-0">
            <div className="h-96 overflow-y-auto p-6 space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-600 mt-2">{t("loadingMessages")}</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">{t("noMessagesYet")}</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <MessageItem
                    key={msg.id}
                    message={msg}
                    currentUserId={user?.id}
                  />
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            {status === "completed" ? (
              <div className="border-t p-4 text-center text-sm text-gray-500 italic">
                {t("chatEndedMessage")}
              </div>
            ) : (
              <ChatInput
                loading={loading}
                message={message}
                imagePreview={imagePreview}
                handleSendMessage={handleSendMessage}
                handleImageUpload={handleImageUpload}
                setUploadedImage={setUploadedImage}
                setImagePreview={setImagePreview}
                setMessage={setMessage}
              />
            )}
          </CardContent>
        </Card>

        {feedbackData && (
          <Card className="shadow-lg mb-6">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                {t("feedback")}
              </CardTitle>
              <CardDescription className="mt-2 text-sm text-gray-600">
                {feedbackData.feedback_message || t("noFeedbackProvided")}
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
