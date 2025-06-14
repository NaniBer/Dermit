
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users,
  Search,
  Calendar,
  FileText,
  MessageCircle,
  Stethoscope,
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

const DoctorPatients = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  // Mock patient data for the doctor
  const patients = [
    {
      id: 1,
      name: "John Doe",
      age: 34,
      lastConsultation: "2024-06-13",
      condition: "Atopic Dermatitis",
      status: "ongoing",
      consultations: 3,
      notes: "Patient responding well to topical steroids. Follow-up in 2 weeks.",
      prescription: "Hydrocortisone cream 1%, apply twice daily"
    },
    {
      id: 2,
      name: "Sarah Wilson",
      age: 28,
      lastConsultation: "2024-06-12",
      condition: "Contact Dermatitis",
      status: "completed",
      consultations: 2,
      notes: "Allergic reaction to nickel jewelry. Symptoms resolved after avoiding trigger.",
      prescription: "Topical antihistamine, avoid nickel exposure"
    },
    {
      id: 3,
      name: "Michael Brown",
      age: 45,
      lastConsultation: "2024-06-10",
      condition: "Seborrheic Keratosis",
      status: "monitoring",
      consultations: 1,
      notes: "Benign lesion confirmed. Monitoring for any changes in appearance.",
      prescription: "No treatment required, follow-up in 6 months"
    },
    {
      id: 4,
      name: "Emma Davis",
      age: 31,
      lastConsultation: "2024-06-08",
      condition: "Psoriasis",
      status: "ongoing",
      consultations: 4,
      notes: "Moderate plaque psoriasis. Patient started on topical treatment.",
      prescription: "Betamethasone ointment, apply once daily"
    }
  ];

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
                <Link to="/doctor/consultations" className="text-gray-600 hover:text-gray-900">Consultations</Link>
                <Link to="/doctor/patients" className="text-gray-900 font-medium">Patients</Link>
                <Link to="/doctor/profile" className="text-gray-600 hover:text-gray-900">Profile</Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Patients</h1>
          <p className="text-gray-600">View and manage your patient consultations</p>
        </div>

        {/* Search */}
        <Card className="shadow-lg mb-8">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search patients by name or condition..."
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Patients</p>
                  <p className="text-3xl font-bold text-gray-900">{patients.length}</p>
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
                  <p className="text-sm font-medium text-gray-600">Ongoing Cases</p>
                  <p className="text-3xl font-bold text-green-600">
                    {patients.filter(p => p.status === 'ongoing').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Stethoscope className="w-6 h-6 text-green-600" />
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
                    {patients.filter(p => p.status === 'completed').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Monitoring</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {patients.filter(p => p.status === 'monitoring').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Patients List */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-green-600" />
              <span>Patient History</span>
            </CardTitle>
            <CardDescription>Complete list of your treated patients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {patients.map((patient) => (
                <div key={patient.id} className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-green-100 text-green-600">
                          {patient.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold text-gray-900">{patient.name}</h4>
                        <p className="text-sm text-gray-600">Age: {patient.age}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>Last seen: {patient.lastConsultation}</span>
                          </div>
                          <span>Total consultations: {patient.consultations}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        className={
                          patient.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                          patient.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-orange-100 text-orange-800'
                        }
                      >
                        {patient.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Condition</h5>
                      <p className="text-sm text-gray-700">{patient.condition}</p>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Prescription</h5>
                      <p className="text-sm text-gray-700">{patient.prescription}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Clinical Notes</h5>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">{patient.notes}</p>
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

export default DoctorPatients;
