// components/ProtectedRoute.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Database } from "@/integrations/supabase/types";

type Props = {
  children: React.ReactNode;
  allowedRoles?: string[]; // optional, if you want to restrict to certain roles
};
type Status = Database["public"]["Tables"]["doctors_info"]["Row"]["status"];
type DoctorStatusRow = {
  status: Status;
};
type ConsentType = {
  consent_terms: boolean;
  consent_privacy: boolean;
};

const ProtectedRoute = ({ children, allowedRoles }: Props) => {
  const { user, getRole, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAccess = async () => {
      const userId = user?.id;
      const role = await getRole(userId);

      if (allowedRoles && !allowedRoles.includes(role)) {
        navigate("/access-denied");
        return;
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
      if (role === "patient") {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("consent_terms, consent_privacy")
          .eq("id", userId)
          .single<ConsentType>();

        if (!profile?.consent_terms || !profile?.consent_privacy) {
          navigate("/consent");
          return;
        }

        // If consent is good:
        navigate("/patient/dashboard");
      }

      setLoading(false);
    };

    checkAccess();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md text-center shadow-xl border-0">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
