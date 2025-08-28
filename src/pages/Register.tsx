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
import { useTranslation } from "react-i18next";

const Register = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const defaultTab = searchParams.get("type") || "patient";
  const { signUp, user, signInWithGoogle, getRole } = useAuth();

  const { toast } = useToast();
  const { t } = useTranslation();

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
    console.log("Registering patient with data:", patientData);

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
      // 💥 Use your existing signUp function here
      const { error: signUpError } = await signUp(
        patientData.email,
        patientData.password,
        patientData.firstName,
        patientData.lastName,
        "patient"
      );

      if (signUpError) throw signUpError;

      // Get user after sign up
      const {
        data: { user: signedInUser },
      } = await supabase.auth.getUser();

      if (signedInUser) {
        // 💾 Save consent data into profiles table
        await supabase
          .from("profiles")
          .update({
            consent_terms: patientData.constentTerms,
            consent_privacy: patientData.consentPrivacy,
            consent_timestamp: new Date().toISOString(),
          })
          .eq("id", signedInUser.id);
      }

      toast({
        title: "Welcome aboard!",
        description: "Please confirm your email before logging in.",
      });

      navigate("/"); // or wherever you want them to go
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
            className="flex items-center justify-center space-x-2 w-full"
          >
            <div className="w-32 h-13 rounded-lg flex items-center justify-center">
              <img src="/DermitLong.png" alt={t("dermitLogoAlt")} />
            </div>
          </Link>
          <p className="text-gray-600 mt-2">{t("createAccountMessage")}</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-gray-900">
              {t("signUp")}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {t("signUpDescription")}
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
                  <span>{t("patient")}</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="patient">
                <form onSubmit={handlePatientRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="patient-firstName">
                        {t("firstName")}
                      </Label>
                      <Input
                        id="patient-firstName"
                        placeholder={t("firstNamePlaceholder")}
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
                      <Label htmlFor="patient-lastName">{t("lastName")}</Label>
                      <Input
                        id="patient-lastName"
                        placeholder={t("lastNamePlaceholder")}
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
                    <Label htmlFor="patient-email">{t("email")}</Label>
                    <Input
                      id="patient-email"
                      type="email"
                      placeholder={t("emailPlaceholder")}
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
                      <Label htmlFor="patient-password">{t("password")}</Label>
                      <Input
                        id="patient-password"
                        type="password"
                        placeholder={t("passwordPlaceholder")}
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
                        {t("confirmPassword")}
                      </Label>
                      <Input
                        id="patient-confirmPassword"
                        type="password"
                        placeholder={t("confirmPasswordPlaceholder")}
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

                  {/* Consent Section */}
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

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-secondary hover:to-brand-primary text-white py-2"
                    disabled={
                      loading ||
                      !patientData.consentPrivacy ||
                      !patientData.constentTerms
                    }
                  >
                    {loading ? t("creatingAccount") : t("createPatientAccount")}
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
                      src="/google-logo.svg"
                      alt={t("googleLogoAlt")}
                      className="w-5 h-5"
                    />
                    <span>
                      {loading ? t("redirecting") : t("signUpWithGoogle")}
                    </span>
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="text-center text-sm text-gray-600">
              {t("alreadyHaveAccount")}{" "}
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
              >
                {t("signIn")}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
