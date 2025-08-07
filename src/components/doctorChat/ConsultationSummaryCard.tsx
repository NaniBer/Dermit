import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import React, { useEffect, useState } from "react";

export interface ConsultationSummary {
  id: string;
  observations?: string;
  diagnosis?: string;
  treatment_plan?: string;
  status?: string;
}

type Props = {
  consultation: ConsultationSummary;
  setConsultation: React.Dispatch<React.SetStateAction<ConsultationSummary>>;
};

export const ConsultationSummaryCard: React.FC<Props> = ({
  consultation,
  setConsultation,
}) => {
  const [isEditing, setIsEditing] = useState(true);

  useEffect(() => {
    if (consultation.status === "completed") {
      setIsEditing(false);
    }
  }, [consultation.status]);

  const handleSave = async () => {
    const { error } = await supabase
      .from("consultations")
      .update({
        observations: consultation.observations,
        diagnosis: consultation.diagnosis,
        treatment_plan: consultation.treatment_plan,
      })
      .eq("id", consultation.id);

    if (error) {
      toast({
        title: "Save Failed 😢",
        description: "Could not save summary. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Summary Saved 🎉",
        description: "Consultation summary updated successfully.",
      });
      setIsEditing(false); // back to view mode
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg">Consultation Summary</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {isEditing ? (
          <>
            <div className="space-y-2">
              <label className="font-medium">Observations / Findings</label>
              <Textarea
                placeholder="E.g. No visible rash. Photos indicate mild eczema."
                className="min-h-[100px]"
                value={consultation.observations || ""}
                onChange={(e) =>
                  setConsultation({
                    ...consultation,
                    observations: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="font-medium">Diagnosis / Impression</label>
              <Textarea
                placeholder="E.g. Likely contact dermatitis."
                className="min-h-[100px]"
                value={consultation.diagnosis || ""}
                onChange={(e) =>
                  setConsultation({
                    ...consultation,
                    diagnosis: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="font-medium">
                Treatment Plan / Advice Given
              </label>
              <Textarea
                placeholder="E.g. Apply hydrocortisone cream twice daily. Avoid scented soaps."
                className="min-h-[100px]"
                value={consultation.treatment_plan || ""}
                onChange={(e) =>
                  setConsultation({
                    ...consultation,
                    treatment_plan: e.target.value,
                  })
                }
              />
            </div>

            <div className="flex gap-4">
              <Button
                className="bg-gradient-to-r from-brand-primary to-brand-secondary w-full"
                onClick={handleSave}
              >
                Save Summary
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <div>
              <p className="font-medium mb-1">Observations / Findings</p>
              <p className="text-gray-700 whitespace-pre-wrap">
                {consultation.observations || "—"}
              </p>
            </div>

            <div>
              <p className="font-medium mb-1">Diagnosis / Impression</p>
              <p className="text-gray-700 whitespace-pre-wrap">
                {consultation.diagnosis || "—"}
              </p>
            </div>

            <div>
              <p className="font-medium mb-1">Treatment Plan / Advice Given</p>
              <p className="text-gray-700 whitespace-pre-wrap">
                {consultation.treatment_plan || "—"}
              </p>
            </div>
            {consultation.status !== "completed" && (
              <Button
                className="w-full bg-gradient-to-r from-brand-secondary to-brand-primary"
                onClick={() => setIsEditing(true)}
              >
                Edit Summary
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
