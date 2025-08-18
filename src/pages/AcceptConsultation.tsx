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

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate(`/login?redirect=/consultation/${consultationId}/accept`);
      return;
    }
    (async () => {
      try {
        // Fetch role for logged-in user
        const { data: roleData, error: roleError } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .maybeSingle<UserRole>();

        if (roleError || !roleData) {
          setError("Failed to verify your permissions.");
          setLoading(false);
          return;
        }

        if (roleData.role !== "doctor") {
          setError("You do not have permission to accept consultations.");
          setLoading(false);
          return;
        }

        // Check if consultation already accepted by this doctor
        const { data: consultation, error: consultError } = await supabase
          .from("consultations")
          .select("id, doctor_id, status")
          .eq("id", consultationId)
          .maybeSingle<Consultation>();
        console.log(consultation, consultError);

        if (consultError) throw consultError;
        if (
          consultation &&
          consultation.doctor_id === user.id &&
          consultation.status === "in_progress"
        ) {
          setAlreadyAccepted(true);
          setLoading(false);
          return;
        }

        // If not accepted yet, try to accept
        const { data, error: updateError } = await supabase
          .from("consultations")
          .update({
            doctor_id: user.id,
            status: "in_progress",
          })
          .eq("id", consultationId)
          .eq("status", "pending") // only accept if still pending
          .select()
          .maybeSingle();

        if (updateError) throw updateError;

        if (!data) {
          setError(
            "This consultation has already been accepted by another doctor."
          );
          setLoading(false);
          return;
        }
        // await createChat(data);

        // Success! Redirect to chat
        navigate(`/doctor/consultation/${consultationId}/`);
      } catch (err) {
        setError(err.message || "Failed to accept consultation.");
        setLoading(false);
      }
    })();
  }, [user, authLoading, consultationId, navigate]);
  const createChat = async (consultation: {
    id: string;
    doctor_id: string;
    patient_id: string;
  }) => {
    const { error: chatError } = await supabase.from("chats").insert([
      {
        consultation_id: consultation.id,
        doctor_id: user.id,
        patient_id: consultation.patient_id,
        status: "active", // or "open", "in_progress", whatever fits your logic
      },
    ]);

    if (chatError) {
      console.error("Failed to create chat:", chatError);
      // Optionally toast this or show error somewhere
    } else {
      console.log("✅ Chat created for consultation:", consultation.id);
    }
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
        <button
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => navigate("/doctor/dashboard")}
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  if (alreadyAccepted) {
    return (
      <div className="p-6 max-w-md mx-auto mt-20 text-center text-green-700">
        <CheckCircle className="mx-auto mb-4 w-12 h-12" />
        <h2 className="text-2xl font-bold mb-4">
          You have already accepted this consultation.
        </h2>
        <Button
          onClick={() => navigate(`/dcotor/consultation/${consultationId}`)}
          className="mt-4"
        >
          Go to Chat
        </Button>
      </div>
    );
  }

  // The code should never reach here
  return null;
};

export default AcceptConsultationPage;
