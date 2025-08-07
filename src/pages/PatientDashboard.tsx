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
import ActiveChats from "@/components/patientDashboard/ActiveChats";
import MostRecentChat from "@/components/patientDashboard/MostRecentChat";

const PatientDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);

  // if (loading) {
  //   return (
  //     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
  //       <PatientHeader />
  //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  //         <div className="text-center py-12">
  //           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
  //           <p className="text-gray-600">Loading dashboard...</p>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

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
        <div className="grid md:grid-cols-1 gap-6 mb-8">
          <NewConsultationButton />
          <div className="grid md:grid-cols-2 gap-4">
            <MostRecentChat />
            <ActiveChats />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upcoming Consultations */}
            <UpcomingConsultations />

            {/* Recent Messages */}
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
