import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useConsultations(user) {
  const [consultations, setConsultations] = useState([]);
  const [popupConsultation, setPopupConsultation] = useState(null);

  const fetchConsultations = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("consultations")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching consultations:", error);
      return;
    }

    setConsultations(data);
  };

  useEffect(() => {
    if (!user) return;

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
          setConsultations((prev) => [newConsult, ...prev]);
          setPopupConsultation(newConsult);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    consultations,
    popupConsultation,
    setPopupConsultation,
  };
}
