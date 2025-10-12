import { useState, useEffect, use } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useChat } from "@/hooks/useChat";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";
import { ConsultationSummaryCard } from "@/components/doctorChat/ConsultationSummaryCard";

import { v4 as uuidv4 } from "uuid";
import MessageItem from "@/components/MessageItem";
import ChatInput from "@/components/MessageInput";
import FeedbackCard from "@/components/doctorChat/FeedbackCard";
import ChatHeader from "@/components/doctorChat/ChatHeader";
import PatientInfoCard from "@/components/doctorChat/PatientInfoCard";
import PatientMedicalDetails from "@/components/doctorChat/PatientMedicalDetails";
import ActionButtons from "@/components/doctorChat/ActionButtons";

type Consultation = Database["public"]["Tables"]["consultations"]["Row"];

const DoctorConsultationDetail = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, session } = useAuth();
  const { toast } = useToast();
  const [newMessage, setNewMessage] = useState("");
  const [chatReady, setChatReady] = useState(false);
  const [consultation, setConsultation] = useState<Consultation | null>(null);

  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [isChatClosed, setIsChatClosed] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [paid, setPaid] = useState(false);

  const {
    messages,
    sendMessage,
    loading: chatLoading,
  } = useChat(chatReady ? id : "");
  const token = session?.access_token;
  useEffect(() => {
    if (id) setChatReady(true);
  }, [id]);
  useEffect(() => {
    if (!id) return;

    const fetchConsultation = async () => {
      try {
        const { data, error } = await supabase
          .from("consultations")
          .select("*")
          .eq("id", id)
          .single<Consultation>();

        if (error) throw error;
        console.log(data.status);
        if (data.status === "in_progress") {
          setPaid(true);
        }
        if (data.status === "accepted_awaiting_payment") {
          setPaid(false);
        }
        setConsultation(data);
      } catch (error) {
        console.error("Error fetching consultation:", error);
        toast({
          title: "Error",
          description: "Failed to load consultation details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    const fetchSignedImages = async (id) => {
      const res = await fetch(`${backendUrl}/signed-images`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          consultation_id: id,
        }),
      });

      const data = await res.json();

      return data.signedUrls;
    };

    if (id) {
      fetchConsultation();
      fetchSignedImages(id).then((urls) => setImages(urls));
    }
  }, [id, toast, backendUrl, token]);

  useEffect(() => {
    if (!id) return;

    const channel = supabase
      .channel("consultation-updates")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "consultations",
          filter: `id=eq.${id}`,
        },
        (payload) => {
          const updatedConsultation = payload.new as Consultation;

          // Update local consultation state
          setConsultation(updatedConsultation);

          // Check if patient has paid and consultation is now in progress
          if (updatedConsultation.status === "in_progress" && !paid) {
            setPaid(true);
            toast({
              title: "Payment Received",
              description:
                "The patient has completed payment. You can now start the consultation.",
            });
          }
        }
      )
      .subscribe();

    // Clean up subscription on unmount
    return () => supabase.removeChannel(channel);
  }, [id, paid, toast]);

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
      await sendMessage("Image sent", "image", imageUrl);
      setUploadedImage(null);
      setImagePreview("");
    } else {
      if (!newMessage.trim()) return;
      await sendMessage(newMessage);
      setNewMessage("");
    }
  };
  const endConsultation = async () => {
    const { data: updateData, error: updateError } = await supabase
      .from("consultations")
      .update({ status: "completed" })
      .eq("id", id);
    if (updateError) {
      console.error("Error updating consultation status:", updateError);
      toast({
        title: "Consultation End Error",
        description: updateError.message,
        variant: "destructive",
      });
      return;
    }

    setIsChatClosed(true);

    // Optionally, redirect or show success message
    setShowEndDialog(false);
    navigate("/doctor/thank-you");
  };

  const handleAcceptConsultation = async () => {
    if (!consultation || !user) return;

    try {
      // STEP 1: Doctor accepts consultation - trigger payment requirement for patient
      // Update status to 'accepted_awaiting_payment' instead of directly to 'in_progress'
      const { error } = await supabase
        .from("consultations")
        .update({
          doctor_id: user.id,
          status: "accepted_awaiting_payment", // Patient must complete payment before consultation starts
        })
        .eq("id", consultation.id);

      if (error) throw error;

      toast({
        title: "Consultation Accepted",
        description:
          "Payment request sent to patient. Consultation will begin after payment confirmation.",
      });

      // Update local state
      setConsultation({
        ...consultation,
        doctor_id: user.id,
        status: "accepted_awaiting_payment",
      });

      // STEP 2: Notify patient to complete payment
      // TODO: In production, trigger email/SMS notification to patient with payment link
      console.log(
        "Patient will receive payment notification for consultation:",
        consultation.id
      );
    } catch (error) {
      console.error("Error accepting consultation:", error);
      toast({
        title: "Error",
        description: "Failed to accept consultation",
        variant: "destructive",
      });
    }
  };

  const handleDeclineConsultation = async () => {
    if (!consultation) return;

    try {
      const { error } = await supabase
        .from("consultations")
        .update({ status: "cancelled" })
        .eq("id", consultation.id);

      if (error) throw error;

      toast({
        title: "Consultation Declined",
        description: "The consultation has been declined.",
      });

      navigate("/doctor/consultations");
    } catch (error) {
      console.error("Error declining consultation:", error);
      toast({
        title: "Error",
        description: "Failed to decline consultation",
        variant: "destructive",
      });
    }
  };

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

  if (loading && !consultation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading consultation...</p>
        </div>
      </div>
    );
  }
  if (!paid && consultation?.status === "accepted_awaiting_payment") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">
            Waiting for patient to complete payment...
          </p>
        </div>
      </div>
    );
  }

  if (!consultation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Consultation not found</p>
          <Button
            onClick={() => navigate("/doctor/consultations")}
            className="mt-4"
          >
            Back to Consultations
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/doctor/consultations")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Consultations
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Chat */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg h-[600px] flex flex-col">
              <CardHeader className="pb-4">
                <ChatHeader
                  consultation={consultation}
                  onEndClick={() => setShowEndDialog(true)}
                />
              </CardHeader>
              <Dialog open={showEndDialog} onOpenChange={setShowEndDialog}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>End Consultation?</DialogTitle>
                  </DialogHeader>
                  <p>
                    Are you sure you want to end this consultation? This action
                    cannot be undone.
                  </p>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setShowEndDialog(false)}
                    >
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
              {chatLoading && (
                <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading Chats...</p>
                  </div>
                </div>
              )}

              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <MessageItem
                      key={message.id}
                      message={message}
                      currentUserId={user?.id}
                    />
                  ))}
                </div>
              </CardContent>

              {/* Message Input */}
              {consultation.status === "completed" ? (
                <div className="border-t p-4 text-center text-sm text-gray-500 italic">
                  💬 This chat has ended. Thank you for your message!
                </div>
              ) : (
                <ChatInput
                  loading={loading}
                  message={newMessage}
                  imagePreview={imagePreview}
                  handleSendMessage={handleSendMessage}
                  handleImageUpload={handleImageUpload}
                  setUploadedImage={setUploadedImage}
                  setImagePreview={setImagePreview}
                  setMessage={setNewMessage}
                />
              )}
            </Card>
            {consultation.status === "completed" && (
              <FeedbackCard consultationId={consultation.id} />
            )}
          </div>

          {/* Right Column - Patient Info & Actions */}
          <div className="space-y-6">
            {/* Patient Information */}
            <PatientInfoCard consultation={consultation} />

            {/* Medical Details */}
            <PatientMedicalDetails
              images={images}
              consultation={consultation}
            />

            {/* Actions */}
            {consultation.status === "pending" && (
              <ActionButtons
                handleAcceptConsultation={handleAcceptConsultation}
                handleDeclineConsultation={handleDeclineConsultation}
              />
            )}

            {/* Consultation Summary Card */}
            <ConsultationSummaryCard
              consultation={consultation}
              setConsultation={setConsultation}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorConsultationDetail;
