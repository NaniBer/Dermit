import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface PatientChatHeaderProps {
  consultationId: string;
}
interface ConsultationData {
  doctor_id: string | null;
}
interface DoctorData {
  first_name: string | null;
}

const PatientChatHeader: React.FC<PatientChatHeaderProps> = ({
  consultationId,
}) => {
  const [doctorName, setDoctorName] = useState<string | null>(null);
  const getDoctorNameFromConsultation = async (consultationId: string) => {
    // 1️⃣ Fetch consultation to get doctor_id
    const { data: consultation, error: consultError } = await supabase
      .from("consultations")
      .select("doctor_id")
      .eq("id", consultationId)
      .maybeSingle<ConsultationData>();

    if (consultError || !consultation?.doctor_id) {
      console.error("Failed to fetch consultation or doctor ID:", consultError);
      return null;
    }

    const doctorId = consultation.doctor_id;

    // 2️⃣ Fetch doctor's profile
    const { data: doctor, error: doctorError } = await supabase
      .from("profiles")
      .select("first_name") // or "name", "first_name", etc., based on your schema
      .eq("id", doctorId)
      .maybeSingle<DoctorData>();

    if (doctorError || !doctor) {
      console.error("Failed to fetch doctor profile:", doctorError);
      return null;
    }

    return doctor.first_name; // 🧠 Or whatever field you use for name
  };
  useEffect(() => {
    if (!consultationId) return;

    const fetchDoctorName = async () => {
      const name = await getDoctorNameFromConsultation(consultationId);
      setDoctorName(name);
    };

    fetchDoctorName();
  }, [consultationId]);
  return (
    <Card className="shadow-lg mb-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-blue-100 text-blue-600">
                DR
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">Dr. {doctorName}</CardTitle>
              <div className="flex items-center space-x-2">
                <Badge className="bg-green-100 text-green-800">Online</Badge>
                <span className="text-sm text-gray-600">Dermatologist</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};
export default PatientChatHeader;
