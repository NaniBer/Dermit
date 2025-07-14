import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Consultation } from "@/types/models";
import { ConsultationStatus, ConsultationPriority } from "@/types/models";

export function useConsultations({ userId, doctorId, status }: { userId?: string; doctorId?: string; status?: string }) {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [popupConsultation, setPopupConsultation] = useState<Consultation | null>(null);

  const fetchConsultations = async () => {
    let query = supabase.from("consultations").select("*");
    if (userId) query = query.eq("patient_id", userId);
    if (doctorId) query = query.eq("doctor_id", doctorId);
    if (status) query = query.eq("status", status);
    query = query.order("created_at", { ascending: false });
    try {
      const { data, error } = await query;
      if (error) {
        console.error("Error fetching consultations:", error);
        return;
      }
      setConsultations((data || []).map((c: any) => ({
        ...c,
        status: c.status as ConsultationStatus,
        priority: c.priority as ConsultationPriority,
      })));
    } catch (error) {
      console.error("Error in fetchConsultations:", error);
    }
  };

  useEffect(() => {
    if (!userId) return;

    fetchConsultations();

    const channel = supabase
      .channel("consultations")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "consultations",
          filter: "status=eq.pending",
        },
        (payload) => {
          const newConsult = payload.new;
          console.log(
            "New consultation request from useConsultations:",
            newConsult
          );
          setConsultations((prev) => [
            {
              ...newConsult,
              status: newConsult.status as ConsultationStatus,
              priority: newConsult.priority as ConsultationPriority,
            } as Consultation,
            ...prev,
          ]);
          setPopupConsultation({
            ...newConsult,
            status: newConsult.status as ConsultationStatus,
            priority: newConsult.priority as ConsultationPriority,
          } as Consultation);
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
          const updatedConsultation = payload.new;
          // Remove from pending list if status changed
          if (updatedConsultation.status !== "pending") {
            setConsultations((prev) =>
              prev.filter((c) => c.id !== updatedConsultation.id)
            );
          }
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("✅ Listening to consultations channel!");
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, doctorId, status]);

  return {
    consultations,
    popupConsultation,
    setPopupConsultation,
    refetch: fetchConsultations,
  };
}
