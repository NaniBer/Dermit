import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import {
  MessageCircle,
  Calendar,
  User,
  FileText,
  Clock,
  CheckCircle,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ConsultationList from "../patientConsultationPage/ConsultationList";

const MostRecentChat = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recentChat, setRecentChat] = useState([]); // single chat object or null
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentChat = async () => {
      if (!user) return;
      try {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const oneWeekAgoISO = oneWeekAgo.toISOString(); // e.g. "2025-08-01T12:34:56.789Z"

        const { data, error } = await supabase
          .from("consultations")
          .select("*")
          .eq("patient_id", user.id)
          .eq("status", "in_progress")
          .gte("created_at", oneWeekAgoISO)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (data) setRecentChat((prevChats) => [...prevChats, data]);

        if (error) throw error;
      } catch (error) {
        console.error("Error fetching recent chat:", error);
        setRecentChat(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentChat();
  }, [user]);

  const handleConsultationClick = (consultationId: string) => {
    navigate(`/patient/consultation/${consultationId}`);
  };

  if (loading) {
    return (
      <Card className="shadow-lg p-6 text-center">
        <p className="text-gray-500">Loading chats...</p>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
      <Card className="border border-gray-200 hover:shadow-md transition-all duration-300 bg-gradient-to-r from-white to-gray-50 cursor-pointer">
        <CardContent className="p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-brand-secondary to-brand-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">
            Most Recent Chats
          </h3>
        </CardContent>
        {recentChat.length === 0 ? (
          <div className="text-center py-3 pb-12 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg">No Recent Consultation yet</p>
            <p className="text-sm">Start your first consultation above!</p>
          </div>
        ) : (
          <ConsultationList
            consultations={recentChat}
            handleConsultationClick={handleConsultationClick}
          />
        )}
      </Card>
    </Card>
  );
};

export default MostRecentChat;
