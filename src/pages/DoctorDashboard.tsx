import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Stethoscope,
  MessageSquare,
  FileText,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  Bell,
  Activity,
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
import DashboardButton from "@/components/doctorDashboard/DashboardButtons";
import PastDiagnosis from "@/components/patientDashboard/PastDiagnosis";
import ChatList from "@/components/ChatList";
import DoctorHeader from "@/components/DoctorHeader";

const DoctorDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  const handleConsultationClick = (consultationId: number) => {
    navigate(`/doctor/consultation/${consultationId}`);
  };

  // Mock data - in real app this would come from API
  const activeConsultations = [
    {
      id: 1,
      patient: "John Doe",
      age: 34,
      lastMessage: "Thank you for the diagnosis. When should I follow up?",
      time: "5 minutes ago",
      condition: "Atopic Dermatitis",
      status: "active",
      urgency: "medium",
    },
    {
      id: 2,
      patient: "Sarah Wilson",
      age: 28,
      lastMessage: "I've attached the new photos as requested",
      time: "2 hours ago",
      condition: "Pending Diagnosis",
      status: "waiting",
      urgency: "high",
    },
  ];

  const recentDiagnoses = [
    {
      id: 1,
      condition: "Atopic Dermatitis",
      doctor: "Dr. Sarah Johnson",
      date: "2024-06-10",
      status: "completed",
      prescription:
        "Moisturizer twice daily, Topical steroid (Hydrocortisone 1%)",
      symptoms: "Red, itchy patches on arms and legs, worsening at night",
      diagnosis:
        "Based on the clinical presentation and patient history, this appears to be atopic dermatitis (eczema). The condition is characterized by dry, inflamed skin with intense itching.",
      treatment:
        "Apply moisturizer twice daily to affected areas. Use hydrocortisone 1% cream for flare-ups, but limit use to 7-10 days. Avoid known triggers such as harsh soaps and extreme temperatures.",
      followUp:
        "Follow-up in 4 weeks to assess treatment response. Contact if symptoms worsen or new areas are affected.",
      severity: "Mild to Moderate",
    },
    {
      id: 2,
      condition: "Seborrheic Keratosis",
      doctor: "Dr. Michael Chen",
      date: "2024-05-28",
      status: "completed",
      prescription: "Observation, Follow-up in 6 months",
      symptoms: "Brown, waxy growth on back, no pain or itching",
      diagnosis:
        "Benign seborrheic keratosis confirmed through dermoscopic examination. This is a common, non-cancerous skin growth that typically appears with age.",
      treatment:
        "No treatment required at this time. The lesion is benign and poses no health risk. Monitor for any changes in size, color, or texture.",
      followUp:
        "Routine follow-up in 6 months. Return sooner if any changes are noticed in the lesion's appearance.",
      severity: "Benign",
    },
    {
      id: 3,
      condition: "Contact Dermatitis",
      doctor: "Dr. Sarah Johnson",
      date: "2024-04-15",
      status: "completed",
      prescription: "Topical corticosteroid, Avoid allergen exposure",
      symptoms: "Red, swollen skin on hands after using new detergent",
      diagnosis:
        "Allergic contact dermatitis likely caused by exposure to fragrances or preservatives in household detergent. Patch testing may be considered if reactions persist.",
      treatment:
        "Apply topical corticosteroid cream twice daily for 7-10 days. Switch to fragrance-free, hypoallergenic detergents. Wear gloves when handling cleaning products.",
      followUp:
        "Symptoms should resolve within 1-2 weeks. Contact if no improvement or if reactions occur with other products.",
      severity: "Mild",
    },
  ];

  const todayStats = {
    totalConsultations: 8,
    pendingReviews: 3,
    completedToday: 5,
    avgResponseTime: "12 min",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <DoctorHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Good morning, Dr. Sarah Johnson!
          </h1>
          <p className="text-gray-600">
            Here's your consultation overview for today
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <DashboardButton
            description="Total Consultations"
            value={todayStats.totalConsultations}
            icon={Users}
            color="blue"
          />
          <DashboardButton
            description="Pending Reviews"
            value={todayStats.pendingReviews}
            icon={Clock}
            color="orange"
          />
          <DashboardButton
            description="Completed Today"
            value={todayStats.completedToday}
            icon={CheckCircle}
            color="green"
          />
          <DashboardButton
            description="Avg Response"
            value={todayStats.avgResponseTime}
            icon={Activity}
            color="purple"
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
              onClick={(id) => handleConsultationClick(Number(id))}
            />
          </div>

          {/* Right Column - Recent Diagnoses */}
          <div>
            <PastDiagnosis pastDiagnosesList={recentDiagnoses} />

            {/* Quick Actions */}
            <Card className="shadow-lg mt-6 bg-gradient-to-r from-green-50 to-blue-50">
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
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
