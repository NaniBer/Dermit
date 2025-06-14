import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  Edit
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
      messageTime: "5 minutes ago"
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
      messageTime: "2 hours ago"
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
      messageTime: "1 day ago"
    }
  ];

  const filteredConsultations = consultations.filter(consultation =>
    consultation.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
    consultation.condition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleConsultationClick = (consultationId: number) => {
    navigate(`/doctor/consultation/${consultationId}`);
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
                <Link to="/doctor/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</Link>
                <Link to="/doctor/consultations" className="text-gray-900 font-medium">Consultations</Link>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Consultations</h1>
          <p className="text-gray-600">Manage your patient consultations and communications</p>
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
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-3xl font-bold text-gray-900">{consultations.length}</p>
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
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="text-3xl font-bold text-green-600">
                    {consultations.filter(c => c.status === 'active').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Waiting</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {consultations.filter(c => c.status === 'waiting').length}
                  </p>
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
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {consultations.filter(c => c.status === 'completed').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Consultations List */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-green-600" />
              <span>All Consultations</span>
            </CardTitle>
            <CardDescription>Click on any consultation to view details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredConsultations.map((consultation) => (
                <div 
                  key={consultation.id} 
                  onClick={() => handleConsultationClick(consultation.id)}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer hover:bg-gray-50"
                >
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
                        className={
                          consultation.urgency === 'high' ? 'bg-red-100 text-red-800' : 
                          consultation.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-green-100 text-green-800'
                        }
                      >
                        {consultation.urgency} priority
                      </Badge>
                      <Badge 
                        className={
                          consultation.status === 'active' ? 'bg-green-100 text-green-800' : 
                          consultation.status === 'waiting' ? 'bg-orange-100 text-orange-800' : 
                          'bg-gray-100 text-gray-800'
                        }
                      >
                        {consultation.status}
                      </Badge>
                      {consultation.status === 'waiting' && (
                        <AlertCircle className="w-4 h-4 text-orange-500" />
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{consultation.lastMessage}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{consultation.messageTime}</span>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{consultation.date} at {consultation.time}</span>
                      <Badge variant="outline">{consultation.condition}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DoctorConsultations;
