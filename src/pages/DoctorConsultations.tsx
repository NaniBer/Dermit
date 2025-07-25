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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  MessageSquare,
  Users,
  Clock,
  CheckCircle,
  Search,
  Filter,
  Bell,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import DashboardButton from "@/components/doctorDashboard/DashboardButtons";
import DoctorHeader from "@/components/DoctorHeader";
import { useConsultations } from "@/hooks/useConsultations";
import { useNotifications } from "@/hooks/useNotifications";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const DoctorConsultations = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [consultations, setConsultations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { notifications, unreadCount } = useNotifications();

  // Fetch consultations for the doctor
  useEffect(() => {
    if (!user) return;

    const fetchConsultations = async () => {
      try {
        const { data, error } = await supabase
          .from("consultations")
          .select(
            `
            *
            
            )
          `
          )
          .eq("doctor_id", user.id)
          .order("created_at", { ascending: false });

        const { data: fetch, error: fetchError } = await supabase
          .from("consultations")
          .select(
            `
  *,
  patient:patient_id (
    first_name
  ),
  doctor:doctor_id (
    first_name
  )
`
          )
          .eq("doctor_id", user.id)
          .order("created_at", { ascending: false });
        console.log(fetch);

        if (error) throw error;
        setConsultations(data || []);
      } catch (error) {
        console.error("Error fetching consultations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConsultations();
  }, [user]);

  const filteredConsultations = consultations.filter(
    (consultation) =>
      consultation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (consultation.description || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      `${consultation.profiles?.first_name || ""} ${
        consultation.profiles?.last_name || ""
      }`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const handleConsultationClick = (consultationId: string) => {
    navigate(`/doctor/consultation/${consultationId}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in_progress":
        return (
          <Badge className="bg-green-100 text-green-800">In Progress</Badge>
        );
      case "pending":
        return <Badge className="bg-orange-100 text-orange-800">Pending</Badge>;
      case "completed":
        return <Badge className="bg-gray-100 text-gray-800">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <Badge className="bg-red-100 text-red-800">{priority}</Badge>;
      case "high":
        return (
          <Badge className="bg-orange-100 text-orange-800">{priority}</Badge>
        );
      case "normal":
        return <Badge className="bg-blue-100 text-blue-800">{priority}</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
        <DoctorHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading consultations...</p>
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

        {/* Notifications Badge */}
        {/* {unreadCount > 0 && (
          <div className="mb-6">
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Bell className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-900">
                      {unreadCount} new notification{unreadCount > 1 ? "s" : ""}
                    </p>
                    <p className="text-sm text-blue-700">
                      New consultation requests available
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )} */}

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <DashboardButton
            description="Total"
            value={consultations.length}
            icon={Users}
            color="blue"
          />

          <DashboardButton
            description="Active"
            value={
              consultations.filter((c) => c.status === "in_progress").length
            }
            icon={MessageSquare}
            color="green"
          />

          <DashboardButton
            description="Completed"
            value={consultations.filter((c) => c.status === "completed").length}
            icon={CheckCircle}
            color="purple"
          />
        </div>

        {/* Consultations List */}
        <div className="space-y-4">
          {filteredConsultations.length === 0 ? (
            <Card className="shadow-lg">
              <CardContent className="p-8 text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No consultations yet
                </h3>
                <p className="text-gray-600">
                  New consultation requests will appear here
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredConsultations.map((consultation) => (
              <Card
                key={consultation.id}
                className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => handleConsultationClick(consultation.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {consultation.profiles?.first_name?.[0] || "P"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {consultation.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Patient:{" "}
                            {consultation.profiles?.first_name || "Unknown"}{" "}
                            {consultation.profiles?.last_name || ""}
                          </p>
                          <p className="text-sm text-gray-600">
                            Created{" "}
                            {new Date(
                              consultation.created_at!
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {getStatusBadge(consultation.status || "pending")}
                      {getPriorityBadge(consultation.priority || "normal")}
                    </div>
                  </div>
                  {consultation.description && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600">
                        {consultation.description}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorConsultations;
