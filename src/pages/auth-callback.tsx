// components/ProtectedRoute.tsx
import { use, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type Status = Database["public"]["Tables"]["doctors_info"]["Row"]["status"];
type DoctorStatusRow = {
  status: Status;
};
type ConsentType = {
  consent_terms: boolean;
  consent_privacy: boolean;
};
const AuthCallback = () => {
  const { getRole, signOut, user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkEverything = async () => {
      if (!user) {
        navigate("/login");
        return;
      }

      const userId = user.id;
      const role = await getRole(userId);

      if (role === "patient") {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("consent_terms, consent_privacy")
          .eq("id", userId)
          .single<ConsentType>();

        if (error) {
          console.error("Error fetching profile:", error);
          navigate("/login");
          return;
        }

        if (!profile?.consent_terms || !profile?.consent_privacy) {
          navigate("/consent");
          return;
        }

        // If consent is good:
        navigate("/patient/dashboard");
      }

      if (role === "doctor") {
        const { data, error } = await supabase
          .from("doctors_info")
          .select("status")
          .eq("profile_id", userId)
          .maybeSingle<DoctorStatusRow>();

        if (error) {
          console.error("Error fetching doctor status:", error);
          return;
        }

        if (data?.status === "active") {
          navigate("/doctor/dashboard");
        } else {
          await signOut();
          navigate("/account-issue");
        }
      }

      if (role === "admin") {
        navigate("/admin/dashboard");
      }

      if (!role) {
        console.warn("No role found, defaulting to patient dashboard.");
        navigate("/patient/dashboard");
      }
    };

    checkEverything();
  }, [user, getRole, navigate, signOut]);

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center shadow-xl border-0">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          </CardContent>
        </Card>
      </div>
    );

  // return <>{children}</>;
};

export default AuthCallback;
