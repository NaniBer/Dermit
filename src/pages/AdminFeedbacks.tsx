import { Card, CardContent } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Users,
  Search,
  Filter,
  Stethoscope,
  MessagesSquare,
} from "lucide-react";

import { useEffect, useState } from "react";
import AdminHeader from "@/components/AdminHeader";
import DashboardButton from "@/components/adminDashboard/DashboardButtons";
import PatientList from "@/components/adminPatients/PatientsList";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import FeedbackList from "@/components/adminFeedbacks/FeedbackList";

type FeedbackWithProfile =
  Database["public"]["Views"]["feedback_with_profiles"]["Row"];

const AdminFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState<FeedbackWithProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [consultationsNo, setConsultationsNo] = useState(0);
  const [patientsNo, setPatientsNo] = useState(0);
  const [patients, setPatients] = useState([]);
  const addPatient = (newpatient) => {
    setPatients((prevItems) => [...prevItems, newpatient]);
  };
  useEffect(() => {
    const fetchFeedbacks = async () => {
      const { data, count, error } = await supabase
        .from("feedback_with_profiles")
        .select("*", { count: "exact" });
      if (error) {
        console.error("Error fetching consultations:", error);
      } else {
        console.log(data, count, error);
        setFeedbacks((data as unknown as FeedbackWithProfile[]) || []);
      }
    };

    fetchFeedbacks();
  }, []);

  const filteredFeedbacks = feedbacks.filter(
    (feedback) =>
      feedback.patient_first_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      feedback.patient_email
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      feedback.doctor_first_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      feedback.feedback_message
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      feedback.patient_phone
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      feedback.doctor_phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.doctor_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.created_at?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.rating?.toString().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      {/* Header */}
      <AdminHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Patient Management
          </h1>
          <p className="text-gray-600">
            View and manage all registered patients
          </p>
        </div>

        {/* Search and Filter */}
        <Card className="shadow-lg mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search patients by name, email, or doctor..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" className="flex items-center space-x-2">
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid md:grid-cols-1 gap-6 mb-8">
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 text-center sm:text-left">
                <div className="flex  items-center">
                  <p className="text-sm font-medium text-gray-600">
                    Total feedbacks
                  </p>
                  <p className={"text-3xl font-bold text-blue-600"}>
                    {feedbacks.length}
                  </p>
                </div>
                <div
                  className={
                    "w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center"
                  }
                >
                  <MessagesSquare className={"w-6 h-6 text-blue-600"} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Patients List */}

        <FeedbackList
          feedbacks={feedbacks}
          searchTerm={searchTerm}
          onClearSearch={() => setSearchTerm("")}
        />
      </div>
    </div>
  );
};

export default AdminFeedbacks;
