import { useState, useEffect } from "react";
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
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const PatientDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user's consultations
  useEffect(() => {
    console.log("Fetching consultations for user:", user?.id);
    if (!user) return;

    const fetchConsultations = async () => {
      try {
        const { data, error } = await supabase
          .from("consultations")
          .select(
            `
            *,
            profiles!consultations_doctor_id_fkey (
              first_name,
              last_name
            )
          `
          )
          .eq("patient_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setConsultations(data || []);
      } catch (error) {
        console.error("Error fetching consultations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConsultations();
  }, [user]);

  // Transform consultations for ChatList component
  const recentChats = consultations.map((consultation) => ({
    id: consultation.id,
    conversationId: consultation.id,
    doctor:
      consultation.profiles?.first_name && consultation.profiles?.last_name
        ? `Dr. ${consultation.profiles.first_name} ${consultation.profiles.last_name}`
        : "Doctor Assigned",
    specialty: "Dermatology",
    lastMessage: consultation.description || "No description available",
    time: new Date(consultation.created_at).toLocaleDateString(),
    unread: consultation.status === "pending",
    avatar: consultation.profiles?.first_name?.[0] || "D",
  }));

  const handleChatClick = (conversationId: string) => {
    navigate(`/patient/chat?conversation=${conversationId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <PatientHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <PatientHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back,{" "}
            {user?.user_metadata?.first_name ||
              (user?.user_metadata?.full_name
                ? user.user_metadata.full_name.split(" ")[0]
                : "User")}
            !
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
                <div className="w-12 h-12 bg-gradient-to-r from-brand-secondary to-brand-primary rounded-full flex items-center justify-center mx-auto mb-4">
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
            {recentChats.length > 0 ? (
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
            ) : (
              <Card className="shadow-lg">
                <CardContent className="p-8 text-center">
                  <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No consultations yet
                  </h3>
                  <p className="text-gray-600">
                    Start your first consultation to begin chatting with doctors
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Past Diagnoses */}
            {/* <PastDiagnosis pastDiagnosesList={pastDiagnoses} /> */}

            {/* Health Tips */}
            {/* <DailyTips /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
