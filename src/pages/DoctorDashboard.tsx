import { useState, useEffect } from "react";

import { MessageSquare, Users, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardButton from "@/components/doctorDashboard/DashboardButtons";
import ChatList from "@/components/ChatList";
import DoctorHeader from "@/components/DoctorHeader";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalConsultations: 0,
    pendingReviews: 0,
    completedToday: 0,
  });

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

        if (error) throw error;
        setConsultations(data || []);

        // Calculate stats
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const totalConsultations = data?.length || 0;
        const pendingReviews =
          data?.filter((c) => c.status === "pending").length || 0;
        const completedToday =
          data?.filter((c) => {
            const consultationDate = new Date(c.created_at);
            return c.status === "completed" && consultationDate >= today;
          }).length || 0;

        setStats({
          totalConsultations,
          pendingReviews,
          completedToday,
        });
      } catch (error) {
        console.error("Error fetching consultations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConsultations();
  }, [user]);

  const handleConsultationClick = (consultationId: string) => {
    navigate(`/doctor/consultation/${consultationId}`);
  };

  // Transform consultations for ChatList component
  const activeConsultations = consultations
    .filter(
      (consultation) =>
        consultation.status === "in_progress" ||
        consultation.status === "pending"
    )
    .map((consultation) => ({
      id: consultation.id,
      patient: `${consultation.profiles?.first_name || "Patient"} ${
        consultation.profiles?.last_name || ""
      }`,
      age: 0, // We don't have age in the current schema
      lastMessage: consultation.description || "No description available",
      time: new Date(consultation.created_at).toLocaleDateString(),
      condition: consultation.title,
      status: consultation.status,
      urgency: consultation.priority || "normal",
    }));

  const getFullName = (user: any) => {
    const meta = user?.user_metadata;

    // Try `fullname` first

    if (meta?.name) return meta.name;

    // Then fall back to first + last name combo
    if (meta?.first_name || meta?.last_name)
      return `${meta.first_name ?? ""} ${meta.last_name ?? ""}`.trim();

    // Just in case everything is missing (ghost user 👻)
    return "Unknown User";
  };

  const fullname = getFullName(user);
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
        <DoctorHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
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
            Hello, Dr. {fullname}!
          </h1>
          <p className="text-gray-600">
            Here's your consultation overview for today
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <DashboardButton
            description="Total Consultations"
            value={stats.totalConsultations}
            icon={Users}
            color="blue"
          />
          {/* <DashboardButton
            description="Pending Reviews"
            value={stats.pendingReviews}
            icon={Clock}
            color="orange"
          /> */}
          <DashboardButton
            description="Completed Today"
            value={stats.completedToday}
            icon={CheckCircle}
            color="green"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Active Consultations */}
          <div className="lg:col-span-2">
            <ChatList
              title="Active Consultations"
              description="Patients waiting for your response"
              icon={MessageSquare}
              items={activeConsultations.map((chat) => ({
                ...chat,
                id: chat.id.toString(),
              }))}
              type="doctor"
              onClick={(id) => handleConsultationClick(id)}
            />
          </div>

          {/* Right Column - Recent Diagnoses */}
          <div>
            {/* <PastDiagnosis pastDiagnosesList={recentDiagnoses} /> */}

            {/* Quick Actions */}
            {/* <Card className="shadow-lg mt-6 bg-gradient-to-r from-green-50 to-blue-50">
              <CardHeader>
                <CardTitle className="text-green-800">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                  <Calendar className="w-4 h-4 mr-2" />
                  View Schedule
                </Button>
                <Button variant="outline" className="w-full">
                  <FileText className="w-4 h-4 mr-2" />
                  Diagnosis Templates
                </Button>
                <Link to="/doctor/patients">
                  <Button variant="outline" className="w-full">
                    <Users className="w-4 h-4 mr-2" />
                    Patient Directory
                  </Button>
                </Link>
              </CardContent>
            </Card> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
