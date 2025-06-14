import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  Edit
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DoctorDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
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
      urgency: "medium"
    },
    {
      id: 2,
      patient: "Sarah Wilson",
      age: 28,
      lastMessage: "I've attached the new photos as requested",
      time: "2 hours ago",
      condition: "Pending Diagnosis",
      status: "waiting",
      urgency: "high"
    }
  ];

  const recentDiagnoses = [
    {
      id: 1,
      patient: "Michael Chen",
      age: 45,
      condition: "Seborrheic Keratosis",
      date: "2024-06-13",
      prescription: "Observation, Follow-up in 6 months",
      status: "completed"
    },
    {
      id: 2,
      patient: "Emma Johnson",
      age: 31,
      condition: "Contact Dermatitis",
      date: "2024-06-12",
      prescription: "Topical steroid, Avoid allergens",
      status: "completed"
    },
    {
      id: 3,
      patient: "Robert Davis",
      age: 52,
      condition: "Psoriasis",
      date: "2024-06-10",
      prescription: "Topical treatment, Lifestyle modifications",
      status: "completed"
    }
  ];

  const todayStats = {
    totalConsultations: 8,
    pendingReviews: 3,
    completedToday: 5,
    avgResponseTime: "12 min"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <Stethoscope className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">Dermit</span>
                <Badge variant="secondary" className="ml-2">Doctor</Badge>
              </Link>
              <nav className="hidden md:flex space-x-6">
                <Link to="/doctor/dashboard" className="text-gray-900 font-medium">Dashboard</Link>
                <Link to="/doctor/consultations" className="text-gray-600 hover:text-gray-900">Consultations</Link>
                <Link to="/doctor/patients" className="text-gray-600 hover:text-gray-900">Patients</Link>
                <Link to="/doctor/profile" className="text-gray-600 hover:text-gray-900">Profile</Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="/placeholder-doctor.jpg" />
                      <AvatarFallback>Dr</AvatarFallback>
                    </Avatar>
                    <span className="hidden md:block text-sm font-medium">Dr. Sarah Johnson</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => navigate("/doctor/profile")}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Good morning, Dr. Sarah Johnson!</h1>
          <p className="text-gray-600">Here's your consultation overview for today</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Consultations</p>
                  <p className="text-3xl font-bold text-gray-900">{todayStats.totalConsultations}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
                  <p className="text-3xl font-bold text-orange-600">{todayStats.pendingReviews}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed Today</p>
                  <p className="text-3xl font-bold text-green-600">{todayStats.completedToday}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Response</p>
                  <p className="text-3xl font-bold text-purple-600">{todayStats.avgResponseTime}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Activity className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Active Consultations */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5 text-green-600" />
                  <span>Active Consultations</span>
                </CardTitle>
                <CardDescription>Patients waiting for your response</CardDescription>
              </CardHeader>
              <CardContent>
                {activeConsultations.length > 0 ? (
                  <div className="space-y-4">
                    {activeConsultations.map((consultation) => (
                      <div key={consultation.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarFallback>{consultation.patient.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-semibold text-gray-900">{consultation.patient}</h4>
                              <p className="text-sm text-gray-600">Age: {consultation.age}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge 
                              variant={consultation.urgency === 'high' ? 'destructive' : consultation.urgency === 'medium' ? 'default' : 'secondary'}
                            >
                              {consultation.urgency} priority
                            </Badge>
                            {consultation.status === 'waiting' && (
                              <AlertCircle className="w-4 h-4 text-orange-500" />
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{consultation.lastMessage}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">{consultation.time}</span>
                          <Badge variant="outline">{consultation.condition}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No active consultations</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Recent Diagnoses */}
          <div>
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span>Recent Diagnoses</span>
                </CardTitle>
                <CardDescription>Your latest completed cases</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentDiagnoses.map((diagnosis) => (
                    <div key={diagnosis.id} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{diagnosis.patient}</h4>
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <p className="text-sm font-medium text-blue-600 mb-1">{diagnosis.condition}</p>
                      <p className="text-xs text-gray-600 mb-2">{diagnosis.prescription}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{diagnosis.date}</span>
                        <Badge variant="secondary" className="text-xs">Completed</Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <Link to="/doctor/patients">
                  <Button variant="outline" className="w-full mt-4">
                    View All Patients
                  </Button>
                </Link>
              </CardContent>
            </Card>

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
