import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Users,
  Search,
  Filter,
  Activity,
  Stethoscope,
  Plus,
  UserPlus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import AdminHeader from "@/components/AdminHeader";
import DashboardButton from "@/components/adminDashboard/DashboardButtons";
import DoctorsList from "@/components/adminDoctors/DoctorsList";

const AdminDoctors = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddingDoctor, setIsAddingDoctor] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<number | null>(null);

  const handleLogout = () => {
    navigate("/login");
  };

  // Mock doctor data
  const [doctors, setDoctors] = useState([
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@dermit.com",
      phone: "+1 (555) 123-4567",
      specialty: "Dermatology",
      licenseNumber: "DRM-2024-001",
      licenseExpiry: "2025-12-31",
      experience: "8 years",
      status: "active",
      patients: 145,
      consultations: 892,
      joinDate: "2023-01-15",
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      email: "michael.chen@dermit.com",
      phone: "+1 (555) 234-5678",
      specialty: "Dermatology",
      licenseNumber: "DRM-2024-002",
      licenseExpiry: "2025-08-15",
      experience: "12 years",
      status: "active",
      patients: 198,
      consultations: 1247,
      joinDate: "2023-03-20",
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      email: "emily.rodriguez@dermit.com",
      phone: "+1 (555) 345-6789",
      specialty: "Pediatric Dermatology",
      licenseNumber: "DRM-2024-003",
      licenseExpiry: "2024-11-30",
      experience: "6 years",
      status: "inactive",
      patients: 89,
      consultations: 356,
      joinDate: "2023-06-10",
    },
  ]);

  const [newDoctor, setNewDoctor] = useState({
    name: "",
    email: "",
    phone: "",
    specialty: "",
    licenseNumber: "",
    licenseExpiry: "",
    experience: "",
    bio: "",
  });

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddDoctor = () => {
    if (newDoctor.name && newDoctor.email && newDoctor.specialty) {
      const doctor = {
        id: doctors.length + 1,
        ...newDoctor,
        status: "active" as const,
        patients: 0,
        consultations: 0,
        joinDate: new Date().toISOString().split("T")[0],
      };
      setDoctors([...doctors, doctor]);
      setNewDoctor({
        name: "",
        email: "",
        phone: "",
        specialty: "",
        licenseNumber: "",
        licenseExpiry: "",
        experience: "",
        bio: "",
      });
      setIsAddingDoctor(false);
    }
  };

  const handleEditDoctor = (doctorId: number) => {
    setEditingDoctor(editingDoctor === doctorId ? null : doctorId);
  };

  const handleToggleStatus = (doctorId: number) => {
    setDoctors(
      doctors.map((doctor) =>
        doctor.id === doctorId
          ? {
              ...doctor,
              status: doctor.status === "active" ? "inactive" : "active",
            }
          : doctor
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      {/* Header */}
      <AdminHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Doctor Management
          </h1>
          <p className="text-gray-600">
            Manage doctors, their credentials, and practice information
          </p>
        </div>

        {/* Search and Actions */}
        <Card className="shadow-lg mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search doctors by name, specialty, or email..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                </Button>
                <Dialog open={isAddingDoctor} onOpenChange={setIsAddingDoctor}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Doctor
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Add New Doctor</DialogTitle>
                      <DialogDescription>
                        Enter the doctor's information and credentials
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={newDoctor.name}
                            onChange={(e) =>
                              setNewDoctor({
                                ...newDoctor,
                                name: e.target.value,
                              })
                            }
                            placeholder="Dr. John Doe"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={newDoctor.email}
                            onChange={(e) =>
                              setNewDoctor({
                                ...newDoctor,
                                email: e.target.value,
                              })
                            }
                            placeholder="john.doe@dermit.com"
                          />
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            value={newDoctor.phone}
                            onChange={(e) =>
                              setNewDoctor({
                                ...newDoctor,
                                phone: e.target.value,
                              })
                            }
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>
                        <div>
                          <Label htmlFor="specialty">Specialty</Label>
                          <Input
                            id="specialty"
                            value={newDoctor.specialty}
                            onChange={(e) =>
                              setNewDoctor({
                                ...newDoctor,
                                specialty: e.target.value,
                              })
                            }
                            placeholder="Dermatology"
                          />
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="licenseNumber">License Number</Label>
                          <Input
                            id="licenseNumber"
                            value={newDoctor.licenseNumber}
                            onChange={(e) =>
                              setNewDoctor({
                                ...newDoctor,
                                licenseNumber: e.target.value,
                              })
                            }
                            placeholder="DRM-2024-004"
                          />
                        </div>
                        <div>
                          <Label htmlFor="licenseExpiry">License Expiry</Label>
                          <Input
                            id="licenseExpiry"
                            type="date"
                            value={newDoctor.licenseExpiry}
                            onChange={(e) =>
                              setNewDoctor({
                                ...newDoctor,
                                licenseExpiry: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="experience">Years of Experience</Label>
                        <Input
                          id="experience"
                          value={newDoctor.experience}
                          onChange={(e) =>
                            setNewDoctor({
                              ...newDoctor,
                              experience: e.target.value,
                            })
                          }
                          placeholder="5 years"
                        />
                      </div>
                      <div>
                        <Label htmlFor="bio">Biography</Label>
                        <Textarea
                          id="bio"
                          value={newDoctor.bio}
                          onChange={(e) =>
                            setNewDoctor({ ...newDoctor, bio: e.target.value })
                          }
                          placeholder="Brief professional biography..."
                          rows={3}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsAddingDoctor(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleAddDoctor}>Add Doctor</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <DashboardButton
            description="Total Doctors"
            value={doctors.length}
            icon={Users}
            color="blue"
          />

          <DashboardButton
            description="Active Doctors"
            value={doctors.filter((d) => d.status === "active").length}
            icon={Activity}
            color="green"
          />

          <DashboardButton
            description="Total Patients"
            value={doctors.reduce((sum, d) => sum + d.patients, 0)}
            icon={UserPlus}
            color="purple"
          />

          <DashboardButton
            description="Total Consultations"
            value={doctors.reduce((sum, d) => sum + d.consultations, 0)}
            icon={Stethoscope}
            color="orange"
          />
        </div>

        {/* Doctors List */}

        <DoctorsList
          doctors={filteredDoctors}
          onEdit={handleEditDoctor}
          onToggleStatus={handleToggleStatus}
        />
      </div>
    </div>
  );
};

export default AdminDoctors;
