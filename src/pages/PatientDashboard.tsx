import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Plus, 
  MessageCircle, 
  Calendar, 
  FileText, 
  User, 
  Bell,
  Camera,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  LogOut,
  Edit,
  Eye,
  Stethoscope,
  CalendarDays,
  Activity
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EmptyState from "@/components/EmptyState";

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleLogout = () => {
    navigate("/login");
  };

  // Mock data - in real app this would come from API
  const upcomingConsultations = []; // Empty to show empty state

  const recentChats = [
    {
      id: 1,
      conversationId: '1',
      doctor: "Dr. Sarah Johnson",
      specialty: "Dermatology",
      lastMessage: "Based on the image you shared, this appears to be a mild case of eczema. I recommend starting with a gentle moisturizer twice daily...",
      time: "2 hours ago",
      unread: true,
      avatar: "SJ"
    },
    {
      id: 2,
      conversationId: '2',
      doctor: "Dr. Michael Chen",
      specialty: "Pediatric Dermatology",
      lastMessage: "Your skin condition has improved significantly. Continue with the current treatment plan and we'll reassess in two weeks...",
      time: "1 day ago",
      unread: false,
      avatar: "MC"
    }
  ];

  const pastDiagnoses = [
    {
      id: 1,
      condition: "Atopic Dermatitis",
      doctor: "Dr. Sarah Johnson",
      date: "2024-06-10",
      status: "completed",
      prescription: "Moisturizer twice daily, Topical steroid (Hydrocortisone 1%)",
      symptoms: "Red, itchy patches on arms and legs, worsening at night",
      diagnosis: "Based on the clinical presentation and patient history, this appears to be atopic dermatitis (eczema). The condition is characterized by dry, inflamed skin with intense itching.",
      treatment: "Apply moisturizer twice daily to affected areas. Use hydrocortisone 1% cream for flare-ups, but limit use to 7-10 days. Avoid known triggers such as harsh soaps and extreme temperatures.",
      followUp: "Follow-up in 4 weeks to assess treatment response. Contact if symptoms worsen or new areas are affected.",
      severity: "Mild to Moderate"
    },
    {
      id: 2,
      condition: "Seborrheic Keratosis",
      doctor: "Dr. Michael Chen",
      date: "2024-05-28",
      status: "completed",
      prescription: "Observation, Follow-up in 6 months",
      symptoms: "Brown, waxy growth on back, no pain or itching",
      diagnosis: "Benign seborrheic keratosis confirmed through dermoscopic examination. This is a common, non-cancerous skin growth that typically appears with age.",
      treatment: "No treatment required at this time. The lesion is benign and poses no health risk. Monitor for any changes in size, color, or texture.",
      followUp: "Routine follow-up in 6 months. Return sooner if any changes are noticed in the lesion's appearance.",
      severity: "Benign"
    },
    {
      id: 3,
      condition: "Contact Dermatitis",
      doctor: "Dr. Sarah Johnson", 
      date: "2024-04-15",
      status: "completed",
      prescription: "Topical corticosteroid, Avoid allergen exposure",
      symptoms: "Red, swollen skin on hands after using new detergent",
      diagnosis: "Allergic contact dermatitis likely caused by exposure to fragrances or preservatives in household detergent. Patch testing may be considered if reactions persist.",
      treatment: "Apply topical corticosteroid cream twice daily for 7-10 days. Switch to fragrance-free, hypoallergenic detergents. Wear gloves when handling cleaning products.",
      followUp: "Symptoms should resolve within 1-2 weeks. Contact if no improvement or if reactions occur with other products.",
      severity: "Mild"
    }
  ];

  const handleChatClick = (conversationId: string) => {
    navigate(`/patient/chat?conversation=${conversationId}`);
  };

  const handleDiagnosisClick = (diagnosis) => {
    setSelectedDiagnosis(diagnosis);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedDiagnosis(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                  <Stethoscope className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">Dermit</span>
              </Link>
              <nav className="hidden md:flex space-x-6">
                <Link to="/patient/dashboard" className="text-gray-900 font-medium">Dashboard</Link>
                <Link to="/patient/consultations" className="text-gray-600 hover:text-gray-900">Consultations</Link>
                <Link to="/patient/chat" className="text-gray-600 hover:text-gray-900">Messages</Link>
                <Link to="/patient/profile" className="text-gray-600 hover:text-gray-900">Profile</Link>
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
                      <AvatarImage src="/placeholder-patient.jpg" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <span className="hidden md:block text-sm font-medium">John Doe</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => navigate("/patient/profile")}>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, John!</h1>
          <p className="text-gray-600">Manage your skin health consultations and track your progress with our expert dermatologists</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link to="/patient/new-consultation">
            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 border-dashed border-blue-200 hover:border-blue-400 bg-gradient-to-br from-blue-50 to-green-50">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">New Consultation</h3>
                <p className="text-sm text-gray-600">Start a new consultation with a certified dermatologist</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/patient/chat">
            <Card className="shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Active Chats</h3>
                <p className="text-sm text-gray-600">{recentChats.length} ongoing conversations with doctors</p>
                {recentChats.some(chat => chat.unread) && (
                  <Badge className="mt-2 bg-red-100 text-red-800">New Messages</Badge>
                )}
              </CardContent>
            </Card>
          </Link>

          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Health Records</h3>
              <p className="text-sm text-gray-600">{pastDiagnoses.length} completed consultations</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upcoming Consultations */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CalendarDays className="w-5 h-5 text-blue-600" />
                  <span>Upcoming Consultations</span>
                </CardTitle>
                <CardDescription>Your scheduled appointments with dermatologists</CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingConsultations.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingConsultations.map((consultation) => (
                      <div key={consultation.id} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center space-x-4">
                          <Avatar className="w-12 h-12">
                            <AvatarFallback className="bg-blue-100 text-blue-600">Dr</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold text-gray-900">{consultation.doctor}</h4>
                            <p className="text-sm text-gray-600">{consultation.specialty}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                {consultation.date} at {consultation.time}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                          Confirmed
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState type="appointments" />
                )}
              </CardContent>
            </Card>

            {/* Recent Messages */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="w-5 h-5 text-green-600" />
                  <span>Recent Messages</span>
                </CardTitle>
                <CardDescription>Latest communications with your doctors</CardDescription>
              </CardHeader>
              <CardContent>
                {recentChats.length > 0 ? (
                  <div className="space-y-4">
                    {recentChats.map((chat) => (
                      <div 
                        key={chat.id} 
                        onClick={() => handleChatClick(chat.conversationId)}
                        className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-all duration-200 border border-gray-100 hover:border-gray-200 hover:shadow-md"
                      >
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-green-100 text-green-600">{chat.avatar}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <div>
                              <h4 className="font-semibold text-gray-900">{chat.doctor}</h4>
                              <p className="text-xs text-gray-500">{chat.specialty}</p>
                            </div>
                            <div className="text-right">
                              <span className="text-sm text-gray-500">{chat.time}</span>
                              {chat.unread && (
                                <div className="w-2 h-2 bg-red-500 rounded-full ml-auto mt-1"></div>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2">{chat.lastMessage}</p>
                          {chat.unread && (
                            <Badge className="mt-2 bg-blue-100 text-blue-800 text-xs">New Message</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState type="conversations" />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Past Diagnoses */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-purple-600" />
                  <span>Medical History</span>
                </CardTitle>
                <CardDescription>Click on any diagnosis to view details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pastDiagnoses.map((diagnosis) => (
                    <div 
                      key={diagnosis.id} 
                      onClick={() => handleDiagnosisClick(diagnosis)}
                      className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:shadow-md hover:border-gray-300 transition-all duration-200 group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{diagnosis.condition}</h4>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <Eye className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{diagnosis.doctor}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{diagnosis.date}</span>
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${
                            diagnosis.severity === 'Mild' ? 'bg-green-100 text-green-800' :
                            diagnosis.severity === 'Mild to Moderate' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {diagnosis.severity}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Health Tips */}
            <Card className="shadow-lg bg-gradient-to-br from-blue-50 to-green-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800 flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">💡</span>
                  </div>
                  <span>Daily Skin Care Tip</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-blue-700 leading-relaxed">
                  Apply sunscreen with at least SPF 30 daily, even on cloudy days. 
                  UV rays can penetrate clouds and cause skin damage that may lead to premature aging and skin cancer.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Diagnosis Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <span>Diagnosis Details</span>
            </DialogTitle>
            <DialogDescription>
              Complete medical record for this consultation
            </DialogDescription>
          </DialogHeader>
          
          {selectedDiagnosis && (
            <div className="space-y-6">
              {/* Header Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Condition</label>
                    <p className="text-lg font-semibold text-gray-900">{selectedDiagnosis.condition}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Severity</label>
                    <Badge 
                      className={`mt-1 ${
                        selectedDiagnosis.severity === 'Mild' ? 'bg-green-100 text-green-800' :
                        selectedDiagnosis.severity === 'Mild to Moderate' ? 'bg-yellow-100 text-yellow-800' :
                        selectedDiagnosis.severity === 'Benign' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {selectedDiagnosis.severity}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Doctor</label>
                    <p className="text-gray-900">{selectedDiagnosis.doctor}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Date</label>
                    <p className="text-gray-900">{selectedDiagnosis.date}</p>
                  </div>
                </div>
              </div>

              {/* Symptoms */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-orange-600" />
                  <span>Symptoms</span>
                </h4>
                <p className="text-gray-700 bg-orange-50 p-3 rounded-lg border border-orange-200">
                  {selectedDiagnosis.symptoms}
                </p>
              </div>

              {/* Diagnosis */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                  <Stethoscope className="w-4 h-4 text-blue-600" />
                  <span>Diagnosis</span>
                </h4>
                <p className="text-gray-700 bg-blue-50 p-3 rounded-lg border border-blue-200">
                  {selectedDiagnosis.diagnosis}
                </p>
              </div>

              {/* Treatment */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-green-600" />
                  <span>Treatment Plan</span>
                </h4>
                <p className="text-gray-700 bg-green-50 p-3 rounded-lg border border-green-200">
                  {selectedDiagnosis.treatment}
                </p>
              </div>

              {/* Prescription */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-purple-600" />
                  <span>Prescription</span>
                </h4>
                <p className="text-gray-700 bg-purple-50 p-3 rounded-lg border border-purple-200">
                  {selectedDiagnosis.prescription}
                </p>
              </div>

              {/* Follow-up */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <span>Follow-up Instructions</span>
                </h4>
                <p className="text-gray-700 bg-indigo-50 p-3 rounded-lg border border-indigo-200">
                  {selectedDiagnosis.followUp}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button variant="outline" onClick={closeDialog}>
                  Close
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Download Report
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientDashboard;