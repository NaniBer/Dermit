import { Stethoscope, Users, UserCheck, Shield } from "lucide-react";
import AdminHeader from "@/components/AdminHeader";
import DashboardButton from "@/components/adminDashboard/DashboardButtons";
import AddNewUsers from "@/components/adminDashboard/AddNewUsers";
import ExistingUser from "@/components/adminDashboard/ExistingUsers";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

interface Doctor {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
}

const AdminDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [items, setItems] = useState([]);
  const [admins, setAdmins] = useState([]);
  const addItem = (newItem) => {
    setItems((prevItems) => [...prevItems, newItem]);
    // setDoctors(prevItems => [...prevItems, newItem]);
  };

  const [consultationsNo, setConsultationsNo] = useState(0);
  const [patientsNo, setPatientsNo] = useState(0);
  // Just for demonstration: adding stuff automatically when component mounts

  useEffect(() => {
    const fetchDoctors = async () => {
      const { data, error } = await supabase
        .from("doctor_profiles")
        .select("*");
      if (error) {
        console.error("Error fetching doctors:", error);
      } else {
        data.forEach((doc) => addItem(doc));
        // setDoctors(data || []);
      }
    };
    const fetchAdmins = async () => {
      const { data, error } = await supabase.from("admin_profiles").select("*");
      if (error) {
        console.error("Error fetching doctors:", error);
      } else {
        setAdmins(data);
        // setDoctors(data || []);
      }
    };
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
      const { data, count, error } = await supabase
        .from("patient_profiles")
        .select("*", { count: "exact" });
      if (error) {
        console.error("Error fetching patients:", error);
      } else {
        setPatientsNo(count);
      }
    };

    fetchDoctors();
    fetchAdmins();
    fetchConsultationsNo();
    fetchPatientsNo();
  }, []);

  // Mock data for existing admins

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      {/* Header */}

      <AdminHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage doctors, admins, and oversee the Dermit platform
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <DashboardButton
            description="Total Doctors"
            value={items.length}
            icon={UserCheck}
            color="purple"
          />

          <DashboardButton
            description="Total Admins"
            value={admins.length}
            icon={Shield}
            color="purple"
          />

          <DashboardButton
            description="Consultations"
            value={consultationsNo}
            icon={Stethoscope}
            color="green"
          />

          <DashboardButton
            description="Total Patients"
            value={patientsNo}
            icon={Users}
            color="blue"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Add New Users */}
          <AddNewUsers />

          {/* Right Column - Existing Users */}
          <ExistingUser doctors={items} admins={admins} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
