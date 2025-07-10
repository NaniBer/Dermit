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
    console.log("useConsultations effect triggered");
    console.log(user);
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
          console.log(
            "New consultation request from useconsulation:",
            newConsult
          );
          setConsultations((prev) => [newConsult, ...prev]);
          setPopupConsultation(newConsult);
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("✅ Listening to consultations channel!");
        }
      });
    // console.log("Subscribed to consultations channel:", channel);

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
