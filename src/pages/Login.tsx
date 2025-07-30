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
import { Stethoscope } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, user, signInWithGoogle, getRole } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if already logged in
  useEffect(() => {
    const fetchRoleAndNavigate = async () => {
      if (user) {
        const role = await getRole(user.id);
        const realRole = role?.role;
        if (realRole === "patient") navigate("/patient/dashboard");
        else if (realRole === "doctor") navigate("/doctor/dashboard");
        else if (realRole === "admin") navigate("/admin/dashboard");
      }
    };

    fetchRoleAndNavigate();
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error, role } = await signIn(email, password);
      if (!error && role) {
        if (role === "patient") {
          navigate("/patient/dashboard");
        } else if (role === "doctor") {
          navigate("/doctor/dashboard");
        } else if (role === "admin") {
          navigate("/admin/overview");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
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
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-32 h-13 rounded-lg flex items-center justify-center">
              <img
                src="/DermitLong.png"
                alt="Dermit Logo"
                // className="w-5 h-5"
              />
              {/* <Stethoscope className="w-5 h-5 text-white" /> */}
            </div>
          </Link>
          <p className="text-gray-600 mt-2">
            Welcome back! Please sign in to your account
          </p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Sign In
            </CardTitle>
            <CardDescription className="text-gray-600">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-secondary hover:to-brand-primary text-white py-2"
                disabled={loading}
              >
                {loading ? "Signing In..." : "Sign In"}
              </Button>
              <Button
                variant="outline"
                className="w-full mb-4 flex items-center justify-center space-x-2"
                onClick={handleGoogleSignIn}
                disabled={loading}
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                  alt="Google logo, a red 'G' with a blue, yellow, and green tail"
                  className="w-5 h-5"
                />
                <span>
                  {loading ? "Redirecting..." : "Sign in with Google"}
                </span>
              </Button>
            </form>

            <div className="text-center text-sm text-gray-600 mt-6">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
              >
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
