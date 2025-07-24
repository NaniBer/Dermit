// components/ProtectedRoute.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, Loader2, Stethoscope } from "lucide-react";

const AuthCallback = () => {
  const { getRole } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const checkUserAndRedirect = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const role = await getRole(user.id); // Your own API/db call
        const realRole = role?.role;
        console.log(realRole);

        if (realRole === "patient") navigate("/patient/dashboard");
        else if (realRole === "doctor") navigate("/doctor/dashboard");
        else if (realRole === "admin") navigate("/admin/dashboard");
        if (role === null) {
          navigate("/patient/dashboard");
        }
        setLoading(false);
      }
    };

    checkUserAndRedirect();
  }, []);

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

export default AuthCallback;
