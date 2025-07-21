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
  ) => Promise<{ error: any }>;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: any; role?: string }>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
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
      console.log("Role assignment attempt:", { userId, role });

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

  // const signIn = async (email: string, password: string) => {
  //   const { error } = await supabase.auth.signInWithPassword({
  //     email,
  //     password,
  //   });

  //   if (error) {
  //     toast({
  //       title: "Sign In Error",
  //       description: error.message,
  //       variant: "destructive",
  //     });
  //   } else {
  //     toast({
  //       title: "Welcome back!",
  //       description: "You have successfully signed in.",
  //     });
  //   }

  //   return { error };
  // };

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

    const role = roleData.role;
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

  const signInWithGoogle = async () => {
    const redirectUrl = `${window.location.origin}/patient/dashboard`; // or add /dashboard, etc.

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
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Sign Out Error",
        description: error.message,
        variant: "destructive",
      });
    }
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
