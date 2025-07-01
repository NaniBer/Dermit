import { useState } from "react";
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

const DoctorConsultationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newMessage, setNewMessage] = useState("");

  // Mock data - would come from API based on consultation ID
  const consultation = {
    id: parseInt(id || "1"),
    patient: "John Doe",
    age: 34,
    condition: "Atopic Dermatitis",
    status: "active",
    urgency: "medium",
    date: "2024-06-14",
    time: "10:30 AM",
    symptoms: "Dry, itchy skin patches on arms and legs, worsening at night",
    medicalHistory: "Previous eczema episodes, family history of allergies",
    currentMedications: "None reported",
  };

  const messages = [
    {
      id: 1,
      sender: "patient",
      message:
        "Hello Dr. Johnson, I've been experiencing some skin issues lately. The patches on my arms are getting worse.",
      timestamp: "10:30 AM",
      attachments: [],
    },
    {
      id: 2,
      sender: "patient",
      message: "Here are some photos of the affected areas",
      timestamp: "10:32 AM",
      attachments: ["image1.jpg", "image2.jpg"],
    },
    {
      id: 3,
      sender: "doctor",
      message:
        "Thank you for sharing the photos. Based on what I can see, this appears to be atopic dermatitis. How long have you been experiencing these symptoms?",
      timestamp: "11:15 AM",
      attachments: [],
    },
    {
      id: 4,
      sender: "patient",
      message:
        "It started about 2 weeks ago and has been getting progressively worse, especially at night.",
      timestamp: "11:20 AM",
      attachments: [],
    },
    {
      id: 5,
      sender: "doctor",
      message:
        "I recommend starting with a gentle moisturizer twice daily and a mild topical steroid. Please avoid harsh soaps and hot water. I'll send you a detailed treatment plan.",
      timestamp: "11:25 AM",
      attachments: ["treatment_plan.pdf"],
    },
  ];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In real app, this would send message via API
      console.log("Sending message:", newMessage);
      setNewMessage("");
    }
  };

  const handleAcceptConsultation = () => {
    console.log("Accepting consultation");
    // API call to accept consultation
  };

  const handleDeclineConsultation = () => {
    console.log("Declining consultation");
    // API call to decline consultation
  };

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
                      <AvatarFallback>
                        {consultation.patient
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">
                        {consultation.patient}
                      </CardTitle>
                      <CardDescription>
                        Consultation #{consultation.id}
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
                        message.sender === "doctor"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender === "doctor"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <p className="text-sm">{message.message}</p>
                        {message.attachments.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {message.attachments.map((attachment, index) => (
                              <div
                                key={index}
                                className="flex items-center space-x-2 text-xs"
                              >
                                {attachment.includes("image") ? (
                                  <Camera className="w-3 h-3" />
                                ) : (
                                  <FileText className="w-3 h-3" />
                                )}
                                <span>{attachment}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        <p className="text-xs mt-1 opacity-75">
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex space-x-2">
                  <Textarea
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 min-h-[60px]"
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
                      Name
                    </label>
                    <p className="text-gray-900">{consultation.patient}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Age
                    </label>
                    <p className="text-gray-900">
                      {consultation.age} years old
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Condition
                    </label>
                    <Badge variant="outline">{consultation.condition}</Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Status
                    </label>
                    <Badge
                      className={
                        consultation.status === "active"
                          ? "bg-green-100 text-green-800"
                          : consultation.status === "waiting"
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
                        consultation.urgency === "high"
                          ? "bg-red-100 text-red-800"
                          : consultation.urgency === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }
                    >
                      {consultation.urgency}
                    </Badge>
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
                      Symptoms
                    </label>
                    <p className="text-sm text-gray-900">
                      {consultation.symptoms}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Medical History
                    </label>
                    <p className="text-sm text-gray-900">
                      {consultation.medicalHistory}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Current Medications
                    </label>
                    <p className="text-sm text-gray-900">
                      {consultation.currentMedications}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            {consultation.status === "waiting" && (
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
