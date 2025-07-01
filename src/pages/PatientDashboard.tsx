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

const PatientDashboard = () => {
  const navigate = useNavigate();

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
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="w-5 h-5 text-green-600" />
                  <span>Recent Messages</span>
                </CardTitle>
                <CardDescription>
                  Latest communications with your doctors
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentChats.length > 0 ? (
                  <div className="space-y-4">
                    {recentChats.map((chat) => (
                      <div
                        key={chat.id}
                        onClick={() => handleChatClick(chat.conversationId)}
                        className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-all duration-200 border border-gray-100 hover:border-gray-200 hover:shadow-md"
                      >
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-green-100 text-green-600">
                            {chat.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                {chat.doctor}
                              </h4>
                              <p className="text-xs text-gray-500">
                                {chat.specialty}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="text-sm text-gray-500">
                                {chat.time}
                              </span>
                              {chat.unread && (
                                <div className="w-2 h-2 bg-red-500 rounded-full ml-auto mt-1"></div>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {chat.lastMessage}
                          </p>
                          {chat.unread && (
                            <Badge className="mt-2 bg-blue-100 text-blue-800 text-xs">
                              New Message
                            </Badge>
                          )}
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

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Past Diagnoses */}

            <PastDiagnosis />

            {/* Health Tips */}
            <DailyTips />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
