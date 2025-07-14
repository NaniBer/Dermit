import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useConsultations(user: any) {
  const [consultations, setConsultations] = useState([]);
  const [popupConsultation, setPopupConsultation] = useState(null);

  const fetchConsultations = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("consultations")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching consultations:", error);
        return;
      }

      setConsultations(data || []);
    } catch (error) {
      console.error("Error in fetchConsultations:", error);
    }
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
          console.log(
            "New consultation request from useConsultations:",
            newConsult
          );
          setConsultations((prev) => [newConsult, ...prev]);
          setPopupConsultation(newConsult);
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
  }, [user]);

  return {
    consultations,
    popupConsultation,
    setPopupConsultation,
    refetch: fetchConsultations,
  };
}
