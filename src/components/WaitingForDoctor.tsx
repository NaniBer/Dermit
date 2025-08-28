import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, Stethoscope } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";

const WaitingForDoctor = () => {
  const [consultationStatus, setConsultationStatus] = useState<
    "looking" | "found"
  >("looking");
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (!user) return;

    // Subscribe to consultation updates for this user
    const channel = supabase
      .channel("consultation-updates")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "consultations",
          filter: `patient_id=eq.${user.id}`,
        },
        (payload) => {
          const consultation = payload.new;
          if (consultation.doctor_id && consultation.status === "in_progress") {
            setConsultationStatus("found");

            // Redirect to chat after 2 seconds
            setTimeout(() => {
              navigate(`/patient/consultation/${consultation.id}`);
            }, 2000);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, navigate]);

  if (consultationStatus === "found") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center shadow-xl border-0">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t("doctorFoundTitle")}
            </h2>
            <p className="text-gray-600 mb-6">{t("doctorFoundDescription")}</p>
            <div className="animate-pulse">
              <div className="w-8 h-1 bg-gradient-to-r from-brand-primary to-brand-secondary rounded mx-auto"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center shadow-xl border-0">
        <CardContent className="p-8">
          <div className="w-16 h-16 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full flex items-center justify-center mx-auto mb-6">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {t("lookingForDoctorsTitle")}
          </h2>
          <p className="text-gray-600 mb-6">
            {t("lookingForDoctorsDescription")}
          </p>
          <div className="space-y-3">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-brand-primary rounded-full animate-pulse"></div>
              <span>{t("sendingNotifications")}</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-brand-secondary rounded-full animate-pulse animation-delay-200"></div>
              <span>{t("waitingForResponse")} </span>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-200">
            <Link to="/patient/dashboard">
              <Button variant="outline" className="w-full">
                {t("returnToDashboard")}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WaitingForDoctor;
