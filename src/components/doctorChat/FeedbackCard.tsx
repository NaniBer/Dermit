import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Feedback {
  rating: number;
  feedback_message: string;
}

interface FeedbackCardProps {
  consultationId: string;
}

const FeedbackCard: React.FC<FeedbackCardProps> = ({ consultationId }) => {
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchFeedback = async (id: string) => {
      try {
        const { data, error } = await supabase
          .from("patient_feedback")
          .select("rating, feedback_message")
          .eq("consultation_id", id)
          .maybeSingle<Feedback>();
        if (error) throw error;
        console.log("Feedback data:", data);
        setFeedback(data);
      } catch (error) {
        console.error("Error fetching feedback:", error);
        toast({
          title: "Error",
          description: "Failed to load feedback",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback(consultationId);
  }, [consultationId, toast]);

  if (loading) return <p>Loading feedback...</p>;
  if (!feedback) return null;

  return (
    <Card className="shadow-lg mb-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Feedback</CardTitle>
        <CardDescription className="mt-2 text-sm text-gray-600">
          {feedback.feedback_message || "No feedback provided."}
        </CardDescription>
        <div className="mt-4 flex gap-1">
          {[1, 2, 3, 4, 5].map((num) => (
            <Star
              key={num}
              className={`w-5 h-5 transition-transform hover:scale-105 ${
                feedback.rating >= num ? "text-brand-primary" : "text-gray-300"
              }`}
              fill={feedback.rating >= num ? "#3BC4B2" : "white"}
              color={
                feedback.rating >= num ? "hsl(var(--brand-primary))" : "#D1D5DB"
              }
            />
          ))}
        </div>
      </CardHeader>
    </Card>
  );
};

export default FeedbackCard;
