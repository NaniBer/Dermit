import { Stethoscope, Users, UserCheck, Shield } from "lucide-react";
import AdminHeader from "@/components/AdminHeader";
import DashboardButton from "@/components/adminDashboard/DashboardButtons";
import AddNewUsers from "@/components/adminDashboard/AddNewUsers";
import ExistingUser from "@/components/adminDashboard/ExistingUsers";

const AdminDashboard = () => {
  // Mock data for existing doctors
  const doctors = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@dermit.com",
      specialty: "General Dermatology",
      licenseNumber: "MD12345",
      experience: "8 years",
      status: "active",
      consultations: 156,
      joinDate: "2023-01-15",
      licenseExpiry: "2025-12-31",
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      email: "michael.chen@dermit.com",
      specialty: "Pediatric Dermatology",
      licenseNumber: "MD67890",
      experience: "12 years",
      status: "active",
      consultations: 203,
      joinDate: "2023-03-22",
      licenseExpiry: "2024-08-15",
    },
  ];

  // Mock data for existing admins
  const admins = [
    {
      id: 1,
      name: "Admin User",
      email: "admin@dermit.com",
      joinDate: "2023-01-01",
      status: "active",
    },
  ];

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
            value={doctors.length}
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
            description="Active Consultations"
            value={27}
            icon={Stethoscope}
            color="green"
          />

          <DashboardButton
            description="Total Patients"
            value={"1,234"}
            icon={Users}
            color="blue"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Add New Users */}
          <AddNewUsers />

          {/* Right Column - Existing Users */}
          <ExistingUser doctors={doctors} admins={admins} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
