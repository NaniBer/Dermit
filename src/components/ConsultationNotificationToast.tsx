import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Clock, User } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Consultation = Database["public"]["Tables"]["consultations"]["Row"];

interface ConsultationWithDetails extends Consultation {
  chiefComplaint?: string;
}
interface Props {
  fetchNotifications: () => void;
}
const ConsultationNotificationToast = ({ fetchNotifications }: Props) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const channelRef = useRef<any>(null); // 👈🏽 Add this here

  useEffect(() => {
    if (!user || toast === undefined) return;
    console.log(channelRef.current); // Debugging line to check channelRef
    if (channelRef.current) return; // Already subscribed!

    const setup = async () => {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "doctor")
        .single();

      if (!data) return;

      const channel = supabase
        .channel("consultation-toast-notifications")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "consultations",
            filter: "status=eq.pending",
          },
          (payload) => {
            const newConsultation = payload.new as Consultation;
            const description = newConsultation.description || "";
            const chiefComplaintMatch = description.match(
              /Chief Complaint: ([^\n]+)/
            );
            const chiefComplaint = chiefComplaintMatch
              ? chiefComplaintMatch[1]
              : newConsultation.title;

            toast({
              title: "New Consultation Request",
              description: (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">
                      Patient ID: {newConsultation.patient_id.slice(0, 8)}...
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Chief Complaint:</p>
                    <p className="text-sm bg-gray-50 p-2 rounded border">
                      {chiefComplaint}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-3 h-3 text-blue-600" />
                      <span className="text-xs text-gray-600">
                        {new Date(
                          newConsultation.created_at!
                        ).toLocaleTimeString()}
                      </span>
                    </div>
                    <Badge
                      className={
                        newConsultation.priority === "urgent"
                          ? "bg-red-100 text-red-800"
                          : newConsultation.priority === "high"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-blue-100 text-blue-800"
                      }
                    >
                      {newConsultation.priority}
                    </Badge>
                  </div>
                </div>
              ),
              action: (
                <Button
                  onClick={() => handleAccept(newConsultation.id)}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
                  size="sm"
                >
                  Accept
                </Button>
              ),
              duration: 30000,
            });
          }
        )
        .subscribe();

      channelRef.current = channel;
    };

    setup();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [user, toast]);

  // keep the rest of your code (handleAccept, return null etc.) unchanged

  const handleAccept = async (consultationId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("consultations")
        .update({
          doctor_id: user.id,
          status: "in_progress",
        })
        .eq("id", consultationId);

      if (error) throw error;

      toast({
        title: "Consultation Accepted",
        description:
          "You have been assigned to this consultation. Redirecting to chat...",
      });

      // Redirect to consultation chat
      setTimeout(() => {
        navigate(`/doctor/consultation/${consultationId}`);
      }, 1000);
    } catch (error) {
      console.error("Error accepting consultation:", error);
      toast({
        title: "Error",
        description: "Failed to accept consultation. Please try again.",
        variant: "destructive",
      });
    }
  };

  return null; // This component only handles toast notifications
};

export default ConsultationNotificationToast;
