// components/ProtectedRoute.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, Loader2, Stethoscope } from "lucide-react";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkConsent = async () => {
      console.log("Checking user consent...");
      console.log("User state:", user);
      //   if (!user) {
      //     navigate("/login");
      //     return;
      //   }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("consent_terms, consent_privacy")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error.message);
        navigate("/login");
        return;
      }

      if (!profile?.consent_terms || !profile?.consent_privacy) {
        navigate("/consent");
        return;
      }

      setLoading(false);
    };

    checkConsent();
  }, [user, navigate]);

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

  return <>{children}</>;
};

export default ProtectedRoute;
