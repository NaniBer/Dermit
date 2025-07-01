import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import EmptyState from "@/components/EmptyState";
import PastDiagnosis from "@/components/patientDashboard/PastDiagnosis";
import UpcomingConsultations from "@/components/patientDashboard/UpcomingConsultations";
import DailyTips from "@/components/patientDashboard/DailyTips";
import PatientHeader from "@/components/PatientHeader";
import NewConsultationButton from "@/components/buttons/NewConsultationButton";
import ChatList from "@/components/ChatList";

const PatientDashboard = () => {
  const navigate = useNavigate();
  const pastDiagnoses = [
    {
      id: 1,
      condition: "Atopic Dermatitis",
      doctor: "Dr. Sarah Johnson",
      date: "2024-06-10",
      status: "completed",
      prescription:
        "Moisturizer twice daily, Topical steroid (Hydrocortisone 1%)",
      symptoms: "Red, itchy patches on arms and legs, worsening at night",
      diagnosis:
        "Based on the clinical presentation and patient history, this appears to be atopic dermatitis (eczema). The condition is characterized by dry, inflamed skin with intense itching.",
      treatment:
        "Apply moisturizer twice daily to affected areas. Use hydrocortisone 1% cream for flare-ups, but limit use to 7-10 days. Avoid known triggers such as harsh soaps and extreme temperatures.",
      followUp:
        "Follow-up in 4 weeks to assess treatment response. Contact if symptoms worsen or new areas are affected.",
      severity: "Mild to Moderate",
    },
    {
      id: 2,
      condition: "Seborrheic Keratosis",
      doctor: "Dr. Michael Chen",
      date: "2024-05-28",
      status: "completed",
      prescription: "Observation, Follow-up in 6 months",
      symptoms: "Brown, waxy growth on back, no pain or itching",
      diagnosis:
        "Benign seborrheic keratosis confirmed through dermoscopic examination. This is a common, non-cancerous skin growth that typically appears with age.",
      treatment:
        "No treatment required at this time. The lesion is benign and poses no health risk. Monitor for any changes in size, color, or texture.",
      followUp:
        "Routine follow-up in 6 months. Return sooner if any changes are noticed in the lesion's appearance.",
      severity: "Benign",
    },
    {
      id: 3,
      condition: "Contact Dermatitis",
      doctor: "Dr. Sarah Johnson",
      date: "2024-04-15",
      status: "completed",
      prescription: "Topical corticosteroid, Avoid allergen exposure",
      symptoms: "Red, swollen skin on hands after using new detergent",
      diagnosis:
        "Allergic contact dermatitis likely caused by exposure to fragrances or preservatives in household detergent. Patch testing may be considered if reactions persist.",
      treatment:
        "Apply topical corticosteroid cream twice daily for 7-10 days. Switch to fragrance-free, hypoallergenic detergents. Wear gloves when handling cleaning products.",
      followUp:
        "Symptoms should resolve within 1-2 weeks. Contact if no improvement or if reactions occur with other products.",
      severity: "Mild",
    },
  ];

  const recentChats = [
    {
      id: 1,
      conversationId: "1",
      doctor: "Dr. Sarah Johnson",
      specialty: "Dermatology",
      lastMessage:
        "Based on the image you shared, this appears to be a mild case of eczema. I recommend starting with a gentle moisturizer twice daily...",
      time: "2 hours ago",
      unread: true,
      avatar: "SJ",
    },
    {
      id: 2,
      conversationId: "2",
      doctor: "Dr. Michael Chen",
      specialty: "Pediatric Dermatology",
      lastMessage:
        "Your skin condition has improved significantly. Continue with the current treatment plan and we'll reassess in two weeks...",
      time: "1 day ago",
      unread: false,
      avatar: "MC",
    },
  ];

  const handleChatClick = (conversationId: string) => {
    navigate(`/patient/chat?conversation=${conversationId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <PatientHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, John!
          </h1>
          <p className="text-gray-600">
            Manage your skin health consultations and track your progress with
            our expert dermatologists
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <NewConsultationButton />

          <Link to="/patient/chat">
            <Card className="shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Active Chats
                </h3>
                <p className="text-sm text-gray-600">
                  {recentChats.length} ongoing conversations with doctors
                </p>
                {recentChats.some((chat) => chat.unread) && (
                  <Badge className="mt-2 bg-red-100 text-red-800">
                    New Messages
                  </Badge>
                )}
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upcoming Consultations */}
            <UpcomingConsultations />

            {/* Recent Messages */}
            <ChatList
              title="Recent Messages"
              description="Latest communications with your doctors"
              icon={MessageCircle}
              items={recentChats.map((chat) => ({
                ...chat,
                id: chat.id.toString(),
              }))}
              type="patient"
              onClick={handleChatClick}
            />
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Past Diagnoses */}

            <PastDiagnosis pastDiagnosesList={pastDiagnoses} />

            {/* Health Tips */}
            <DailyTips />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
