import { Card, CardContent } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Users, Search, Filter, Stethoscope } from "lucide-react";

import { useEffect, useState } from "react";
import AdminHeader from "@/components/AdminHeader";
import DashboardButton from "@/components/adminDashboard/DashboardButtons";
import PatientList from "@/components/adminPatients/PatientsList";
import { supabase } from "@/integrations/supabase/client";

const AdminPatients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [consultationsNo, setConsultationsNo] = useState(0);
  const [patientsNo, setPatientsNo] = useState(0);
  const [patients, setPatients] = useState([]);
  const addPatient = (newpatient) => {
    setPatients((prevItems) => [...prevItems, newpatient]);
  };
  useEffect(() => {
    const fetchConsultationsNo = async () => {
      const { data, count, error } = await supabase
        .from("consultations")
        .select("*", { count: "exact" });
      if (error) {
        console.error("Error fetching consultations:", error);
      } else {
        setConsultationsNo(count);
      }
    };
    const fetchPatientsNo = async () => {
      const { data, error } = await supabase
        .from("patient_profiles")
        .select("*");
      console.log(data, error);
      if (error) {
        console.error("Error fetching doctors:", error);
      } else {
        data.forEach((doc) => addPatient(doc));
        // setDoctors(data || []);
      }
    };

    fetchConsultationsNo();
    fetchPatientsNo();
  }, []);

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.assignedDoctor?.toLowerCase().includes(searchTerm.toLowerCase())
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
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <DashboardButton
            description="Total Patients"
            value={patients.length}
            icon={Users}
            color="blue"
          />

          {/* <DashboardButton
            description="Active Patients"
            value={patients.filter((p) => p.status === "active").length}
            icon={Activity}
            color="green"
          /> */}

          <DashboardButton
            description="Total Consultations"
            value={consultationsNo}
            icon={Stethoscope}
            color="purple"
          />
        </div>

        {/* Patients List */}

        <PatientList
          patients={filteredPatients}
          searchTerm={searchTerm}
          onClearSearch={() => setSearchTerm("")}
        />
      </div>
    </div>
  );
};

export default AdminPatients;
