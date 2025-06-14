
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  AlertCircle
} from "lucide-react";
import { Link } from "react-router-dom";

const PatientDashboard = () => {
  // Mock data - in real app this would come from API
  const upcomingConsultations = [
    {
      id: 1,
      doctor: "Dr. Sarah Johnson",
      date: "2024-06-15",
      time: "10:00 AM",
      status: "upcoming",
      specialty: "Dermatology"
    }
  ];

  const recentChats = [
    {
      id: 1,
      doctor: "Dr. Sarah Johnson",
      lastMessage: "Based on the image you shared, this appears to be a mild case of eczema...",
      time: "2 hours ago",
      unread: true
    },
    {
      id: 2,
      doctor: "Dr. Michael Chen",
      lastMessage: "Your skin condition has improved significantly. Continue with the treatment...",
      time: "1 day ago",
      unread: false
    }
  ];

  const pastDiagnoses = [
    {
      id: 1,
      condition: "Atopic Dermatitis",
      doctor: "Dr. Sarah Johnson",
      date: "2024-06-10",
      status: "completed",
      prescription: "Moisturizer, Topical steroid"
    },
    {
      id: 2,
      condition: "Seborrheic Keratosis",
      doctor: "Dr. Michael Chen",
      date: "2024-05-28",
      status: "completed",
      prescription: "Observation, Follow-up in 6 months"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">D</span>
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
              <Avatar>
                <AvatarImage src="/placeholder-patient.jpg" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, John!</h1>
          <p className="text-gray-600">Manage your skin health consultations and track your progress</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link to="/patient/new-consultation">
            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 border-dashed border-blue-200 hover:border-blue-400">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">New Consultation</h3>
                <p className="text-sm text-gray-600">Start a new consultation with a dermatologist</p>
              </CardContent>
            </Card>
          </Link>

          <Card className="shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Active Chats</h3>
              <p className="text-sm text-gray-600">2 ongoing conversations</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Health Records</h3>
              <p className="text-sm text-gray-600">View your consultation history</p>
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
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <span>Upcoming Consultations</span>
                </CardTitle>
                <CardDescription>Your scheduled appointments</CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingConsultations.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingConsultations.map((consultation) => (
                      <div key={consultation.id} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarFallback>Dr</AvatarFallback>
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
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No upcoming consultations</p>
                    <Link to="/patient/new-consultation">
                      <Button className="mt-4 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                        Schedule Consultation
                      </Button>
                    </Link>
                  </div>
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
                <div className="space-y-4">
                  {recentChats.map((chat) => (
                    <div key={chat.id} className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg cursor-pointer">
                      <Avatar>
                        <AvatarFallback>Dr</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-gray-900">{chat.doctor}</h4>
                          <span className="text-sm text-gray-500">{chat.time}</span>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">{chat.lastMessage}</p>
                        {chat.unread && (
                          <Badge className="mt-2 bg-blue-100 text-blue-800">New</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Past Diagnoses */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span>Past Diagnoses</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pastDiagnoses.map((diagnosis) => (
                    <div key={diagnosis.id} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{diagnosis.condition}</h4>
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <p className="text-sm text-gray-600 mb-1">Dr. {diagnosis.doctor}</p>
                      <p className="text-xs text-gray-500">{diagnosis.date}</p>
                      <div className="mt-2">
                        <Badge variant="secondary" className="text-xs">
                          Prescription: {diagnosis.prescription}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Health Tips */}
            <Card className="shadow-lg bg-gradient-to-r from-blue-50 to-green-50">
              <CardHeader>
                <CardTitle className="text-blue-800">Daily Skin Care Tip</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-blue-700">
                  💡 Apply sunscreen with at least SPF 30 daily, even on cloudy days. 
                  UV rays can penetrate clouds and cause skin damage.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
