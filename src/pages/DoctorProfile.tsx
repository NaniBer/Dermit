import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, User, Edit, X, Lock, Stethoscope } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DoctorHeader from "@/components/DoctorHeader";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const DoctorProfile = () => {
  const navigate = useNavigate();
  const user = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [loading, setLoading] = useState(true);

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialty: "",
    licenseNumber: "",
    yearsOfExperience: "",
    education: "",
    certifications: "",
    bio: "",
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
      console.log(user);
      try {
        const { data, error } = await supabase
          .from("doctors_info")
          .select(
            `
            specialty,
            license_number,
            years_of_experience,
            education,
            certifications,
            bio,
            profiles (
              first_name,
              last_name,
              email,
              phone
            )
          `
          )
          .eq("profiles.id", user.user.id)
          .single();
        console.log(user);
        console.log(data);

        if (error) throw error;

        if (data) {
          setProfileData({
            firstName: data.profiles.first_name || "",
            lastName: data.profiles.last_name || "",
            email: data.profiles.email || "",
            phone: data.profiles.phone || "",
            specialty: data.specialty || "",
            licenseNumber: data.license_number || "",
            yearsOfExperience: data.years_of_experience?.toString() || "",
            education: data.education || "",
            certifications: data.certifications || "",
            bio: data.bio || "",
          });
        }
      } catch (error) {
        console.error("Error loading doctor profile:", error);
        alert("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorProfile();
  }, [user, navigate]);
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords don't match!");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      alert("Password must be at least 6 characters long!");
      return;
    }

    // In real app, this would make API call to change password
    console.log("Changing password...");
    alert("Password changed successfully!");
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setShowPasswordChange(false);
  };

  const handleLogout = () => {
    navigate("/login");
  };
  // ... Your existing handlers (handleLogout, handleSave, handleCancel, handlePasswordChange) remain the same.

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

            {/* Professional Stats */}
            <Card className="shadow-lg mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Professional Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Years of Experience
                    </span>
                    <span className="font-medium">
                      {profileData.yearsOfExperience} years
                    </span>
                  </div>
                  {/* <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Total Patients
                    </span>
                    <span className="font-medium">1,247</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Consultations</span>
                    <span className="font-medium">3,891</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Rating</span>
                    <span className="font-medium">4.8/5.0</span>
                  </div> */}
                </div>
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
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            currentPassword: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
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
                        className="bg-blue-600 hover:bg-blue-700"
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
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-blue-600" />
                  <span>Personal Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        First Name
                      </label>
                      <p className="text-gray-900">{profileData.firstName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Last Name
                      </label>
                      <p className="text-gray-900">{profileData.lastName}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Email
                    </label>
                    <p className="text-gray-900">{profileData.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Phone
                    </label>
                    <p className="text-gray-900">{profileData.phone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Professional Information */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Stethoscope className="w-5 h-5 text-blue-600" />
                  <span>Professional Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Specialty
                    </label>
                    <p className="text-gray-900">{profileData.specialty}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      License Number
                    </label>
                    <p className="text-gray-900">{profileData.licenseNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Education
                    </label>
                    <p className="text-gray-900">{profileData.education}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Certifications
                    </label>
                    <p className="text-gray-900">
                      {profileData.certifications}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Bio
                    </label>
                    <p className="text-gray-900">{profileData.bio}</p>
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
