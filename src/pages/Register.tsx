import { useEffect, useState } from "react";
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
import { Stethoscope, User, UserCheck, Shield, Globe } from "lucide-react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ConsentCheckboxes from "@/components/consentCheckboxes";

const Register = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const defaultTab = searchParams.get("type") || "patient";
  const { signUp, user, signInWithGoogle, getRole } = useAuth();

  const { toast } = useToast();

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
    // consentAiTraining: boolean;
    // consentDataStorage: boolean;
    constentTerms: boolean;
    consentPrivacy: boolean;
  }>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    dateOfBirth: "",
    role: "patient",
    // consentAiTraining: false,
    // consentDataStorage: false,
    constentTerms: false,
    consentPrivacy: false,
  });

  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  // useEffect(() => {
  //   const fetchRoleAndNavigate = async () => {
  //     if (user) {
  //       const role = await getRole(user.id);
  //       const realRole = role?.role;
  //       if (realRole === "patient") navigate("/patient/dashboard");
  //       else if (realRole === "doctor") navigate("/doctor/dashboard");
  //       else if (realRole === "admin") navigate("/admin/dashboard");
  //     }
  //   };

  //   fetchRoleAndNavigate();
  // }, [user, navigate]);

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

    // Validate consent checkboxes
    if (!patientData.constentTerms || !patientData.constentTerms) {
      toast({
        title: "Consent Required",
        description: "You must agree to all consent terms to create an account",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({
          email: patientData.email,
          password: patientData.password,
        });

      if (signUpError) throw signUpError;

      // signUpData.user will exist here
      if (!signUpData.user?.email_confirmed_at) {
        // Email NOT confirmed yet, so NO auto sign-in
        toast({
          title: "Please Confirm Your Email",
          description:
            "Check your inbox for a confirmation email before signing in.",
          variant: "destructive",
        });
        setLoading(false);
        return; // exit the function so no auto sign-in happens
      }

      // If email is confirmed (unlikely at sign-up), auto sign-in:
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: patientData.email,
        password: patientData.password,
      });
      if (signInError) throw signInError;

      // Add roles and consent after sign-in
      const {
        data: { user: signedInUser },
      } = await supabase.auth.getUser();

      if (signedInUser) {
        await supabase.from("user_roles").insert({
          user_id: signedInUser.id,
          role: "patient",
        });

        await supabase
          .from("profiles")
          .update({
            // consent_ai_training: patientData.consentAiTraining,
            // consent_data_storage: patientData.consentDataStorage,
            consent_terms: patientData.constentTerms,
            consent_privacy: patientData.consentPrivacy,
            consent_timestamp: new Date().toISOString(),
          })
          .eq("id", signedInUser.id);
      }

      toast({
        title: "Welcome aboard!",
        description: "You have successfully signed up and logged in.",
      });
      navigate("/patient/dashboard");
    } catch (error) {
      toast({
        title: "Oops!",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      console.log("Google sign-in successful", signInWithGoogle);
    } catch (error) {
      toast({
        title: "Google Sign-In Error",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setLoading(false); // don't forget to turn off the spinner
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="flex items-center justify-center space-x-2 w-full  "
          >
            <div className="w-32 h-13 rounded-lg flex items-center justify-center">
              <img
                src="/DermitLong.png"
                alt="Dermit Logo"
                // className="w-5 h-5"
              />
              {/* <Stethoscope className="w-5 h-5 text-white" /> */}
            </div>
            {/* <span className="text-xl font-bold text-gray-900">Dermit</span> */}
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
              <TabsList className="grid w-full grid-cols-1 mb-6">
                <TabsTrigger
                  value="patient"
                  className="flex items-center space-x-2"
                >
                  <User className="w-4 h-4" />
                  <span>Patient</span>
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

                  {/* Consent Agreement Section */}
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 space-y-4">
                    {/* <div className="flex items-center space-x-2 mb-4">
                      <Shield className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-gray-900">
                        Your Privacy & Consent Matter to Us
                      </h3>
                    </div> */}
                    {/* 
                    <div className="space-y-4 text-sm text-gray-700">
                      <div className="space-y-3">
                        <p className="font-medium text-gray-900">
                          Helping You While Improving Care for Everyone
                        </p>
                        <p>
                          When you share images of your skin condition with us,
                          you're not just getting personalized care—you're also
                          helping us build better AI tools that can serve people
                          in your region more accurately.
                        </p>
                        <p>
                          Your images may be used to train our AI models, which
                          helps us provide more precise and culturally-relevant
                          healthcare insights for your local community. This is
                          an essential part of how our service works.
                        </p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-start space-x-2">
                          <Globe className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-900 mb-1">
                              Where Your Data Lives
                            </p>
                            <p>
                              We want to be completely transparent: your data is
                              stored on secure servers that may be located
                              outside your country's borders. However, we take
                              your privacy seriously—all your information is
                              encrypted and anonymized, meaning no personal
                              details can be directly traced back to your
                              images.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div> */}

                    {/* Consent Checkboxes */}
                    {/* <div className="space-y-3 pt-4 border-t border-gray-200">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="patient-consent-ai"
                          checked={patientData.consentAiTraining}
                          onCheckedChange={(checked) =>
                            setPatientData({
                              ...patientData,
                              consentAiTraining: checked as boolean,
                            })
                          }
                          className="mt-1"
                        />
                        <Label
                          htmlFor="patient-consent-ai"
                          className="text-sm text-gray-700 leading-relaxed cursor-pointer"
                        >
                          I understand and consent to my uploaded images being
                          used to train AI models for improving healthcare
                          services. I acknowledge that this is required to use
                          the platform.
                        </Label>
                      </div>

                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="patient-consent-storage"
                          checked={patientData.consentDataStorage}
                          onCheckedChange={(checked) =>
                            setPatientData({
                              ...patientData,
                              consentDataStorage: checked as boolean,
                            })
                          }
                          className="mt-1"
                        />
                        <Label
                          htmlFor="patient-consent-storage"
                          className="text-sm text-gray-700 leading-relaxed cursor-pointer"
                        >
                          I understand that my data may be stored on servers
                          outside my country, and I consent to this arrangement
                          knowing that my data has been anonymized and
                          encrypted.
                        </Label>
                      </div>

                      <div className="pt-3 border-t border-gray-200">
                        <p className="text-sm font-medium text-gray-900">
                          By signing up, I confirm I have read and agree to
                          these terms.
                        </p>
                      </div>
                    </div> */}
                    <ConsentCheckboxes
                      consentPrivacy={patientData.consentPrivacy}
                      consentTerms={patientData.constentTerms}
                      setConsentPrivacy={(checked) =>
                        setPatientData((prev) => ({
                          ...prev,
                          consentPrivacy: checked,
                        }))
                      }
                      setConsentTerms={(checked) =>
                        setPatientData((prev) => ({
                          ...prev,
                          constentTerms: checked,
                        }))
                      }
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-secondary hover:to-brand-primary text-white py-2"
                    disabled={
                      loading ||
                      !patientData.consentPrivacy ||
                      !patientData.constentTerms
                    }
                  >
                    {loading ? "Creating Account..." : "Create Patient Account"}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full mb-4 flex items-center justify-center space-x-2"
                    onClick={handleGoogleSignIn}
                    disabled={
                      loading ||
                      !patientData.consentPrivacy ||
                      !patientData.constentTerms
                    }
                  >
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                      alt="Google logo, a red 'G' with a blue, yellow, and green tail"
                      className="w-5 h-5"
                    />
                    <span>
                      {loading ? "Redirecting..." : "Sign up with Google"}
                    </span>
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
