import React, { useState, useEffect } from "react";
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
  MessageCircle,
  Calendar,
  User,
  FileText,
  Clock,
  CheckCircle,
  RotateCcw,
  Plus,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import PatientHeader from "@/components/PatientHeader";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const PatientConsultations = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [consultations, setConsultations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch real consultation data
  useEffect(() => {
    if (!user) return;

    const fetchConsultations = async () => {
      try {
        const { data, error } = await supabase
          .from("consultations")
          .select(
            `
            *,
            profiles!consultations_doctor_id_fkey (
              first_name,
              last_name
            )
          `
          )
          .eq("patient_id", user.id)
          .order("created_at", { ascending: false });

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            Awaiting Doctor
          </Badge>
        );
      case "in_progress":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200">
            <MessageCircle className="w-3 h-3 mr-1" />
            In Progress
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            {priority}
          </Badge>
        );
      case "high":
        return (
          <Badge className="bg-orange-100 text-orange-800 border-orange-200">
            {priority}
          </Badge>
        );
      case "normal":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            {priority}
          </Badge>
        );
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const handleConsultationClick = (consultationId: string) => {
    navigate(`/patient/chat?conversation=${consultationId}`);
  };

  const handleStartConsultation = () => {
    navigate("/patient/new-consultation");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <PatientHeader />
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <PatientHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Section 1: Start a New Consultation */}
        <Card className="border-2 border-dashed border-blue-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg bg-gradient-to-r from-blue-50 to-white mb-8">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl text-gray-900 flex items-center justify-center gap-2">
              Start a New Consultation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 flex flex-col items-center mt-3">
            <Link to="/patient/new-consultation">
              <Button className="bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-secondary hover:to-brand-primary">
                <Plus className="w-4 h-4 mr-2" />
                Schedule Consultation
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Section 2: Your Consultation History */}
        <Card className="shadow-lg border-0 bg-white">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-2xl text-gray-900 flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-600" />
              Your Consultation History
            </CardTitle>
            <CardDescription className="text-gray-600">
              A timeline of your skin health journey 🧴
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {consultations.map((consultation) => (
                <Card
                  key={consultation.id}
                  className="border border-gray-200 hover:shadow-md transition-all duration-300 bg-gradient-to-r from-white to-gray-50 cursor-pointer"
                  onClick={() => handleConsultationClick(consultation.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Left side - Main info */}
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(
                              consultation.created_at
                            ).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {new Date(
                              consultation.created_at
                            ).toLocaleTimeString()}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-blue-600" />
                          <span className="font-medium text-gray-900">
                            {consultation.profiles?.first_name &&
                            consultation.profiles?.last_name
                              ? `Dr. ${consultation.profiles.first_name} ${consultation.profiles.last_name}`
                              : "Doctor Assigned"}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <p className="font-semibold text-gray-900">
                            {consultation.title}
                          </p>
                          <p className="text-sm text-gray-600">
                            {consultation.description}
                          </p>
                          <div className="flex items-center gap-2">
                            {getPriorityBadge(
                              consultation.priority || "normal"
                            )}
                            {getStatusBadge(consultation.status || "pending")}
                          </div>
                        </div>
                      </div>

                      {/* Right side - Actions */}
                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleConsultationClick(consultation.id);
                          }}
                        >
                          <MessageCircle className="w-4 h-4 mr-1" />
                          {consultation.status === "completed"
                            ? "View Chat"
                            : "Continue Chat"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {consultations.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">No consultations yet</p>
                <p className="text-sm">Start your first consultation above!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Section 3: Quick Status Legend */}
        <Card className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 mt-8">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900">
              Status Guide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Completed
                </Badge>
                <span className="text-sm text-gray-600">
                  Consultation finished
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                  <Clock className="w-3 h-3 mr-1" />
                  Awaiting Doctor
                </Badge>
                <span className="text-sm text-gray-600">
                  Doctor will respond soon
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                  <MessageCircle className="w-3 h-3 mr-1" />
                  In Progress
                </Badge>
                <span className="text-sm text-gray-600">
                  Active consultation
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PatientConsultations;
