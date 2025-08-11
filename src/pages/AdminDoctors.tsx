import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import AdminHeader from "@/components/AdminHeader";
import DashboardButton from "@/components/adminDashboard/DashboardButtons";
import DoctorsList from "@/components/adminDoctors/DoctorsList";
import { supabase } from "@/integrations/supabase/client";

type Doctor = {
  id: string;
  first_name: string;
  last_name?: string;
  email: string;
  phone: string;
  specialty: string;
  profilePic: string;
  photo?: File | null;
};

const AdminDoctors = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddingDoctor, setIsAddingDoctor] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [patientsNo, setPatientsNo] = useState(0);
  const [consultationsNo, setConsultationsNo] = useState(0);
  const [doctors, setDoctors] = useState([]);
  const cloudinary_url = "https://api.cloudinary.com/v1_1/dmrspz5bh/image/upload";
  const addDoctor = (newDoctor) => {
    setDoctors((prevItems) => [...prevItems, newDoctor]);
  };

  useEffect(() => {
    const fetchDoctors = async () => {
      const { data, error } = await supabase
        .from("doctor_profiles")
        .select("*");
      console.log("Fetched doctors:", data, error);
      if (error) {
        console.error("Error fetching doctors:", error);
      } else {
        data.forEach((doc) => addDoctor(doc));
        // setDoctors(data || []);
      }
    };
    const fetchPatientsNo = async () => {
      const { data, count, error } = await supabase
        .from("patient_profiles")
        .select("*", { count: "exact" });
      if (error) {
        console.error("Error fetching patients:", error);
      } else {
        setPatientsNo(count);
      }
    };
    const fetchConsultationsNo = async () => {
      const { data, count, error } = await supabase
        .from("consultations")
        .select("*", { count: "exact" });
      if (error) {
        console.error("Error fetching consultations:", error);
      } else {
        setConsultationsNo(count);
      }
    };

    fetchDoctors();
    fetchConsultationsNo();
    fetchPatientsNo();
  }, []);

  const [newDoctor, setNewDoctor] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    specialty: "",
    profilePic: "",
    photo: null,
  });
  const [editFormData, setEditFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    specialty: "",
    profilePic: "",
    photo: null as File | null,
  });
  useEffect(() => {
    console.log("Editing doctor:", editingDoctor);
    if (editingDoctor) {
      setEditFormData({
        first_name: editingDoctor.first_name,
        last_name: editingDoctor.last_name || "",
        email: editingDoctor.email,
        phone: editingDoctor.phone || "",
        specialty: editingDoctor.specialty || "",
        profilePic: editFormData.profilePic || "",
        photo: null, // Reset photo for edit
      });
    }
  }, [editingDoctor]);

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleDoctorInputChange = (field: string, value: string) => {
    setNewDoctor((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddDoctor = () => {
    if (newDoctor.first_name && newDoctor.email && newDoctor.specialty) {
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
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        specialty: "",
        profilePic: "",
        photo: null,
      });
      setIsAddingDoctor(false);
    }
  };

  const handleEditDoctor = (doctorId: number) => {
    const doc = doctors.find((d) => d.id === doctorId) || null;
    setEditingDoctor(doc);
  };
  const handleSaveEdit = async () => {
    console.log("saving edit for doctor:", editFormData);
    if (!editingDoctor) return;

    let uploadedImageUrl = editingDoctor.profilePic || ""; // Default to existing one

    if (editFormData.photo) {
      console.log("Uploading new photo:", editFormData.photo);
      const formData = new FormData();
      formData.append("file", editFormData.photo);
      formData.append("upload_preset", "gth9yu4u");
      formData.append("folder", "doctor_profile");

      const res = await fetch(cloudinary_url, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      uploadedImageUrl = data.secure_url;
      console.log("Image uploaded:", data);
    }

    const updatedDoctor = {
      ...editFormData,
      profilePic: uploadedImageUrl,
    };

    setDoctors((prevDoctors) =>
      prevDoctors.map((doc) =>
        doc.id === editingDoctor.id ? { ...doc, ...updatedDoctor } : doc
      )
    );

    // optional: update in your DB
    const { data, error } = await supabase.rpc("update_doctor", {
      p_doctor_id: editingDoctor.id,
      p_first_name: updatedDoctor.first_name,
      p_last_name: updatedDoctor.last_name,
      p_email: updatedDoctor.email,
      p_phone: updatedDoctor.phone,
      p_specialty: updatedDoctor.specialty,
      p_profilepic: updatedDoctor.profilePic,
    });

    if (error) {
      console.error("Update error:", error);
    } else {
      setEditingDoctor(null);
      // maybe show success feedback here!
    }
  };

  const handleToggleStatus = async (doctorId: string) => {
    try {
      // Find the doctor object
      const doctor = doctors.find((doc) => doc.id === doctorId);
      if (!doctor) return;

      // Flip the status
      const newStatus = doctor.status === "active" ? "inactive" : "active";

      // Update backend (Supabase example)
      const { error } = await supabase
        .from("doctors_info")
        .update({ status: newStatus })
        .eq("profile_id", doctorId);

      if (error) throw error;

      // If update successful, update local state
      setDoctors(
        doctors.map((doc) =>
          doc.id === doctorId ? { ...doc, status: newStatus } : doc
        )
      );
    } catch (error) {
      console.error("Failed to update status:", error);
      // Optional: Add user-friendly error feedback here!
    }
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
                    <Button className="bg-gradient-to-r from-brand-primary to-brand-secondary">
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
                    <form onSubmit={handleAddDoctor} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            value={newDoctor.first_name}
                            onChange={(e) =>
                              handleDoctorInputChange(
                                "first_name",
                                e.target.value
                              )
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            value={newDoctor.last_name}
                            onChange={(e) =>
                              handleDoctorInputChange(
                                "last_name",
                                e.target.value
                              )
                            }
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
                          onChange={(e) =>
                            handleDoctorInputChange("email", e.target.value)
                          }
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={newDoctor.phone}
                          onChange={(e) =>
                            handleDoctorInputChange("phone", e.target.value)
                          }
                          required
                        />
                      </div>
                    </form>
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsAddingDoctor(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="bg-gradient-to-r from-brand-primary to-brand-secondary"
                        onClick={handleAddDoctor}
                      >
                        Add Doctor
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                {/* Edit doctor */}
                <Dialog
                  open={!!editingDoctor}
                  onOpenChange={(open) => !open && setEditingDoctor(null)}
                >
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Edit Doctor</DialogTitle>
                      <DialogDescription>
                        Update the doctor's information
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      {/* Like your Add Doctor form but use editFormData and setEditFormData */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="editName">First Name</Label>
                          <Input
                            id="editName"
                            value={editFormData.first_name}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
                                first_name: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="editEmail">Email</Label>
                          <Input
                            id="editEmail"
                            type="email"
                            value={editFormData.email}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
                                email: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      {/* Add inputs for phone, specialty, licenseNumber, licenseExpiry, experience, bio... */}
                      {/* For example: */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="editPhone">Phone</Label>
                          <Input
                            id="editPhone"
                            value={editFormData.phone}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
                                phone: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="editSpecialty">Specialty</Label>
                          <Input
                            id="editSpecialty"
                            value={editFormData.specialty}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
                                specialty: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      {/* Continue with licenseNumber, licenseExpiry, experience, bio */}
                    </div>

                    <div>
                      <Label htmlFor="profilePic">Profile Picture</Label>
                      <Input
                        id="profilePic"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            // Store the file itself for uploading
                            setEditFormData((prev) => ({
                              ...prev,
                              photo: file, // use this for Cloudinary
                            }));

                            // Optional: Show base64 preview
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setEditFormData((prev) => ({
                                ...prev,
                                profilePic: reader.result as string, // use this for UI preview
                              }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />

                      {editFormData.profilePic && (
                        <img
                          src={editFormData.profilePic}
                          alt="Profile preview"
                          className="mt-2 w-24 h-24 rounded-full object-cover"
                        />
                      )}
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setEditingDoctor(null)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleSaveEdit}>Save</Button>
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
            value={patientsNo}
            icon={UserPlus}
            color="purple"
          />

          <DashboardButton
            description="Total Consultations"
            value={consultationsNo}
            icon={Stethoscope}
            color="orange"
          />
        </div>

        {/* Doctors List */}

        <DoctorsList
          doctors={filteredDoctors}
          onEdit={(id: string) => handleEditDoctor(parseInt(id))}
          onToggleStatus={handleToggleStatus}
        />
      </div>
    </div>
  );
};

export default AdminDoctors;
