import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  MessageSquare,
  Clock,
  CheckCircle,
  FileText,
  Camera,
  Send,
  Phone,
  Video,
  Calendar,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useChat } from "@/hooks/useChat";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";
import { DialogClose } from "@radix-ui/react-dialog";
import { Input } from "@/components/ui/input";
// import Image from "next/image";

// import { c } from "node_modules/vite/dist/node/types.d-aGj9QkWt";

type Consultation = Database["public"]["Tables"]["consultations"]["Row"];

const DoctorConsultationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [newMessage, setNewMessage] = useState("");
  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showImagesModal, setShowImagesModal] = useState(false);

  // Use real-time chat
  const { messages, sendMessage } = useChat(id || "");

  useEffect(() => {
    if (!id) return;

    const fetchConsultation = async () => {
      try {
        const { data, error } = await supabase
          .from("consultations")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
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
      const res = await fetch("http://localhost:3000/signed-images", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // this tells the server it's JSON
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

    // fetchConsultation();
  }, [id, toast]);

  const handleSendMessage = async () => {
    if (newMessage.trim() && user) {
      await sendMessage(newMessage);
      setNewMessage("");
    }
  };

  const handleAcceptConsultation = async () => {
    if (!consultation || !user) return;

    try {
      const { error } = await supabase
        .from("consultations")
        .update({
          doctor_id: user.id,
          status: "in_progress",
        })
        .eq("id", consultation.id);

      if (error) throw error;

      toast({
        title: "Consultation Accepted",
        description: "You can now start chatting with the patient.",
      });

      // Update local state
      setConsultation({
        ...consultation,
        doctor_id: user.id,
        status: "in_progress",
      });
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
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading consultation...</p>
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback>PT</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">
                        Patient Consultation
                      </CardTitle>
                      <CardDescription>
                        Consultation #{consultation.id.substring(0, 8)}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Video className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender_id === user?.id
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender_id === user?.id
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        {message.file_url && (
                          <div className="mt-2">
                            <div className="flex items-center space-x-2 text-xs">
                              {message.message_type === "image" ? (
                                <Camera className="w-3 h-3" />
                              ) : (
                                <FileText className="w-3 h-3" />
                              )}
                              <span>Attachment</span>
                            </div>
                          </div>
                        )}
                        <p className="text-xs mt-1 opacity-75">
                          {new Date(message.created_at!).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex space-x-2">
                  {/* <Textarea
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 min-h-[60px]"
                  /> */}
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message to the patient..."
                    className="flex-1 bg-white"
                    disabled={loading}
                  />
                  <Button onClick={handleSendMessage} className="self-end">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Patient Info & Actions */}
          <div className="space-y-6">
            {/* Patient Information */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Patient Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Title
                    </label>
                    <p className="text-gray-900">{consultation.title}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Status
                    </label>
                    <Badge
                      className={
                        consultation.status === "in_progress"
                          ? "bg-green-100 text-green-800"
                          : consultation.status === "pending"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {consultation.status}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Priority
                    </label>
                    <Badge
                      className={
                        consultation.priority === "high"
                          ? "bg-red-100 text-red-800"
                          : consultation.priority === "normal"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }
                    >
                      {consultation.priority}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Created
                    </label>
                    <p className="text-gray-900">
                      {new Date(consultation.created_at!).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Medical Details */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Medical Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Description
                    </label>
                    <p className="text-sm text-gray-900 whitespace-pre-line">
                      {consultation.description || "No description provided. "}
                    </p>
                  </div>
                  {consultation.images && consultation.images.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Images
                      </label>
                      <p className="text-sm text-gray-900">
                        {consultation.images.length} image(s) uploaded
                      </p>
                      <Button
                        variant="outline"
                        className="mt-2"
                        onClick={() => setShowImagesModal(true)}
                      >
                        View Images
                      </Button>
                      <Dialog
                        open={showImagesModal}
                        onOpenChange={setShowImagesModal}
                      >
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Consulhjkltation Images</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4">
                            {images.map((url: string, idx: number) => (
                              <img
                                src={url}
                                alt={`Consultation Image ${idx + 1}`}

                                // key={idx}
                                // src={url}
                                // alt={`Consultation Image ${idx + 1}`}
                                // className="rounded border max-h-64 object-contain bg-gray-500"
                              />
                            ))}
                          </div>
                          <DialogClose asChild>
                            <Button className="mt-4 w-full">Close</Button>
                          </DialogClose>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            {consultation.status === "pending" && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Consultation Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={handleAcceptConsultation}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Accept Consultation
                  </Button>
                  <Button
                    onClick={handleDeclineConsultation}
                    variant="outline"
                    className="w-full border-red-200 text-red-600 hover:bg-red-50"
                  >
                    Decline Consultation
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Follow-up
                </Button>
                <Button variant="outline" className="w-full">
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
                <Link to={`/doctor/patients`}>
                  <Button variant="outline" className="w-full">
                    View Patient History
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorConsultationDetail;
