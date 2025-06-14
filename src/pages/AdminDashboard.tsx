import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Stethoscope, 
  Users, 
  UserCheck, 
  Mail, 
  Upload,
  Calendar,
  Trash2,
  Edit,
  FileText,
  BarChart3,
  ChevronDown,
  LogOut,
  Shield
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [newDoctor, setNewDoctor] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialty: "",
    licenseNumber: "",
    experience: "",
    licenseExpiry: "",
    medicalCertificate: null as File | null,
    medicalLicense: null as File | null
  });

  const [newAdmin, setNewAdmin] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: ""
  });

  // Mock data for existing doctors
  const doctors = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@dermit.com",
      specialty: "General Dermatology",
      licenseNumber: "MD12345",
      experience: "8 years",
      status: "active",
      consultations: 156,
      joinDate: "2023-01-15",
      licenseExpiry: "2025-12-31"
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      email: "michael.chen@dermit.com",
      specialty: "Pediatric Dermatology",
      licenseNumber: "MD67890",
      experience: "12 years",
      status: "active",
      consultations: 203,
      joinDate: "2023-03-22",
      licenseExpiry: "2024-08-15"
    }
  ];

  // Mock data for existing admins
  const admins = [
    {
      id: 1,
      name: "Admin User",
      email: "admin@dermit.com",
      joinDate: "2023-01-01",
      status: "active"
    }
  ];

  const handleAddDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Create user account for doctor
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newDoctor.email,
        password: "TempPassword123!", // You might want to generate this or ask for it
        options: {
          data: {
            first_name: newDoctor.firstName,
            last_name: newDoctor.lastName,
            phone: newDoctor.phone
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // Assign doctor role
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: authData.user.id,
            role: 'doctor'
          });

        if (roleError) throw roleError;

        toast.success("Doctor account created successfully!");
        setNewDoctor({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          specialty: "",
          licenseNumber: "",
          experience: "",
          licenseExpiry: "",
          medicalCertificate: null,
          medicalLicense: null
        });
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create doctor account");
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Create user account for admin
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newAdmin.email,
        password: newAdmin.password,
        options: {
          data: {
            first_name: newAdmin.firstName,
            last_name: newAdmin.lastName,
            phone: newAdmin.phone
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // Assign admin role
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: authData.user.id,
            role: 'admin'
          });

        if (roleError) throw roleError;

        toast.success("Admin account created successfully!");
        setNewAdmin({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          phone: ""
        });
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create admin account");
    }
  };

  const handleDoctorInputChange = (field: string, value: string) => {
    setNewDoctor(prev => ({ ...prev, [field]: value }));
  };

  const handleAdminInputChange = (field: string, value: string) => {
    setNewAdmin(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field: string, file: File | null) => {
    setNewDoctor(prev => ({ ...prev, [field]: file }));
  };

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Stethoscope className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">Dermit</span>
                <Badge variant="secondary" className="ml-2 bg-purple-100 text-purple-800">Admin</Badge>
              </Link>
              <nav className="hidden md:flex space-x-6">
                <Link to="/admin/dashboard" className="text-gray-900 font-medium">Dashboard</Link>
                <Link to="/admin/overview" className="text-gray-600 hover:text-gray-900">Overview</Link>
                <Link to="/admin/doctors" className="text-gray-600 hover:text-gray-900">Doctors</Link>
                <Link to="/admin/patients" className="text-gray-600 hover:text-gray-900">Patients</Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="/placeholder-admin.jpg" />
                      <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                    <span className="hidden md:block text-sm font-medium">Admin User</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => navigate("/admin/profile")}>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage doctors, admins, and oversee the Dermit platform</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Doctors</p>
                  <p className="text-3xl font-bold text-gray-900">{doctors.length}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Admins</p>
                  <p className="text-3xl font-bold text-purple-600">{admins.length}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Consultations</p>
                  <p className="text-3xl font-bold text-green-600">27</p>
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
                  <p className="text-sm font-medium text-gray-600">Total Patients</p>
                  <p className="text-3xl font-bold text-blue-600">1,234</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Add New Users */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="w-5 h-5 text-purple-600" />
                  <span>Add New Users</span>
                </CardTitle>
                <CardDescription>Create new doctor or admin accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="doctor" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="doctor" className="flex items-center space-x-2">
                      <UserCheck className="w-4 h-4" />
                      <span>Doctor</span>
                    </TabsTrigger>
                    <TabsTrigger value="admin" className="flex items-center space-x-2">
                      <Shield className="w-4 h-4" />
                      <span>Admin</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="doctor" className="mt-4">
                    <form onSubmit={handleAddDoctor} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            value={newDoctor.firstName}
                            onChange={(e) => handleDoctorInputChange("firstName", e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            value={newDoctor.lastName}
                            onChange={(e) => handleDoctorInputChange("lastName", e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newDoctor.email}
                          onChange={(e) => handleDoctorInputChange("email", e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={newDoctor.phone}
                          onChange={(e) => handleDoctorInputChange("phone", e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="specialty">Specialty</Label>
                        <Input
                          id="specialty"
                          value={newDoctor.specialty}
                          onChange={(e) => handleDoctorInputChange("specialty", e.target.value)}
                          placeholder="e.g., General Dermatology"
                          required
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                      >
                        Create Doctor Account
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="admin" className="mt-4">
                    <form onSubmit={handleAddAdmin} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="adminFirstName">First Name</Label>
                          <Input
                            id="adminFirstName"
                            value={newAdmin.firstName}
                            onChange={(e) => handleAdminInputChange("firstName", e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="adminLastName">Last Name</Label>
                          <Input
                            id="adminLastName"
                            value={newAdmin.lastName}
                            onChange={(e) => handleAdminInputChange("lastName", e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="adminEmail">Email</Label>
                        <Input
                          id="adminEmail"
                          type="email"
                          value={newAdmin.email}
                          onChange={(e) => handleAdminInputChange("email", e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="adminPassword">Password</Label>
                        <Input
                          id="adminPassword"
                          type="password"
                          value={newAdmin.password}
                          onChange={(e) => handleAdminInputChange("password", e.target.value)}
                          required
                          minLength={8}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="adminPhone">Phone</Label>
                        <Input
                          id="adminPhone"
                          type="tel"
                          value={newAdmin.phone}
                          onChange={(e) => handleAdminInputChange("phone", e.target.value)}
                          required
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                      >
                        Create Admin Account
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Existing Users */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-green-600" />
                  <span>Registered Users</span>
                </CardTitle>
                <CardDescription>Manage existing doctor and admin accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="doctors" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="doctors">Doctors ({doctors.length})</TabsTrigger>
                    <TabsTrigger value="admins">Admins ({admins.length})</TabsTrigger>
                  </TabsList>

                  <TabsContent value="doctors" className="mt-4">
                    <div className="space-y-4">
                      {doctors.map((doctor) => (
                        <div key={doctor.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-4">
                              <Avatar className="w-12 h-12">
                                <AvatarFallback className="bg-purple-100 text-purple-600">
                                  {doctor.name.split(' ').map(n => n[1]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-semibold text-gray-900">{doctor.name}</h4>
                                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                  <div className="flex items-center space-x-1">
                                    <Mail className="w-3 h-3" />
                                    <span>{doctor.email}</span>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                  <Badge variant="outline">{doctor.specialty}</Badge>
                                  <span>License: {doctor.licenseNumber}</span>
                                  <span className={`${new Date(doctor.licenseExpiry) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) ? 'text-orange-600' : 'text-green-600'}`}>
                                    Expires: {doctor.licenseExpiry}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge className="bg-green-100 text-green-800">{doctor.status}</Badge>
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Experience:</span>
                              <p className="font-medium">{doctor.experience}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Consultations:</span>
                              <p className="font-medium">{doctor.consultations}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Joined:</span>
                              <p className="font-medium">{doctor.joinDate}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="admins" className="mt-4">
                    <div className="space-y-4">
                      {admins.map((admin) => (
                        <div key={admin.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-4">
                              <Avatar className="w-12 h-12">
                                <AvatarFallback className="bg-purple-100 text-purple-600">
                                  {admin.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-semibold text-gray-900">{admin.name}</h4>
                                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                  <div className="flex items-center space-x-1">
                                    <Mail className="w-3 h-3" />
                                    <span>{admin.email}</span>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                  <Badge variant="outline" className="bg-purple-50 text-purple-700">Admin</Badge>
                                  <span>Joined: {admin.joinDate}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge className="bg-green-100 text-green-800">{admin.status}</Badge>
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
