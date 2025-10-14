import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminHeader from "@/components/AdminHeader";
import { CheckCircle, XCircle, Clock, Mail, Phone, MapPin, Briefcase } from "lucide-react";

interface DoctorRegistration {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  city_country: string;
  experience: number;
  medical_license_url: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  reviewed_by?: string;
  reviewed_at?: string;
  rejection_reason?: string;
}

const AdminDoctorRegistrations = () => {
  const [registrations, setRegistrations] = useState<DoctorRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchRegistrations = async () => {
    try {
      const { data, error } = await supabase
        .from("doctor_registrations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRegistrations((data as any) || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load registrations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleApprove = async (registration: DoctorRegistration) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from("doctor_registrations")
        .update({
          status: "approved",
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", registration.id);

      if (error) throw error;

      toast({
        title: "Registration Approved",
        description: `${registration.full_name}'s application has been approved.`,
      });

      fetchRegistrations();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to approve registration",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (registration: DoctorRegistration) => {
    const reason = prompt("Enter rejection reason (optional):");
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from("doctor_registrations")
        .update({
          status: "rejected",
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString(),
          rejection_reason: reason || undefined,
        })
        .eq("id", registration.id);

      if (error) throw error;

      toast({
        title: "Registration Rejected",
        description: `${registration.full_name}'s application has been rejected.`,
      });

      fetchRegistrations();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to reject registration",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case "approved":
        return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-500 hover:bg-red-600"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AdminHeader />
        <div className="container mx-auto p-6">
          <p className="text-center">Loading registrations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[hsl(var(--brand-text-primary))]">
            Doctor Registrations
          </h1>
          <p className="text-[hsl(var(--brand-text-secondary))] mt-2">
            Review and manage doctor registration applications
          </p>
        </div>

        <div className="grid gap-4">
          {registrations.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No registrations found</p>
              </CardContent>
            </Card>
          ) : (
            registrations.map((reg) => (
              <Card key={reg.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl text-[hsl(var(--brand-text-primary))]">
                        {reg.full_name}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">
                        Submitted: {new Date(reg.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {getStatusBadge(reg.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-[hsl(var(--brand-text-secondary))]">
                      <Mail className="w-4 h-4" />
                      <span>{reg.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[hsl(var(--brand-text-secondary))]">
                      <Phone className="w-4 h-4" />
                      <span>{reg.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[hsl(var(--brand-text-secondary))]">
                      <MapPin className="w-4 h-4" />
                      <span>{reg.city_country}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[hsl(var(--brand-text-secondary))]">
                      <Briefcase className="w-4 h-4" />
                      <span>{reg.experience} years experience</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <p className="text-xs font-medium text-muted-foreground mb-1">
                      Medical License:
                    </p>
                    <p className="text-sm text-[hsl(var(--brand-text-primary))]">
                      {reg.medical_license_url}
                    </p>
                  </div>

                  {reg.rejection_reason && (
                    <div className="pt-2 border-t">
                      <p className="text-xs font-medium text-red-600 mb-1">
                        Rejection Reason:
                      </p>
                      <p className="text-sm">{reg.rejection_reason}</p>
                    </div>
                  )}

                  {reg.status === "pending" && (
                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={() => handleApprove(reg)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleReject(reg)}
                        variant="destructive"
                        className="flex-1"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDoctorRegistrations;
