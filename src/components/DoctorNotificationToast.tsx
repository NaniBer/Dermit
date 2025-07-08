import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, AlertCircle, Clock, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import type { Database } from "@/integrations/supabase/types";

type Consultation = Database["public"]["Tables"]["consultations"]["Row"];

interface ConsultationWithDetails extends Consultation {
  chiefComplaint?: string;
}

const DoctorNotificationToast = () => {
  const [pendingConsultations, setPendingConsultations] = useState<
    ConsultationWithDetails[]
  >([]);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    // Check if user is a doctor
    const checkDoctorRole = async () => {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "doctor")
        .single();

      if (!data) return; // Not a doctor, don't show notifications

      // Subscribe to new consultation requests
      const channel = supabase
        .channel("doctor-notifications")
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

            // Extract chief complaint
            const description = newConsultation.description || "";
            const chiefComplaintMatch = description.match(
              /Chief Complaint: ([^\n]+)/
            );
            const chiefComplaint = chiefComplaintMatch
              ? chiefComplaintMatch[1]
              : newConsultation.title;

            const consultationWithDetails: ConsultationWithDetails = {
              ...newConsultation,
              chiefComplaint,
            };

            setPendingConsultations((prev) => {
              if (prev.some((c) => c.id === consultationWithDetails.id))
                return prev;
              return [consultationWithDetails, ...prev];
            });
          }
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "consultations",
            filter: "status=neq.pending",
          },
          (payload) => {
            const updatedConsult = payload.new as Consultation;
            setPendingConsultations((prev) =>
              prev.filter((c) => c.id !== updatedConsult.id)
            );
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };

    checkDoctorRole();
  }, [user]);

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

      // Remove from pending list
      setPendingConsultations((prev) =>
        prev.filter((c) => c.id !== consultationId)
      );

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

  const dismissNotification = (consultationId: string) => {
    setPendingConsultations((prev) =>
      prev.filter((c) => c.id !== consultationId)
    );
  };

  if (pendingConsultations.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {pendingConsultations.map((consultation) => (
        <Card
          key={consultation.id}
          className="border-blue-200 bg-blue-50 shadow-lg animate-in slide-in-from-right"
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-blue-900 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4" />
                <span>New Consultation Request</span>
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => dismissNotification(consultation.id)}
                className="h-6 w-6 p-0 hover:bg-blue-100"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-800">
                  Patient ID: {consultation.patient_id.slice(0, 8)}...
                </span>
              </div>

              <div>
                <p className="text-sm font-medium text-blue-900 mb-1">
                  Chief Complaint:
                </p>
                <p className="text-sm text-blue-700 bg-white/50 p-2 rounded border">
                  {consultation.chiefComplaint || consultation.title}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="w-3 h-3 text-blue-600" />
                  <span className="text-xs text-blue-600">
                    {new Date(consultation.created_at!).toLocaleTimeString()}
                  </span>
                </div>
                <Badge
                  className={
                    consultation.priority === "urgent"
                      ? "bg-red-100 text-red-800"
                      : consultation.priority === "high"
                      ? "bg-orange-100 text-orange-800"
                      : "bg-blue-100 text-blue-800"
                  }
                >
                  {consultation.priority}
                </Badge>
              </div>

              <Button
                onClick={() => handleAccept(consultation.id)}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
                size="sm"
              >
                Accept Consultation
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DoctorNotificationToast;
