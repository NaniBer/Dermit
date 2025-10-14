import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Upload, CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const DoctorRegistration = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    cityCountry: "",
    experience: "",
    medicalLicense: null as File | null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "medicalLicense" && files) {
      setFormData((prev) => ({ ...prev, medicalLicense: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate all fields
      if (!formData.fullName || !formData.phone || !formData.email || 
          !formData.cityCountry || !formData.experience || !formData.medicalLicense) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // For now, we'll store the file name in the database
      // In production, you would upload to Supabase Storage first
      const licenseFileName = formData.medicalLicense.name;

      // Insert registration into database
      const { error } = await supabase
        .from("doctor_registrations")
        .insert({
          full_name: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          city_country: formData.cityCountry,
          experience: parseInt(formData.experience),
          medical_license_url: licenseFileName, // Will be replaced with actual URL when storage is implemented
          status: "pending"
        });

      if (error) throw error;

      // Show success state
      setIsSuccess(true);
      
      toast({
        title: "Registration Submitted Successfully!",
        description: "Our admin team will review your application and contact you soon.",
      });

      // Reset form
      setFormData({
        fullName: "",
        phone: "",
        email: "",
        cityCountry: "",
        experience: "",
        medicalLicense: null,
      });

      // Redirect to home after 3 seconds
      setTimeout(() => {
        navigate("/");
      }, 3000);

    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success screen
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--brand-neutral-bg))] via-background to-[hsl(var(--brand-neutral-bg))] p-4 flex items-center justify-center">
        <Card className="max-w-md w-full shadow-2xl border-[hsl(var(--brand-primary))]">
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-[hsl(var(--brand-primary))] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-[hsl(var(--brand-text-primary))]">
              Registration Submitted!
            </h2>
            <p className="text-[hsl(var(--brand-text-secondary))]">
              Thank you for your interest in joining Dermit. Our admin team will review your application and contact you via email within 2-3 business days.
            </p>
            <Button 
              onClick={() => navigate("/")}
              className="w-full bg-[hsl(var(--brand-primary))] hover:bg-[hsl(var(--brand-primary-hover))] text-white"
            >
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--brand-neutral-bg))] via-background to-[hsl(var(--brand-neutral-bg))] p-4">
      <div className="max-w-2xl mx-auto pt-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[hsl(var(--brand-secondary))] hover:text-[hsl(var(--brand-primary))] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <Card className="shadow-2xl border-[hsl(var(--brand-primary))] border-t-4">
          <CardHeader className="text-center bg-gradient-to-r from-[hsl(var(--brand-neutral-bg))] to-background">
            <CardTitle className="text-3xl font-bold text-[hsl(var(--brand-text-primary))]">
              Dermatologist Registration
            </CardTitle>
            <p className="text-[hsl(var(--brand-text-secondary))] mt-2 text-sm">
              Welcome to Dermit! Join our network of dermatology professionals. Complete the form below to begin the vetting process.
            </p>
          </CardHeader>

          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="As it appears on your medical license"
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+251 9XXXXXXXX"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="cityCountry">
                  City & Country of Residence *
                </Label>
                <Input
                  id="cityCountry"
                  name="cityCountry"
                  value={formData.cityCountry}
                  onChange={handleChange}
                  placeholder="Eg: Addis Ababa, Ethiopia"
                  required
                />
              </div>

              <div>
                <Label htmlFor="experience">
                  Years of Experience in Dermatology *
                </Label>
                <Input
                  id="experience"
                  name="experience"
                  type="number"
                  min={0}
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="Eg: 5"
                  required
                />
              </div>

              <div>
                <Label htmlFor="medicalLicense" className="text-[hsl(var(--brand-text-primary))]">
                  Upload Your Most Recent Renewed Medical License *
                </Label>
                <div className="mt-2 flex items-center gap-2">
                  <Input
                    id="medicalLicense"
                    name="medicalLicense"
                    type="file"
                    accept=".pdf,.jpg,.png,.jpeg"
                    onChange={handleChange}
                    required
                    className="cursor-pointer file:mr-4 file:px-4 file:py-2 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[hsl(var(--brand-primary))] file:text-white hover:file:bg-[hsl(var(--brand-primary-hover))]"
                  />
                  {formData.medicalLicense && (
                    <Upload className="w-5 h-5 text-[hsl(var(--brand-primary))]" />
                  )}
                </div>
                {formData.medicalLicense && (
                  <p className="text-xs text-[hsl(var(--brand-text-secondary))] mt-1">
                    Selected: {formData.medicalLicense.name}
                  </p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full bg-[hsl(var(--brand-primary))] hover:bg-[hsl(var(--brand-primary-hover))] text-white font-semibold py-6 text-lg transition-all duration-200" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Registration"}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                By submitting this form, you agree to our verification process. We will contact you within 2-3 business days.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DoctorRegistration;
