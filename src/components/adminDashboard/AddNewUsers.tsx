import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, UserCheck, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
const AddNewUsers = () => {
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
    medicalLicense: null as File | null,
  });

  const [newAdmin, setNewAdmin] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
  });

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
            phone: newDoctor.phone,
          },
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        // Assign doctor role
        const { error: roleError } = await supabase.from("user_roles").insert({
          user_id: authData.user.id,
          role: "doctor",
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
          medicalLicense: null,
        });
      }
    } catch (error) {
      toast.error(error.message || "Failed to create doctor account");
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Create user account for admin
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newAdmin.email,
        password: "TempPassword123!Admin",
        options: {
          data: {
            first_name: newAdmin.firstName,
            last_name: newAdmin.lastName,
            phone: newAdmin.phone,
          },
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        // Assign admin role
        const { error: roleError } = await supabase.from("user_roles").insert({
          user_id: authData.user.id,
          role: "admin",
        });

        const { error: phoneError } = await supabase
          .from("profiles")
          .update({
            phone: newAdmin.phone,
          })
          .eq("id", authData.user.id);

        if (roleError) throw roleError;
        if (phoneError) throw phoneError;

        toast.success("Admin account created successfully!");
        setNewAdmin({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          phone: "",
        });
      }
    } catch (error) {
      toast.error(error.message || "Failed to create admin account");
    }
  };
  const handleDoctorInputChange = (field: string, value: string) => {
    setNewDoctor((prev) => ({ ...prev, [field]: value }));
  };

  const handleAdminInputChange = (field: string, value: string) => {
    setNewAdmin((prev) => ({ ...prev, [field]: value }));
  };
  return (
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
              <TabsTrigger
                value="doctor"
                className="flex items-center space-x-2"
              >
                <UserCheck className="w-4 h-4" />
                <span>Doctor</span>
              </TabsTrigger>
              <TabsTrigger
                value="admin"
                className="flex items-center space-x-2"
              >
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
                      onChange={(e) =>
                        handleDoctorInputChange("firstName", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={newDoctor.lastName}
                      onChange={(e) =>
                        handleDoctorInputChange("lastName", e.target.value)
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

                <div className="space-y-2">
                  <Label htmlFor="specialty">Specialty</Label>
                  <Input
                    id="specialty"
                    value={newDoctor.specialty}
                    onChange={(e) =>
                      handleDoctorInputChange("specialty", e.target.value)
                    }
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
                      onChange={(e) =>
                        handleAdminInputChange("firstName", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="adminLastName">Last Name</Label>
                    <Input
                      id="adminLastName"
                      value={newAdmin.lastName}
                      onChange={(e) =>
                        handleAdminInputChange("lastName", e.target.value)
                      }
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
                    onChange={(e) =>
                      handleAdminInputChange("email", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adminPhone">Phone</Label>
                  <Input
                    id="adminPhone"
                    type="tel"
                    value={newAdmin.phone}
                    onChange={(e) =>
                      handleAdminInputChange("phone", e.target.value)
                    }
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
  );
};
export default AddNewUsers;
