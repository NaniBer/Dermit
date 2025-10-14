import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Loader2, Clock } from "lucide-react";
import PatientHeader from "@/components/PatientHeader";
import { Database } from "@/integrations/supabase/types";

type ConsultationRow = Database["public"]["Tables"]["consultations"]["Row"];

const Payment = () => {
  const { id } = useParams(); // consultation_id
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [consultation, setConsultation] = useState<ConsultationRow | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(15 * 60);

  // Fetch consultation
  useEffect(() => {
    const fetchConsultation = async () => {
      if (!id) return;

      try {
        const { data, error } = await supabase
          .from("consultations")
          .select("*")
          .eq("id", id)
          .single<ConsultationRow>();

        if (error) throw error;
        if (!data) throw new Error("Consultation not found");

        setConsultation(data);

        if (data.status === "in_progress") {
          toast({
            title: "Payment Already Completed",
            description: "Redirecting...",
          });
          navigate(`/patient/consultation/${id}`);
        } else if (data.status !== "accepted_awaiting_payment") {
          toast({ title: "Invalid Payment Request", variant: "destructive" });
          navigate("/patient/dashboard");
        }
      } catch (error) {
        console.error(error);
        toast({ title: "Error loading consultation", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    fetchConsultation();
  }, [id, navigate, toast]);

  // Timer for payment expiration
  useEffect(() => {
    if (consultation?.status !== "accepted_awaiting_payment") return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handlePaymentExpiration();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [consultation]);

  const handlePaymentExpiration = async () => {
    try {
      const { error } = await supabase
        .from("consultations")
        .update({ status: "pending", doctor_id: null })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Payment Time Expired",
        description: "Consultation returned to the queue.",
        variant: "destructive",
      });

      navigate("/patient/dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  const handlePayment = async () => {
    setProcessing(true);

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(`${backendUrl}/payment/initialize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          consultationId: id,
          patientId: user.id,
          amount: 150,
          email: user.email,
        }),
      });

      const result = await response.json();

      if (!result.checkoutUrl)
        throw new Error(result.message || "Payment failed");

      // Redirect user to Chapa checkout
      window.location.href = result.checkoutUrl;
    } catch (error) {
      console.error("Payment initialization error:", error);
      toast({
        title: "Payment Failed",
        description: (error as Error).message,
        variant: "destructive",
      });
      setProcessing(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <PatientHeader />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <PatientHeader />
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Card className="shadow-xl">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
              <CreditCard className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Complete Your Payment
            </CardTitle>
            <div className="flex items-center justify-center mt-4 text-orange-600">
              <Clock className="w-4 h-4 mr-2" />
              <span className="font-mono text-lg">
                {formatTime(timeRemaining)}
              </span>
              <span className="text-sm ml-2">remaining</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Consultation Summary */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <h3 className="font-semibold text-gray-900">
                Consultation Details
              </h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  <span className="font-medium">Title:</span>{" "}
                  {consultation?.title}
                </p>
                <p>
                  <span className="font-medium">Priority:</span>{" "}
                  {consultation?.priority}
                </p>
                <p>
                  <span className="font-medium">Status:</span>{" "}
                  {consultation?.status}
                </p>
              </div>
            </div>

            {/* Payment Button */}
            <Button
              onClick={handlePayment}
              disabled={processing}
              className="w-full py-6 text-lg"
            >
              {processing ? "Processing..." : "Pay Now"}
            </Button>

            {/* Cancel Option */}
            <Button
              variant="outline"
              onClick={() => navigate("/patient/dashboard")}
              className="w-full"
              disabled={processing}
            >
              Cancel
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Payment;
