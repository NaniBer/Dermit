import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, User, Clock, Stethoscope } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { SecureConsultation, isSecureConsultation, sanitizeInput } from "@/lib/securityTypes";

interface ConsultationWithDetails extends SecureConsultation {
  chiefComplaint?: string;
}

interface NotificationDropdownProps {
  badgeCount?: number;
}

const NotificationDropdown = ({
  badgeCount = 0,
}: NotificationDropdownProps) => {
  const [pendingConsultations, setPendingConsultations] = useState<
    ConsultationWithDetails[]
  >([]);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch pending consultations from supabase
  const fetchPendingConsultations = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("consultations")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const consultationsWithDetails = (data || []).map((consultation: any) => {
        if (!isSecureConsultation(consultation)) {
          console.error("Invalid consultation data");
          return null;
        }
        const description = consultation.description || "";
        const chiefComplaintMatch = description.match(
          /Chief Complaint: ([^\n]+)/
        );
        const chiefComplaint = sanitizeInput(chiefComplaintMatch
          ? chiefComplaintMatch[1]
          : consultation.title);

        return {
          ...consultation,
          chiefComplaint,
        };
      }).filter(Boolean);

      setPendingConsultations(consultationsWithDetails);
    } catch (error) {
      console.error("Error fetching pending consultations:", error);
    }
  };

  useEffect(() => {
    if (!user) return;

    // Initial fetch to get the current pending consultations
    fetchPendingConsultations();

    // Set up the real-time subscription channel
    const channel = supabase
      .channel("notification-dropdown")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "consultations",
          filter: "status=eq.pending",
        },
        (payload) => {
          const newConsultation = payload.new as SecureConsultation;
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
            // Prevent duplicates just in case
            if (prev.some((c) => c.id === consultationWithDetails.id))
              return prev;
            return [consultationWithDetails, ...prev];
          });

          // Live notification already handled by InstantNotificationSystem
          // Just update the dropdown list
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
          const updatedConsultation = payload.new as SecureConsultation;
          if (updatedConsultation.status !== "pending") {
            setPendingConsultations((prev) =>
              prev.filter((c) => c.id !== updatedConsultation.id)
            );
          }
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, toast]);

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

      setIsOpen(false);

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

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="w-4 h-4" />
          {(badgeCount > 0 || pendingConsultations.length > 0) && (
            <Badge
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500 text-white animate-pulse shadow-lg"
              variant="destructive"
            >
              {Math.max(badgeCount, pendingConsultations.length) > 99
                ? "99+"
                : Math.max(badgeCount, pendingConsultations.length)}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-96 max-h-96 overflow-y-auto p-0"
      >
        <div className="p-4 border-b">
          <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
            <Stethoscope className="w-4 h-4" />
            <span>Consultation Requests</span>
          </h3>
          <p className="text-sm text-gray-600">
            {pendingConsultations.length} pending request
            {pendingConsultations.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {pendingConsultations.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p>No pending consultation requests</p>
            </div>
          ) : (
            <div className="space-y-2 p-2">
              {pendingConsultations.map((consultation) => (
                <Card
                  key={consultation.id}
                  className="border-blue-200 bg-blue-50/50 hover:bg-blue-50 transition-colors cursor-pointer"
                  onClick={() =>
                    navigate(`/doctor/consultation/${consultation.id}`)
                  }
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-900">
                            Patient ID: {consultation.patient_id.slice(0, 8)}...
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

                      <div>
                        <p className="text-sm font-medium text-blue-900 mb-1">
                          Chief Complaint:
                        </p>
                        <p className="text-sm text-blue-700 bg-white/50 p-2 rounded border">
                          {consultation.chiefComplaint}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-3 h-3 text-blue-600" />
                          <span className="text-xs text-blue-600">
                            {new Date(
                              consultation.created_at!
                            ).toLocaleTimeString()}
                          </span>
                        </div>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAccept(consultation.id);
                          }}
                          className="bg-gradient-to-r from-brand-secondary to-brand-primary text-white"
                          size="sm"
                        >
                          Accept
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;
