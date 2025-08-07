import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, User, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DoctorHeader from "@/components/DoctorHeader";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
interface ProfileData {
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  specialty?: string;
}
const DoctorProfile = () => {
  const navigate = useNavigate();
  const { user, changePassword } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [loading, setLoading] = useState(true);

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialty: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Fetch doctor profile on mount
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchDoctorProfile = async () => {
      setLoading(true);

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select(
            `              
            first_name,
              last_name,
              email,
              phone
            )
          `
          )
          .eq("id", user.id)
          .single<ProfileData>();

        if (error) throw error;

        if (data) {
          setProfileData({
            firstName: data.first_name || "",
            lastName: data.last_name || "",
            email: data.email || "",
            phone: data.phone || "",
            specialty: data.specialty || "Dermatologist",
          });
        }
      } catch (error) {
        console.error("Error loading doctor profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorProfile();
  }, [user, navigate]);
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords don't match! 💥");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert("Password must be at least 6 characters long! 🔒");
      return;
    }

    try {
      // Call the changePassword function from your Auth context
      const { error } = await changePassword(passwordData.newPassword);

      if (error) {
        alert(`Uh-oh, something went wrong: ${error.message}`);
        return;
      }

      alert("Password changed successfully! 🎉");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordChange(false);
    } catch (err) {
      alert("Unexpected error occurred. Try again later.");
      console.error(err);
    }
  };
  const handleSaveProfile = async () => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: profileData.firstName,
          last_name: profileData.lastName,
          email: profileData.email,
          phone: profileData.phone,
        })
        .eq("id", user.id);

      if (error) throw error;

      alert("Profile updated successfully! 💫");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("There was a hiccup saving your profile 😓");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading profile...</p>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <DoctorHeader />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Doctor Profile
          </h1>
          <p className="text-gray-600">
            Manage your professional information and settings
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Photo */}
          <div>
            <Card className="shadow-lg">
              <CardContent className="p-6 text-center">
                <Avatar className="w-32 h-32 mx-auto mb-4">
                  <AvatarImage src="/placeholder-doctor.jpg" />
                  <AvatarFallback className="text-2xl">
                    {profileData.firstName[0]}
                    {profileData.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Dr. {profileData.firstName} {profileData.lastName}
                </h3>
                <Badge className="mb-4">{profileData.specialty}</Badge>
                <Button variant="outline" className="w-full mb-3">
                  <Camera className="w-4 h-4 mr-2" />
                  Change Photo
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowPasswordChange(!showPasswordChange)}
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Password Change Form */}
            {showPasswordChange && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Lock className="w-5 h-5 text-blue-600" />
                    <span>Change Password</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            newPassword: e.target.value,
                          })
                        }
                        required
                        minLength={6}
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">
                        Confirm New Password
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            confirmPassword: e.target.value,
                          })
                        }
                        required
                        minLength={6}
                      />
                    </div>
                    <div className="flex space-x-3">
                      <Button
                        type="submit"
                        className="bg-gradient-to-r from-brand-primary to-brand-secondary"
                      >
                        Update Password
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowPasswordChange(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Personal Information */}
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-brand-primary" />
                    <span>Personal Information</span>
                  </CardTitle>
                  <div>
                    <Button
                      className="bg-gradient-to-r from-brand-primary to-brand-secondary"
                      onClick={() => {
                        if (isEditing) {
                          handleSaveProfile();
                        } else {
                          setIsEditing(true);
                        }
                      }}
                    >
                      {isEditing ? "Save Profile" : "Edit Profile"}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      {isEditing ? (
                        <Input
                          id="firstName"
                          value={profileData.firstName}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              firstName: e.target.value,
                            })
                          }
                        />
                      ) : (
                        <p className="text-gray-900">{profileData.firstName}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      {isEditing ? (
                        <Input
                          id="lastName"
                          value={profileData.lastName}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              lastName: e.target.value,
                            })
                          }
                        />
                      ) : (
                        <p className="text-gray-900">{profileData.lastName}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            email: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <p className="text-gray-900">{profileData.email}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            phone: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <p className="text-gray-900">{profileData.phone}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
