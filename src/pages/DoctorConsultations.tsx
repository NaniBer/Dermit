import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Stethoscope,
  MessageSquare,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  Bell,
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
import ChatList from "@/components/ChatList";
import DashboardButton from "@/components/doctorDashboard/DashboardButtons";
import DoctorHeader from "@/components/DoctorHeader";

const DoctorConsultations = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleLogout = () => {
    navigate("/login");
  };

  const consultations = [
    {
      id: 1,
      patient: "John Doe",
      age: 34,
      condition: "Atopic Dermatitis",
      status: "active",
      urgency: "medium",
      date: "2024-06-14",
      time: "10:30 AM",
      lastMessage: "Thank you for the diagnosis. When should I follow up?",
      messageTime: "5 minutes ago",
    },
    {
      id: 2,
      patient: "Sarah Wilson",
      age: 28,
      condition: "Pending Diagnosis",
      status: "waiting",
      urgency: "high",
      date: "2024-06-14",
      time: "2:00 PM",
      lastMessage: "I've attached the new photos as requested",
      messageTime: "2 hours ago",
    },
    {
      id: 3,
      patient: "Michael Chen",
      age: 45,
      condition: "Seborrheic Keratosis",
      status: "completed",
      urgency: "low",
      date: "2024-06-13",
      time: "11:00 AM",
      lastMessage: "Follow-up scheduled for next month",
      messageTime: "1 day ago",
    },
  ];

  const filteredConsultations = consultations.filter(
    (consultation) =>
      consultation.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultation.condition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleConsultationClick = (consultationId: number) => {
    navigate(`/doctor/consultation/${consultationId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <DoctorHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Consultations
          </h1>
          <p className="text-gray-600">
            Manage your patient consultations and communications
          </p>
        </div>

        {/* Search and Filter */}
        <Card className="shadow-lg mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search consultations by patient or condition..."
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
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <DashboardButton
            description="Total"
            value={consultations.length}
            icon={Users}
            color="blue"
          />

          <DashboardButton
            description="Active"
            value={consultations.filter((c) => c.status === "active").length}
            icon={MessageSquare}
            color="green"
          />

          <DashboardButton
            description="Waiting"
            value={consultations.filter((c) => c.status === "waiting").length}
            icon={Clock}
            color="orange"
          />

          <DashboardButton
            description="Completed"
            value={consultations.filter((c) => c.status === "completed").length}
            icon={CheckCircle}
            color="purple"
          />
        </div>

        {/* Consultations List */}
        <ChatList
          title="All Consultations"
          description="Click on any consultation to view details"
          icon={MessageSquare}
          items={filteredConsultations.map((chat) => ({
            ...chat,
            id: chat.id.toString(),
          }))}
          type="doctor"
          variant="all-consultations"
          onClick={(id) => handleConsultationClick(Number(id))}
        />
      </div>
    </div>
  );
};

export default DoctorConsultations;
