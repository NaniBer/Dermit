import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Loader2, CheckCircle, XCircle, Clock } from "lucide-react";
import PatientHeader from "@/components/PatientHeader";

const Payment = () => {
  const { id } = useParams(); // consultation_id
  const navigate = useNavigate();
  const { user, session } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  const [consultation, setConsultation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<
    "pending" | "processing" | "success" | "failed"
  >("pending");
  const [timeRemaining, setTimeRemaining] = useState(15 * 60); // 15 minutes in seconds

  // Fetch consultation details
  useEffect(() => {
    const fetchConsultation = async () => {
      if (!id) return;

      try {
        const { data, error } = await supabase
          .from("consultations")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          console.error("Error fetching consultation:", error);
          throw error;
        }

        if (!data) {
          throw new Error("Consultation not found");
        }

        setConsultation(data as any);

        // Check if payment is still required
        if ((data as any).status === "in_progress") {
          toast({
            title: "Payment Already Completed",
            description: "Redirecting to consultation...",
          });
          navigate(`/patient/consultation/${id}`);
        } else if ((data as any).status !== "accepted_awaiting_payment") {
          toast({
            title: "Invalid Payment Request",
            description: "This consultation is not awaiting payment.",
            variant: "destructive",
          });
          navigate("/patient/dashboard");
        }
      } catch (error) {
        console.error("Error fetching consultation:", error);
        toast({
          title: "Error",
          description: "Failed to load consultation details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchConsultation();
  }, [id, navigate, toast]);

  // Timer countdown for payment expiration (15 minutes)
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

  // Handle payment expiration - revert consultation to pending
  const handlePaymentExpiration = async () => {
    try {
      const { error } = await supabase
        .from("consultations")
        .update({
          status: "pending",
          doctor_id: null, // Release the doctor assignment
        })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Payment Time Expired",
        description:
          "The consultation has been returned to the queue. Please request again when ready.",
        variant: "destructive",
      });

      navigate("/patient/dashboard");
    } catch (error) {
      console.error("Error expiring consultation:", error);
    }
  };

  // SIMULATED PAYMENT PROCESSING
  // TODO: Replace this with real payment API integration (Stripe, PayPal, etc.)
  const handlePayment = async () => {
    setProcessing(true);
    setPaymentStatus("processing");

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      console.log("Backend URL:", backendUrl);
      const response = await fetch(`${backendUrl}/payment/initialize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          consultationId: id,
          patientId: user.id,
          amount: 150, // ETB
          email: user.email,
        }),
      });

      const { checkoutUrl } = await response.json();
      console.log("Payment response:", response, checkoutUrl);
      window.location.href = checkoutUrl;
      if (response.ok) {
        // update consultation to in_progress
        const { error: updateError } = await supabase
          .from("consultations")
          .update({ status: "in_progress" })
          .eq("id", id);

        if (updateError) throw updateError;

        setPaymentStatus("success");
        toast({
          title: "Payment Successful!",
          description: "Your consultation is now confirmed. Redirecting...",
        });

        setTimeout(() => {
          navigate(`/patient/consultation/${id}`);
        }, 2000);
      } else {
        throw new Error(result.message || "Payment failed");
      }
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentStatus("failed");

      toast({
        title: "Payment Failed",
        description: (error as Error).message || "Unable to process payment.",
        variant: "destructive",
      });

      setTimeout(() => {
        setPaymentStatus("pending");
        setProcessing(false);
      }, 3000);
    }
  };

  // Format time remaining
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
              {paymentStatus === "success" ? (
                <CheckCircle className="w-8 h-8 text-green-600" />
              ) : paymentStatus === "failed" ? (
                <XCircle className="w-8 h-8 text-red-600" />
              ) : paymentStatus === "processing" ? (
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              ) : (
                <CreditCard className="w-8 h-8 text-blue-600" />
              )}
            </div>

            <CardTitle className="text-2xl font-bold">
              {paymentStatus === "success"
                ? "Payment Successful!"
                : paymentStatus === "failed"
                ? "Payment Failed"
                : paymentStatus === "processing"
                ? "Processing Payment..."
                : "Complete Your Payment"}
            </CardTitle>

            {paymentStatus === "pending" && (
              <div className="flex items-center justify-center mt-4 text-orange-600">
                <Clock className="w-4 h-4 mr-2" />
                <span className="font-mono text-lg">
                  {formatTime(timeRemaining)}
                </span>
                <span className="text-sm ml-2">remaining</span>
              </div>
            )}
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

            {/* Payment Amount */}
            <div className="text-center py-4 border-t border-b">
              <p className="text-sm text-gray-600 mb-1">Consultation Fee</p>
              <p className="text-4xl font-bold text-gray-900">$50.00</p>
            </div>

            {/* Payment Button */}
            {paymentStatus === "pending" && (
              <Button
                onClick={handlePayment}
                disabled={processing}
                className="w-full py-6 text-lg"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5 mr-2" />
                    Pay Now
                  </>
                )}
              </Button>
            )}

            {/* Success Message */}
            {paymentStatus === "success" && (
              <div className="text-center space-y-2">
                <p className="text-green-600 font-medium">
                  Your payment has been confirmed!
                </p>
                <p className="text-sm text-gray-600">
                  Redirecting to your consultation...
                </p>
              </div>
            )}

            {/* Failure Message */}
            {paymentStatus === "failed" && (
              <div className="text-center space-y-2">
                <p className="text-red-600 font-medium">
                  Payment could not be processed.
                </p>
                <p className="text-sm text-gray-600">
                  Please try again or contact support.
                </p>
              </div>
            )}

            {/* Cancel Option */}
            {paymentStatus === "pending" && (
              <Button
                variant="outline"
                onClick={() => navigate("/patient/dashboard")}
                className="w-full"
                disabled={processing}
              >
                Cancel
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Payment;
