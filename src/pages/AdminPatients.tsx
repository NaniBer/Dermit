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
  Filter,
  Mail,
  Phone,
  Calendar,
  Activity,
  Stethoscope,
  ChevronDown,
  LogOut,
  Edit,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import AdminHeader from "@/components/AdminHeader";
import DashboardButton from "@/components/adminDashboard/DashboardButtons";
import PatientList from "@/components/adminPatients/PatientsList";

const AdminPatients = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleLogout = () => {
    navigate("/login");
  };

  // Mock patient data
  const patients = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
      joinDate: "2024-01-15",
      status: "active",
      consultations: 3,
      lastConsultation: "2024-06-10",
      assignedDoctor: "Dr. Sarah Johnson",
    },
    {
      id: 2,
      name: "Sarah Wilson",
      email: "sarah.wilson@example.com",
      phone: "+1 (555) 234-5678",
      joinDate: "2024-02-20",
      status: "active",
      consultations: 1,
      lastConsultation: "2024-06-12",
      assignedDoctor: "Dr. Michael Chen",
    },
    {
      id: 3,
      name: "Michael Brown",
      email: "michael.brown@example.com",
      phone: "+1 (555) 345-6789",
      joinDate: "2024-03-05",
      status: "inactive",
      consultations: 5,
      lastConsultation: "2024-05-28",
      assignedDoctor: "Dr. Sarah Johnson",
    },
    {
      id: 4,
      name: "Emma Davis",
      email: "emma.davis@example.com",
      phone: "+1 (555) 456-7890",
      joinDate: "2024-04-12",
      status: "active",
      consultations: 2,
      lastConsultation: "2024-06-11",
      assignedDoctor: "Dr. Michael Chen",
    },
  ];

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.assignedDoctor.toLowerCase().includes(searchTerm.toLowerCase())
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
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <DashboardButton
            description="Total Patients"
            value={patients.length}
            icon={Users}
            color="blue"
          />

          <DashboardButton
            description="Active Patients"
            value={patients.filter((p) => p.status === "active").length}
            icon={Activity}
            color="green"
          />

          <DashboardButton
            description="Total Consultations"
            value={patients.reduce((sum, p) => sum + p.consultations, 0)}
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
