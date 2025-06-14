
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Stethoscope, User, UserCheck, Shield } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [patientEmail, setPatientEmail] = useState("");
  const [patientPassword, setPatientPassword] = useState("");
  const [doctorEmail, setDoctorEmail] = useState("");
  const [doctorPassword, setDoctorPassword] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  // Sample users for testing
  const sampleUsers = {
    patient: { email: "john.doe@example.com", password: "patient123" },
    doctor: { email: "sarah.johnson@dermit.com", password: "doctor123" },
    admin: { email: "admin@dermit.com", password: "admin123" }
  };

  const handlePatientLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Patient login:", { email: patientEmail, password: patientPassword });
    
    // Check sample user credentials
    if (patientEmail === sampleUsers.patient.email && patientPassword === sampleUsers.patient.password) {
      navigate("/patient/dashboard");
    } else {
      alert("Invalid credentials. Try: john.doe@example.com / patient123");
    }
  };

  const handleDoctorLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Doctor login:", { email: doctorEmail, password: doctorPassword });
    
    // Check sample user credentials
    if (doctorEmail === sampleUsers.doctor.email && doctorPassword === sampleUsers.doctor.password) {
      navigate("/doctor/dashboard");
    } else {
      alert("Invalid credentials. Try: sarah.johnson@dermit.com / doctor123");
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Admin login:", { email: adminEmail, password: adminPassword });
    
    // Check sample user credentials
    if (adminEmail === sampleUsers.admin.email && adminPassword === sampleUsers.admin.password) {
      navigate("/admin/dashboard");
    } else {
      alert("Invalid credentials. Try: admin@dermit.com / admin123");
    }
  };

  const fillSampleCredentials = (type: 'patient' | 'doctor' | 'admin') => {
    switch (type) {
      case 'patient':
        setPatientEmail(sampleUsers.patient.email);
        setPatientPassword(sampleUsers.patient.password);
        break;
      case 'doctor':
        setDoctorEmail(sampleUsers.doctor.email);
        setDoctorPassword(sampleUsers.doctor.password);
        break;
      case 'admin':
        setAdminEmail(sampleUsers.admin.email);
        setAdminPassword(sampleUsers.admin.password);
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">Dermit</span>
          </Link>
          <p className="text-gray-600 mt-2">Welcome back to your account</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-gray-900">Sign In</CardTitle>
            <CardDescription className="text-gray-600">
              Choose your account type to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs defaultValue="patient" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="patient" className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Patient</span>
                </TabsTrigger>
                <TabsTrigger value="doctor" className="flex items-center space-x-2">
                  <UserCheck className="w-4 h-4" />
                  <span>Doctor</span>
                </TabsTrigger>
                <TabsTrigger value="admin" className="flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>Admin</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="patient">
                <form onSubmit={handlePatientLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="patient-email">Email</Label>
                    <Input
                      id="patient-email"
                      type="email"
                      placeholder="Enter your email"
                      value={patientEmail}
                      onChange={(e) => setPatientEmail(e.target.value)}
                      required
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patient-password">Password</Label>
                    <Input
                      id="patient-password"
                      type="password"
                      placeholder="Enter your password"
                      value={patientPassword}
                      onChange={(e) => setPatientPassword(e.target.value)}
                      required
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white py-2"
                  >
                    Sign In as Patient
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full"
                    onClick={() => fillSampleCredentials('patient')}
                  >
                    Use Sample Patient Account
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="doctor">
                <form onSubmit={handleDoctorLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="doctor-email">Email</Label>
                    <Input
                      id="doctor-email"
                      type="email"
                      placeholder="Enter your email"
                      value={doctorEmail}
                      onChange={(e) => setDoctorEmail(e.target.value)}
                      required
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="doctor-password">Password</Label>
                    <Input
                      id="doctor-password"
                      type="password"
                      placeholder="Enter your password"
                      value={doctorPassword}
                      onChange={(e) => setDoctorPassword(e.target.value)}
                      required
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-2"
                  >
                    Sign In as Doctor
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full"
                    onClick={() => fillSampleCredentials('doctor')}
                  >
                    Use Sample Doctor Account
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="admin">
                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Email</Label>
                    <Input
                      id="admin-email"
                      type="email"
                      placeholder="Enter your email"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      required
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-password">Password</Label>
                    <Input
                      id="admin-password"
                      type="password"
                      placeholder="Enter your password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      required
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-2"
                  >
                    Sign In as Admin
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full"
                    onClick={() => fillSampleCredentials('admin')}
                  >
                    Use Sample Admin Account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="text-center space-y-4">
              <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 hover:underline">
                Forgot your password?
              </Link>
              <div className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
                  Sign up
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sample Credentials Info */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Sample Test Accounts:</h3>
            <div className="text-sm text-blue-800 space-y-1">
              <p><strong>Patient:</strong> john.doe@example.com / patient123</p>
              <p><strong>Doctor:</strong> sarah.johnson@dermit.com / doctor123</p>
              <p><strong>Admin:</strong> admin@dermit.com / admin123</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
