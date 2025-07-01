
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageCircle, Calendar, User, FileText, Clock, CheckCircle, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Consultations = () => {
  const navigate = useNavigate();

  // Mock data for consultation history
  const consultationHistory = [
    {
      id: 1,
      date: "Dec 15, 2024",
      time: "2:30 PM",
      doctor: "Dr. Sarah Chen",
      diagnosis: "Mild Eczema",
      severity: "Mild",
      status: "Completed",
      canFollowUp: true
    },
    {
      id: 2,
      date: "Nov 28, 2024",
      time: "10:15 AM",
      doctor: "Dr. Michael Rodriguez",
      diagnosis: "Acne Treatment Follow-up",
      severity: "Follow-up Needed",
      status: "Follow-up Scheduled",
      canFollowUp: false
    },
    {
      id: 3,
      date: "Nov 10, 2024",
      time: "4:45 PM",
      doctor: "Dr. Emily Johnson",
      diagnosis: "Skin Irritation Assessment",
      severity: "Moderate",
      status: "Awaiting Doctor",
      canFollowUp: false
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      case "Awaiting Doctor":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            Awaiting Doctor
          </Badge>
        );
      case "Follow-up Scheduled":
        return (
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 border-purple-200">
            <RotateCcw className="w-3 h-3 mr-1" />
            Follow-up Scheduled
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "Mild":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">{severity}</Badge>;
      case "Moderate":
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">{severity}</Badge>;
      case "Follow-up Needed":
        return <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200">{severity}</Badge>;
      default:
        return <Badge variant="outline">{severity}</Badge>;
    }
  };

  const handleStartConsultation = () => {
    navigate('/patient/new-consultation');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Welcome to <span className="text-blue-600">DerMit</span>
          </h1>
          <p className="text-gray-600 text-lg">Your skin health, our priority</p>
        </div>

        {/* Section 1: Start a New Consultation */}
        <Card className="border-2 border-dashed border-blue-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg bg-gradient-to-r from-blue-50 to-white">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl text-gray-900 flex items-center justify-center gap-2">
              ✨ Start a New Consultation
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Choose how you'd like to connect with a dermatologist today.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleStartConsultation}
              className="w-full h-16 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
            >
              <MessageCircle className="w-6 h-6 mr-3" />
              💬 Start Chat Consultation
            </Button>
            
            {/* Future options (disabled) */}
            <div className="grid md:grid-cols-2 gap-4">
              <Button 
                disabled 
                variant="outline" 
                className="h-12 text-gray-400 border-gray-200 cursor-not-allowed"
              >
                📹 Video Call (Coming Soon)
              </Button>
              <Button 
                disabled 
                variant="outline" 
                className="h-12 text-gray-400 border-gray-200 cursor-not-allowed"
              >
                🔍 Symptom Checker (Coming Soon)
              </Button>
            </div>
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
              {consultationHistory.map((consultation) => (
                <Card 
                  key={consultation.id} 
                  className="border border-gray-200 hover:shadow-md transition-all duration-300 bg-gradient-to-r from-white to-gray-50"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Left side - Main info */}
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {consultation.date}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {consultation.time}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-blue-600" />
                          <span className="font-medium text-gray-900">{consultation.doctor}</span>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="font-semibold text-gray-900">{consultation.diagnosis}</p>
                          <div className="flex items-center gap-2">
                            {getSeverityBadge(consultation.severity)}
                            {getStatusBadge(consultation.status)}
                          </div>
                        </div>
                      </div>

                      {/* Right side - Actions */}
                      <div className="flex flex-col gap-2">
                        <Button variant="outline" size="sm" className="hover:bg-blue-50">
                          View Chat Summary
                        </Button>
                        {consultation.canFollowUp && (
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                            <RotateCcw className="w-4 h-4 mr-1" />
                            Request Follow-up
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {consultationHistory.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">No consultations yet</p>
                <p className="text-sm">Start your first consultation above!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Section 3: Quick Status Legend */}
        <Card className="bg-gradient-to-r from-gray-50 to-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900">Status Guide</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Completed
                </Badge>
                <span className="text-sm text-gray-600">Consultation finished</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                  <Clock className="w-3 h-3 mr-1" />
                  Awaiting Doctor
                </Badge>
                <span className="text-sm text-gray-600">Doctor will respond soon</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Follow-up Scheduled
                </Badge>
                <span className="text-sm text-gray-600">Next appointment booked</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Consultations;
