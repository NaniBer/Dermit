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
import { Textarea } from "@/components/ui/textarea";
import { Stethoscope, User, UserCheck } from "lucide-react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Register = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const defaultTab = searchParams.get("type") || "patient";
  const { signUp, user } = useAuth();
  const { toast } = useToast();

  // Redirect if already logged in
  if (user) {
    navigate("/patient/dashboard");
    return null;
  }

  // Patient form state
  const [patientData, setPatientData] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone: string;
    dateOfBirth: string;
    role: "patient";
  }>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    dateOfBirth: "",
    role: "patient",
  });

  // Doctor form state
  const [doctorData, setDoctorData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    licenseNumber: "",
    specialization: "",
    experience: "",
    bio: "",
  });

  const [loading, setLoading] = useState(false);

  const handlePatientRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (patientData.password !== patientData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords don't match",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await signUp(
        patientData.email,
        patientData.password,
        patientData.firstName,
        patientData.lastName,
        patientData.role
      );

      if (!error) {
        // Add patient role
        const { data: userData } = await supabase.auth.getUser();
        console.log("User data after sign up:", userData);
        if (userData.user) {
          await supabase.from("user_roles").insert({
            user_id: userData.user.id,
            role: "patient",
          });
        }
        navigate("/login");
      }
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDoctorRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (doctorData.password !== doctorData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords don't match",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await signUp(
        doctorData.email,
        doctorData.password,
        doctorData.firstName,
        doctorData.lastName,
        "doctor"
      );

      if (!error) {
        // Add doctor role
        const { data: userData } = await supabase.auth.getUser();
        if (userData.user) {
          await supabase.from("user_roles").insert({
            user_id: userData.user.id,
            role: "doctor",
          });
        }
        navigate("/login");
      }
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">Dermit</span>
          </Link>
          <p className="text-gray-600 mt-2">
            Create your account to get started
          </p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Sign Up
            </CardTitle>
            <CardDescription className="text-gray-600">
              Join our platform as a patient or healthcare provider
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs defaultValue={defaultTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger
                  value="patient"
                  className="flex items-center space-x-2"
                >
                  <User className="w-4 h-4" />
                  <span>Patient</span>
                </TabsTrigger>
                <TabsTrigger
                  value="doctor"
                  className="flex items-center space-x-2"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Doctor</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="patient">
                <form onSubmit={handlePatientRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="patient-firstName">First Name</Label>
                      <Input
                        id="patient-firstName"
                        placeholder="Enter first name"
                        value={patientData.firstName}
                        onChange={(e) =>
                          setPatientData({
                            ...patientData,
                            firstName: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="patient-lastName">Last Name</Label>
                      <Input
                        id="patient-lastName"
                        placeholder="Enter last name"
                        value={patientData.lastName}
                        onChange={(e) =>
                          setPatientData({
                            ...patientData,
                            lastName: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patient-email">Email</Label>
                    <Input
                      id="patient-email"
                      type="email"
                      placeholder="Enter your email"
                      value={patientData.email}
                      onChange={(e) =>
                        setPatientData({
                          ...patientData,
                          email: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="patient-password">Password</Label>
                      <Input
                        id="patient-password"
                        type="password"
                        placeholder="Create password"
                        value={patientData.password}
                        onChange={(e) =>
                          setPatientData({
                            ...patientData,
                            password: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="patient-confirmPassword">
                        Confirm Password
                      </Label>
                      <Input
                        id="patient-confirmPassword"
                        type="password"
                        placeholder="Confirm password"
                        value={patientData.confirmPassword}
                        onChange={(e) =>
                          setPatientData({
                            ...patientData,
                            confirmPassword: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white py-2"
                    disabled={loading}
                  >
                    {loading ? "Creating Account..." : "Create Patient Account"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="doctor">
                <form onSubmit={handleDoctorRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="doctor-firstName">First Name</Label>
                      <Input
                        id="doctor-firstName"
                        placeholder="Enter first name"
                        value={doctorData.firstName}
                        onChange={(e) =>
                          setDoctorData({
                            ...doctorData,
                            firstName: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="doctor-lastName">Last Name</Label>
                      <Input
                        id="doctor-lastName"
                        placeholder="Enter last name"
                        value={doctorData.lastName}
                        onChange={(e) =>
                          setDoctorData({
                            ...doctorData,
                            lastName: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="doctor-email">Email</Label>
                    <Input
                      id="doctor-email"
                      type="email"
                      placeholder="Enter your email"
                      value={doctorData.email}
                      onChange={(e) =>
                        setDoctorData({ ...doctorData, email: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="doctor-password">Password</Label>
                      <Input
                        id="doctor-password"
                        type="password"
                        placeholder="Create password"
                        value={doctorData.password}
                        onChange={(e) =>
                          setDoctorData({
                            ...doctorData,
                            password: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="doctor-confirmPassword">
                        Confirm Password
                      </Label>
                      <Input
                        id="doctor-confirmPassword"
                        type="password"
                        placeholder="Confirm password"
                        value={doctorData.confirmPassword}
                        onChange={(e) =>
                          setDoctorData({
                            ...doctorData,
                            confirmPassword: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="doctor-phone">Phone</Label>
                      <Input
                        id="doctor-phone"
                        type="tel"
                        placeholder="Enter phone number"
                        value={doctorData.phone}
                        onChange={(e) =>
                          setDoctorData({
                            ...doctorData,
                            phone: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="doctor-license">License Number</Label>
                      <Input
                        id="doctor-license"
                        placeholder="Medical license number"
                        value={doctorData.licenseNumber}
                        onChange={(e) =>
                          setDoctorData({
                            ...doctorData,
                            licenseNumber: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="doctor-specialization">
                        Specialization
                      </Label>
                      <Input
                        id="doctor-specialization"
                        placeholder="e.g., Dermatology"
                        value={doctorData.specialization}
                        onChange={(e) =>
                          setDoctorData({
                            ...doctorData,
                            specialization: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="doctor-experience">
                        Years of Experience
                      </Label>
                      <Input
                        id="doctor-experience"
                        type="number"
                        placeholder="Years"
                        value={doctorData.experience}
                        onChange={(e) =>
                          setDoctorData({
                            ...doctorData,
                            experience: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="doctor-bio">Professional Bio</Label>
                    <Textarea
                      id="doctor-bio"
                      placeholder="Brief description of your background and expertise"
                      value={doctorData.bio}
                      onChange={(e) =>
                        setDoctorData({ ...doctorData, bio: e.target.value })
                      }
                      className="min-h-[100px]"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-2"
                    disabled={loading}
                  >
                    {loading ? "Creating Account..." : "Create Doctor Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
              >
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
