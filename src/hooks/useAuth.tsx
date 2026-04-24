import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  role: string | null;
  session: Session | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role: "doctor" | "patient"
  ) => Promise<{ error }>;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: any; role?: string }>;
  signOut: () => Promise<void>;
  signInWithGoogle: (redirectUrl: string) => Promise<void>;
  getRole: (userId) => Promise<string>;
  changePassword: (newPassword: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
interface RoleType {
  role: string;
}
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      if (event === "SIGNED_IN" && session?.user) {
        const user = session.user;

        const handleFirstSignIn = async () => {
          try {
            const accessToken = session?.access_token;

            const SUPABASE_URL = "https://cfnqqiiwsgljxxzlvicz.supabase.co";
            const response = await fetch(
              `${SUPABASE_URL}/functions/v1/google-oauth-signup-handler`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                  type: "SIGNUP",
                  provider: "google",
                  user: user,
                  identities: user.identities,
                }),
              }
            );

            const result = await response.json();
            // Fetch and set role
            const role = await getRole(user.id);
            setRole(role);
          } catch (err) {
            console.error("❌ Failed to call Edge Function:", err);
          }
        };

        handleFirstSignIn(); // call the async inner function
      }
    });

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role: "doctor" | "patient"
  ) => {
    const redirectUrl = `${window.location.origin}/`;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });

    if (error) {
      toast({
        title: "Sign Up Error",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }

    // 💾 Insert role into user_roles table if user was created
    const userId = data?.user?.id;

    if (userId) {
      const { error: roleError } = await supabase.from("user_roles").insert({
        user_id: userId,
        role: role,
      });

      if (roleError) {
        toast({
          title: "Role Assignment Failed",
          description: roleError.message,
          variant: "destructive",
        });
        return { error: roleError };
      }
    }

    toast({
      title: "Success!",
      description: "Please check your email to confirm your account.",
    });

    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError) {
      toast({
        title: "Sign In Error",
        description: authError.message,
        variant: "destructive",
      });
      return { error: authError };
    }

    const userId = authData?.user?.id;
    if (!userId) {
      toast({
        title: "Oops!",
        description: "Could not find user after login.",
        variant: "destructive",
      });
      return { error: new Error("User ID not found") };
    }

    const { data: roleData, error: roleError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .maybeSingle();

    if (roleError || !roleData) {
      toast({
        title: "Role Fetch Error",
        description: roleError?.message || "No role found for this user.",
        variant: "destructive",
      });
      return { error: roleError || new Error("Role not found") };
    }

    const role = roleData;
    const name = authData.user?.user_metadata?.first_name || "User";

    // 💾 Update context state manually!
    setUser(authData.user);
    setSession(authData.session); // optional: can also do supabase.auth.getSession()
    setRole(role);

    toast({
      title: `Welcome back, ${name}!`,
      description: `You are signed in as a ${role}.`,
    });

    return { error: null, role };
  };

  const signInWithGoogle = async (redirect: string) => {
    // Use the provided redirect or default to auth-callback
    const redirectPath = redirect.startsWith('/') ? redirect : `/${redirect}`;
    const redirectUrl = `${window.location.origin}${redirectPath}`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectUrl,
      },
    });

    if (error) {
      toast({
        title: "Google Sign-In Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const signOut = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    console.log(session);

    if (!session) {
      toast({
        title: "Already signed out",
        description: "No active session found.",
      });
      return;
    }

    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Sign Out Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getRole = async (userId) => {
    const { data: roleData, error: roleError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .maybeSingle<RoleType>();
    if (roleData === null) {
      const { error: insertError } = await supabase
        .from("user_roles")
        .insert({ user_id: userId, role: "patient" });

      if (insertError) {
        console.error("Error inserting default role:", insertError);
      }
    }

    const role = roleData.role ?? "patient";

    return role;
  };

  const changePassword = async (newPassword: string) => {
    if (!user) {
      toast({
        title: "Not signed in",
        description: "You must be signed in to change your password.",
        variant: "destructive",
      });
      return { error: new Error("User not signed in") };
    }

    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      toast({
        title: "Password Change Failed",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }

    toast({
      title: "Password Changed",
      description: "Your password has been updated successfully.",
    });

    return { error: null };
  };

  const value = {
    user,
    role,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    signInWithGoogle,
    getRole,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
