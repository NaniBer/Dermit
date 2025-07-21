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
  onBadgeCountChange: (count: number | ((prev: number) => number)) => void;
}

const InstantNotificationSystem = ({
  onBadgeCountChange,
}: InstantNotificationProps) => {
  const [activeNotifications, setActiveNotifications] = useState<any[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const channelRef = useRef<any>(null);

  useEffect(() => {
    if (!user || !toast) return;
    if (channelRef.current) return; // Already subscribed

    const setup = async () => {
      // Check if user is a doctor
      const { data: doctorCheck } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "doctor")
        .single();

      if (!doctorCheck) return; // Not a doctor

      // Get initial pending consultations count
      const { data: initialConsultations } = await supabase
        .from("consultations")
        .select("id")
        .eq("status", "pending");

      onBadgeCountChange(initialConsultations?.length || 0);

      // Subscribe to live consultation broadcasts
      const channel = supabase
        .channel("consultations")
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
            console.log("New consultation request:", newConsultation);

            // Extract chief complaint from description
            const description = newConsultation.description || "";
            const chiefComplaintMatch = description.match(
              /Chief Complaint: ([^\n]+)/
            );
            const chiefComplaint =
              chiefComplaintMatch?.[1] || newConsultation.title;

            // Instantly update badge count
            onBadgeCountChange((prev) => prev + 1);

            // Show instant live notification - no storage, direct broadcast
            toast({
              title: "🚨 LIVE: New Patient Request",
              description: (
                <Card className="bg-gradient-to-br from-blue-50 via-white to-green-50 border-2 border-blue-300 shadow-2xl">
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full flex items-center justify-center animate-pulse">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="font-bold text-blue-900">
                              Patient #{newConsultation.patient_id.slice(0, 8)}
                            </div>
                            <div className="flex items-center space-x-2 text-xs text-blue-600">
                              <Clock className="w-3 h-3" />
                              <span>Just requested help</span>
                            </div>
                          </div>
                        </div>
                        <Badge
                          className={`animate-bounce font-bold ${
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

                      <div className="bg-white/90 p-4 rounded-lg border-l-4 border-blue-500 shadow-inner">
                        <div className="flex items-center space-x-2 mb-2">
                          <Stethoscope className="w-4 h-4 text-blue-600" />
                          <span className="font-semibold text-blue-900">
                            Chief Complaint:
                          </span>
                        </div>
                        <p className="text-blue-800 font-medium italic">
                          "{chiefComplaint}"
                        </p>
                      </div>

                      <div className="bg-gradient-to-r from-green-100 to-blue-100 p-3 rounded-lg border border-green-200">
                        <div className="flex items-center space-x-2">
                          <Bell className="w-5 h-5 text-green-600 animate-bounce" />
                          <span className="font-semibold text-green-800">
                            Patient waiting for response...
                          </span>
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
              duration: 0, // Keep visible until manually dismissed
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
            console.log("Consultation updated:", updatedConsultation);
            if (updatedConsultation.status !== "pending") {
              // Instantly update badge when consultation no longer pending
              onBadgeCountChange((prev) => Math.max(0, prev - 1));
            }
          }
        )
        .subscribe((status) => {
          if (status === "SUBSCRIBED") {
            console.log("✅ Listening to consultations channel!");
          }
        });

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
      // 1. Update consultation status and assign doctor
      const { error: consultationError } = await supabase
        .from("consultations")
        .update({
          doctor_id: user.id,
          status: "in_progress",
        })
        .eq("id", consultationId);

      if (consultationError) throw consultationError;

      // 2. Get consultation details for chat creation
      const { data: consultation } = await supabase
        .from("consultations")
        .select("patient_id, doctor_id")
        .eq("id", consultationId)
        .single();

      if (!consultation) throw new Error("Consultation not found");

      // 3. Create a new chat entry
      const { data: chatData, error: chatError } = await supabase
        .from("chats")
        .insert({
          consultation_id: consultationId,
          doctor_id: user.id,
          patient_id: consultation.patient_id,
          status: "active",
        })
        .select()
        .single();

      if (chatError) throw chatError;

      toast({
        title: "✅ Consultation Accepted!",
        description:
          "You've been assigned to this patient. Opening chat interface...",
        duration: 3000,
      });

      // Immediate redirect to chat using chat_id
      setTimeout(() => {
        navigate(`/doctor/chat/${chatData.id}`);
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
