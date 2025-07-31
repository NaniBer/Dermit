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
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Camera,
  Save,
  ChevronDown,
  LogOut,
  Edit,
  Lock,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PatientHeader from "@/components/PatientHeader";

const PatientProfile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    dateOfBirth: "1990-05-15",
    address: "123 Main St, Anytown, AT 12345",
    emergencyContact: "Jane Doe - +1 (555) 987-6543",
    medicalHistory:
      "No known allergies. Previous skin conditions: mild eczema as a child.",
    currentMedications: "None",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSave = () => {
    console.log("Saving profile:", profile);
    setIsEditing(false);
    // Handle profile update logic here
  };

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords don't match!");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      alert("Password must be at least 6 characters long!");
      return;
    }
    console.log("Changing password...");
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    alert("Password changed successfully!");
  };

  const handleInputChange = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordInputChange = (field: string, value: string) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <PatientHeader />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Profile Settings
          </h1>
          <p className="text-gray-600">
            Manage your personal information and preferences
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Picture */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="relative inline-block">
                  <Avatar className="w-32 h-32 mx-auto">
                    <AvatarImage src="/placeholder-patient.jpg" />
                    <AvatarFallback className="text-2xl">
                      {profile.firstName[0]}
                      {profile.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  Click the camera icon to upload a new photo
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Profile Information */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account information and security
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="personal" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="personal">Personal Info</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                  </TabsList>

                  <TabsContent value="personal" className="space-y-6 mt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">
                        Personal Information
                      </h3>
                      <Button
                        onClick={() =>
                          isEditing ? handleSave() : setIsEditing(true)
                        }
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {isEditing ? (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                          </>
                        ) : (
                          <>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Profile
                          </>
                        )}
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={profile.firstName}
                          onChange={(e) =>
                            handleInputChange("firstName", e.target.value)
                          }
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={profile.lastName}
                          onChange={(e) =>
                            handleInputChange("lastName", e.target.value)
                          }
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={profile.phone}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={profile.dateOfBirth}
                          onChange={(e) =>
                            handleInputChange("dateOfBirth", e.target.value)
                          }
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={profile.address}
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="emergencyContact">
                        Emergency Contact
                      </Label>
                      <Input
                        id="emergencyContact"
                        value={profile.emergencyContact}
                        onChange={(e) =>
                          handleInputChange("emergencyContact", e.target.value)
                        }
                        disabled={!isEditing}
                        placeholder="Name - Phone Number"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="medicalHistory">Medical History</Label>
                      <Textarea
                        id="medicalHistory"
                        value={profile.medicalHistory}
                        onChange={(e) =>
                          handleInputChange("medicalHistory", e.target.value)
                        }
                        disabled={!isEditing}
                        rows={3}
                        placeholder="Any relevant medical history, allergies, or previous conditions..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="currentMedications">
                        Current Medications
                      </Label>
                      <Textarea
                        id="currentMedications"
                        value={profile.currentMedications}
                        onChange={(e) =>
                          handleInputChange(
                            "currentMedications",
                            e.target.value
                          )
                        }
                        disabled={!isEditing}
                        rows={2}
                        placeholder="List any medications you are currently taking..."
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="security" className="space-y-6 mt-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <Lock className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-medium">Change Password</h3>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">
                          Current Password
                        </Label>
                        <Input
                          id="currentPassword"
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={(e) =>
                            handlePasswordInputChange(
                              "currentPassword",
                              e.target.value
                            )
                          }
                          placeholder="Enter your current password"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) =>
                            handlePasswordInputChange(
                              "newPassword",
                              e.target.value
                            )
                          }
                          placeholder="Enter your new password"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">
                          Confirm New Password
                        </Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) =>
                            handlePasswordInputChange(
                              "confirmPassword",
                              e.target.value
                            )
                          }
                          placeholder="Confirm your new password"
                        />
                      </div>

                      <Button
                        onClick={handlePasswordChange}
                        className="bg-blue-600 hover:bg-blue-700"
                        disabled={
                          !passwordData.currentPassword ||
                          !passwordData.newPassword ||
                          !passwordData.confirmPassword
                        }
                      >
                        <Lock className="w-4 h-4 mr-2" />
                        Change Password
                      </Button>
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

export default PatientProfile;
