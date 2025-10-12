import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Clock, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const PendingPayments = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pendingConsultations, setPendingConsultations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingPayments = async () => {
      if (!user) return;

      try {
        // Fetch consultations that are accepted but awaiting payment
        const { data, error } = await supabase
          .from("consultations")
          .select("*")
          .eq("patient_id", user.id)
          .eq("status", "accepted_awaiting_payment")
          .order("created_at", { ascending: false });

        if (error) throw error;

        setPendingConsultations(data || []);
      } catch (error) {
        console.error("Error fetching pending payments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingPayments();

    // Subscribe to real-time updates for payment status changes
    const channel = supabase
      .channel("pending-payments")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "consultations",
          filter: `patient_id=eq.${user?.id}`,
        },
        (payload) => {
          const updatedConsultation = payload.new;
          
          // Remove from pending list if payment completed or consultation cancelled
          if (updatedConsultation.status !== "accepted_awaiting_payment") {
            setPendingConsultations((prev) =>
              prev.filter((c) => c.id !== updatedConsultation.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-sm text-gray-600 mt-2">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  if (pendingConsultations.length === 0) {
    return null; // Don't show card if no pending payments
  }

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center text-orange-900">
          <AlertCircle className="w-5 h-5 mr-2" />
          Pending Payments
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {pendingConsultations.map((consultation) => (
          <div
            key={consultation.id}
            className="bg-white rounded-lg p-4 space-y-2 border border-orange-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{consultation.title}</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Priority: <span className="capitalize">{consultation.priority}</span>
                </p>
              </div>
              <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300">
                Payment Required
              </Badge>
            </div>

            <div className="flex items-center text-sm text-orange-700 bg-orange-100 rounded px-3 py-2">
              <Clock className="w-4 h-4 mr-2" />
              Complete payment within 15 minutes or consultation will be cancelled
            </div>

            <Button
              onClick={() => navigate(`/patient/payment/${consultation.id}`)}
              className="w-full"
              size="sm"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Complete Payment
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default PendingPayments;
