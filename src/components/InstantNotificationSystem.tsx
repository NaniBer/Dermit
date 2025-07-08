import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, User, Clock, Stethoscope, X } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Consultation = Database["public"]["Tables"]["consultations"]["Row"];

interface InstantNotificationProps {
  onBadgeCountChange: (count: number) => void;
}

const InstantNotificationSystem = ({ onBadgeCountChange }: InstantNotificationProps) => {
  const [activeNotifications, setActiveNotifications] = useState<any[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const channelRef = useRef<any>(null);

  useEffect(() => {
    if (!user || toast === undefined) return;
    if (channelRef.current) return; // Already subscribed

    const setup = async () => {
      // Check if user is a doctor
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "doctor")
        .single();

      if (!data) return;

      // Get initial count of pending consultations
      const { data: pendingConsultations } = await supabase
        .from("consultations")
        .select("id")
        .eq("status", "pending");
      
      onBadgeCountChange(pendingConsultations?.length || 0);

      const channel = supabase
        .channel("instant-notifications")
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
            const chiefComplaintMatch = description.match(/Chief Complaint: ([^\n]+)/);
            const chiefComplaint = chiefComplaintMatch
              ? chiefComplaintMatch[1]
              : newConsultation.title;

            // Update badge count immediately
            supabase
              .from("consultations")
              .select("id")
              .eq("status", "pending")
              .then(({ data }) => {
                onBadgeCountChange(data?.length || 0);
              });

            // Create instant notification with enhanced styling
            const notificationId = `notification-${newConsultation.id}`;
            
            toast({
              title: "🚨 URGENT: New Patient Request",
              description: (
                <Card className="bg-gradient-to-br from-blue-50 via-white to-green-50 border-2 border-blue-300 shadow-2xl">
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      {/* Patient Info Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center animate-pulse">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="font-bold text-blue-900">
                              Patient #{newConsultation.patient_id.slice(0, 8)}
                            </div>
                            <div className="flex items-center space-x-2 text-xs text-blue-600">
                              <Clock className="w-3 h-3" />
                              <span>Just requested consultation</span>
                            </div>
                          </div>
                        </div>
                        <Badge
                          className={`animate-bounce font-bold ${
                            newConsultation.priority === "urgent"
                              ? "bg-red-500 text-white border-red-300"
                              : newConsultation.priority === "high"
                              ? "bg-orange-500 text-white border-orange-300"
                              : "bg-blue-500 text-white border-blue-300"
                          }`}
                        >
                          {newConsultation.priority?.toUpperCase()} PRIORITY
                        </Badge>
                      </div>

                      {/* Chief Complaint */}
                      <div className="bg-white/90 p-4 rounded-lg border-l-4 border-blue-500 shadow-inner">
                        <div className="flex items-center space-x-2 mb-2">
                          <Stethoscope className="w-4 h-4 text-blue-600" />
                          <span className="font-semibold text-blue-900">Chief Complaint:</span>
                        </div>
                        <p className="text-blue-800 font-medium italic">
                          "{chiefComplaint}"
                        </p>
                      </div>

                      {/* Call to Action */}
                      <div className="bg-gradient-to-r from-green-100 to-blue-100 p-3 rounded-lg border border-green-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Bell className="w-5 h-5 text-green-600 animate-bounce" />
                            <span className="font-semibold text-green-800">
                              Patient is waiting for your response...
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ),
              action: (
                <Button
                  onClick={() => handleAccept(newConsultation.id)}
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 animate-pulse"
                  size="default"
                >
                  🩺 Accept & Start Chat
                </Button>
              ),
              duration: 60000, // 1 minute for urgent notifications
            });
          }
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "consultations",
          },
          (payload) => {
            const updatedConsultation = payload.new as Consultation;
            if (updatedConsultation.status !== "pending") {
              // Update badge count when consultation is no longer pending
              supabase
                .from("consultations")
                .select("id")
                .eq("status", "pending")
                .then(({ data }) => {
                  onBadgeCountChange(data?.length || 0);
                });
            }
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
  }, [user, toast, onBadgeCountChange]);

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
        title: "✅ Consultation Accepted!",
        description: "You've been assigned to this patient. Opening chat interface...",
        duration: 3000,
      });

      // Immediate redirect to chat
      setTimeout(() => {
        navigate(`/doctor/consultation/${consultationId}`);
      }, 500);
    } catch (error) {
      console.error("Error accepting consultation:", error);
      toast({
        title: "❌ Error",
        description: "Failed to accept consultation. Please try again.",
        variant: "destructive",
      });
    }
  };

  return null;
};

export default InstantNotificationSystem;