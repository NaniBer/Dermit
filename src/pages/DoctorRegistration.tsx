import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

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
  const { toast } = useToast();

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
      // TODO: Replace with real API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Registration Submitted",
        description:
          "Thank you! We will review your registration and get back to you soon.",
      });

      setFormData({
        fullName: "",
        phone: "",
        email: "",
        cityCountry: "",
        experience: "",
        medicalLicense: null,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Dermatologist Registration Form
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Welcome to Dermit! We're excited to have you join our network of
              dermatology professionals. Please complete the form below to begin
              the vetting process.
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
                <Label htmlFor="medicalLicense">
                  Upload Your Most Recent Renewed Medical License *
                </Label>
                <Input
                  id="medicalLicense"
                  name="medicalLicense"
                  type="file"
                  accept=".pdf,.jpg,.png"
                  onChange={handleChange}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Registration"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DoctorRegistration;
