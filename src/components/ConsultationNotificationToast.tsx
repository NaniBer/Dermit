import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Clock, User, Stethoscope, Bell } from "lucide-react";
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

            // Create an enhanced instant notification popup
            toast({
              title: "🚨 New Patient Consultation",
              description: (
                <Card className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 shadow-lg mt-2">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-blue-900">
                            Patient ID: {newConsultation.patient_id.slice(0, 8)}...
                          </span>
                          <div className="flex items-center space-x-2 mt-1">
                            <Clock className="w-3 h-3 text-blue-600" />
                            <span className="text-xs text-blue-600">
                              Just now
                            </span>
                          </div>
                        </div>
                        <Badge
                          className={`ml-auto animate-pulse ${
                            newConsultation.priority === "urgent"
                              ? "bg-red-500 text-white"
                              : newConsultation.priority === "high"
                              ? "bg-orange-500 text-white"
                              : "bg-blue-500 text-white"
                          }`}
                        >
                          {newConsultation.priority?.toUpperCase()}
                        </Badge>
                      </div>

                      <div className="bg-white/80 p-3 rounded-lg border border-blue-100">
                        <p className="text-sm font-semibold text-blue-900 mb-2 flex items-center">
                          <Stethoscope className="w-4 h-4 mr-2" />
                          Chief Complaint:
                        </p>
                        <p className="text-sm text-blue-800 font-medium">
                          "{chiefComplaint}"
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center space-x-2 text-blue-600">
                          <Bell className="w-4 h-4 animate-bounce" />
                          <span className="text-sm font-medium">Patient is waiting...</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ),
              action: (
                <Button
                  onClick={() => handleAccept(newConsultation.id)}
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 animate-pulse"
                  size="sm"
                >
                  Accept Now
                </Button>
              ),
              duration: 45000, // Longer duration for important notifications
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
