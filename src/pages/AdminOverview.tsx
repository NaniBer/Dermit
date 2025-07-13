import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  TrendingUp,
  Users,
  UserCheck,
  Calendar,
  Activity,
  Stethoscope,
  ChevronDown,
  LogOut,
  Edit,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import RecentActivity from "@/components/adminOverview/recentActivity";
import PlatformStats from "@/components/adminOverview/platformStats";
import AdminHeader from "@/components/AdminHeader";

const AdminOverview = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  const stats = {
    totalDoctors: 12,
    activeDoctors: 10,
    totalPatients: 1234,
    activeConsultations: 27,
    monthlyGrowth: 15.2,
    avgResponseTime: "12 min",
  };

  const recentActivity = [
    {
      id: 1,
      type: "New Doctor",
      description: "Dr. Emma Wilson joined the platform",
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "Consultation",
      description: "123 consultations completed today",
      time: "4 hours ago",
    },
    {
      id: 3,
      type: "License Alert",
      description: "Dr. Michael Chen's license expires soon",
      time: "1 day ago",
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
            Platform Overview
          </h1>
          <p className="text-gray-600">
            Analytics and insights for the Dermit platform
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Platform Growth
                  </p>
                  <p className="text-3xl font-bold text-green-600">
                    +{stats.monthlyGrowth}%
                  </p>
                  <p className="text-sm text-gray-500">vs last month</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Active Doctors
                  </p>
                  <p className="text-3xl font-bold text-blue-600">
                    {stats.activeDoctors}/{stats.totalDoctors}
                  </p>
                  <p className="text-sm text-gray-500">currently online</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Avg Response Time
                  </p>
                  <p className="text-3xl font-bold text-purple-600">
                    {stats.avgResponseTime}
                  </p>
                  <p className="text-sm text-gray-500">doctor to patient</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Activity className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <RecentActivity />

          {/* Quick Stats */}

          <PlatformStats stats={stats} />
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
