import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type Consultation = Database["public"]["Tables"]["consultations"]["Row"];
type UserRole = Database["public"]["Tables"]["user_roles"]["Row"];

const AcceptConsultationPage = () => {
  const { consultationId } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alreadyAccepted, setAlreadyAccepted] = useState(false);
  const [waitingPayment, setWaitingPayment] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate(`/login?redirect=/consultation/${consultationId}/accept`);
      return;
    }

    const acceptConsultation = async () => {
      try {
        // 1️⃣ Verify user role
        const { data: roleData, error: roleError } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .maybeSingle<UserRole>();

        if (roleError || !roleData)
          throw new Error("Failed to verify permissions.");
        if (roleData.role !== "doctor")
          throw new Error(
            "You do not have permission to accept consultations."
          );

        // 2️⃣ Check if already accepted
        const { data: consultation, error: consultError } = await supabase
          .from("consultations")
          .select("id, doctor_id, status, patient_id")
          .eq("id", consultationId)
          .maybeSingle<Consultation>();

        if (consultError) throw consultError;
        if (
          consultation?.doctor_id === user.id &&
          consultation.status === "accepted_awaiting_payment"
        ) {
          setAlreadyAccepted(true);
          setWaitingPayment(true);
          setLoading(false);
          listenToPayment(consultationId);
          return;
        }

        // 3️⃣ Accept consultation if pending
        const { data, error: updateError } = await supabase
          .from("consultations")
          .update({
            doctor_id: user.id,
            status: "accepted_awaiting_payment",
          })
          .eq("id", consultationId)
          .eq("status", "pending")
          .select()
          .maybeSingle();

        if (updateError) throw updateError;
        if (!data)
          throw new Error(
            "This consultation has already been accepted by another doctor."
          );

        setWaitingPayment(true);
        setLoading(false);

        listenToPayment(consultationId);
      } catch (err) {
        setError(err.message || "Failed to accept consultation.");
        setLoading(false);
      }
    };

    acceptConsultation();
  }, [user, authLoading, consultationId, navigate]);

  // Listen to status change for patient payment
  const listenToPayment = (consultationId: string) => {
    const channel = supabase
      .channel("consultation-updates")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "consultations",
          filter: `id=eq.${consultationId}`,
        },
        (payload) => {
          const consultation = payload.new as Consultation;

          if (consultation.status === "in_progress") {
            // Patient has paid → redirect to consultation page
            navigate(`/doctor/consultation/${consultationId}`);
          }
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center shadow-xl border-0">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Loading…</h2>
            <p className="text-gray-600 mb-6">Please wait a moment...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-md mx-auto mt-20 text-center text-red-600">
        <h2 className="text-xl font-bold mb-4">Oops!</h2>
        <p>{error}</p>
        <Button onClick={() => navigate("/doctor/dashboard")} className="mt-4">
          Go to Dashboard
        </Button>
      </div>
    );
  }

  if (alreadyAccepted || waitingPayment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center shadow-xl border-0">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Waiting for patient payment…
            </h2>
            <p className="text-gray-600 mb-6">
              You will be redirected once the patient pays.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};

export default AcceptConsultationPage;
