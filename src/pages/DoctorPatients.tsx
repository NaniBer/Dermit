import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Users,
  Search,
  Calendar,
  FileText,
  MessageCircle,
  Stethoscope,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import DoctorHeader from "@/components/DoctorHeader";
import DashboardButton from "@/components/doctorDashboard/DashboardButtons";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const DoctorPatients = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalConsultations, setTotalConsultations] = useState(0);
  const [ongoingConsultations, setOngoingConsultations] = useState(0);
  const [completedConsultations, setCompletedConsultations] = useState(0);

  // Fetch patients for the doctor
  useEffect(() => {
    if (!user) return;

    const fetchPatients = async () => {
      try {
        const { data: consultationData, error: consultationError } =
          await supabase
            .from("consultations_with_patient_profiles")
            .select("*")
            .eq("doctor_id", user.id)
            .order("created_at", { ascending: false });

        if (consultationError) throw consultationError;

        const patientMap = new Map();

        consultationData?.forEach((consultation: any) => {
          const patientId = consultation.patient_id;

          const patient = {
            first_name: consultation.patient_first_name,
            last_name: consultation.patient_last_name,
            email: consultation.patient_email,
          };

          if (!patientMap.has(patientId)) {
            patientMap.set(patientId, {
              id: patientId,
              name: `${patient.first_name ?? "Unknown"} ${
                patient.last_name ?? ""
              }`.trim(),
              email: patient.email ?? "",
              lastConsultation: consultation.created_at,
              consultations: [],
              status: consultation.status,
              priority: consultation.priority,
            });
          }

          // Push current consultation into patient's consultations array
          patientMap.get(patientId)?.consultations.push(consultation);
        });

        const patientsArray = Array.from(patientMap.values()).map((patient) => {
          const totalConsultations = patient.consultations.length;
          setTotalConsultations(totalConsultations);
          const completedConsultations = patient.consultations.filter(
            (c) => c.status === "completed"
          ).length;
          setCompletedConsultations(completedConsultations);

          const ongoingConsultations = patient.consultations.filter(
            (c) => c.status === "in_progress"
          ).length;
          setOngoingConsultations(ongoingConsultations);

          let status = "completed";
          if (ongoingConsultations > 0) status = "ongoing";
          else if (patient.consultations.some((c) => c.status === "pending"))
            status = "pending";

          return {
            ...patient,
            totalConsultations,
            completedConsultations,
            ongoingConsultations,
            status,
            age: 0,
            condition:
              patient.consultations[0]?.title || "No condition specified",
            notes: `Patient has ${totalConsultations} consultation(s) with ${completedConsultations} completed.`,
            prescription:
              "Prescription details would be stored in a separate table.",
          };
        });

        setPatients(patientsArray);
      } catch (error) {
        console.error("Error fetching patients:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [user]);

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.condition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
        <DoctorHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading patients...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <DoctorHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Patients</h1>
          <p className="text-gray-600">
            View and manage your patient consultations
          </p>
        </div>

        {/* Search */}
        <Card className="shadow-lg mb-8">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search patients by name, email, or condition..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <DashboardButton
            description="Total Patients"
            value={patients.length}
            icon={Users}
            color="blue"
          />

          <DashboardButton
            description="Ongoing Cases"
            value={ongoingConsultations}
            icon={Stethoscope}
            color="green"
          />

          <DashboardButton
            description="Completed"
            value={completedConsultations}
            icon={FileText}
            color="purple"
          />
        </div>

        {/* Patients List */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-green-600" />
              <span>Patient History</span>
            </CardTitle>
            <CardDescription>
              Complete list of your treated patients
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {filteredPatients.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg">No patients found</p>
                  <p className="text-sm">
                    {searchTerm
                      ? "Try adjusting your search terms"
                      : "Patients will appear here once you have consultations"}
                  </p>
                </div>
              ) : (
                filteredPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-green-100 text-green-600">
                            {patient.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {patient.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {patient.email}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>
                                Last seen:{" "}
                                {new Date(
                                  patient.lastConsultation
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            <span>
                              Total consultations: {patient.totalConsultations}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          className={
                            patient.status === "ongoing"
                              ? "bg-green-100 text-green-800"
                              : patient.status === "completed"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-orange-100 text-orange-800"
                          }
                        >
                          {patient.status}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            // Navigate to the most recent consultation
                            const latestConsultation = patient.consultations[0];
                            if (latestConsultation) {
                              navigate(
                                `/doctor/consultation/${latestConsultation.id}`
                              );
                            }
                          }}
                        >
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">
                          Latest Condition
                        </h5>
                        <p className="text-sm text-gray-700">
                          {patient.condition}
                        </p>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">
                          Consultation Status
                        </h5>
                        <p className="text-sm text-gray-700">
                          {patient.ongoingConsultations} ongoing,{" "}
                          {patient.completedConsultations} completed
                        </p>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">
                        Clinical Notes
                      </h5>
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
                        {patient.notes}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DoctorPatients;
