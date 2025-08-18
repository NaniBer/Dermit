import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  X,
  Camera,
  FileText,
  User,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Stethoscope,
  Loader2,
  Hourglass,
  Check,
  CircleX,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import WaitingForDoctor from "@/components/WaitingForDoctor";
import { v4 as uuidv4 } from "uuid";
import { Database } from "@/integrations/supabase/types";
type ConsultationInsert =
  Database["public"]["Tables"]["consultations"]["Insert"];

const NewConsultation = () => {
  const [imageStatuses, setImageStatuses] = useState<
    { file: File; status: "pending" | "uploading" | "done" | "error" }[]
  >([]);

  const [submitting, setSubmitting] = useState(false);
  const { user, session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    chiefComplaint: "",
    knownIllnesses: "",
    additionalComments: "",
    doctorCode: "",
  });

  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      for (const file of Array.from(files)) {
        setUploadedImages((prev) => [...prev, file]);
      }
    }
  };

  const uploadToDrive = async (image, consultationId): Promise<boolean> => {
    const token = session?.access_token;
    const myUuid = uuidv4();
    const formData = new FormData();

    formData.append("file", image);
    formData.append("filename", myUuid);
    formData.append("consultation_id", consultationId);
    formData.append("image_type", "consultationImage");
    const URL = `${backendUrl}/upload-image`;

    const res = await fetch(URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData, // NO content-type header! The browser adds it automatically with boundary
    });

    if (!res.ok) throw new Error("Upload failed");
    if (res.status === 200) {
      return true;
    } else {
      return false;
    }
  };
  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadWithStatus = async (
    image: File,
    index: number,
    consultationId: string
  ) => {
    try {
      setImageStatuses((prev) =>
        prev.map((item, i) =>
          i === index ? { ...item, status: "uploading" } : item
        )
      );

      const success = await uploadToDrive(image, consultationId);

      setImageStatuses((prev) =>
        prev.map((item, i) =>
          i === index ? { ...item, status: success ? "done" : "error" } : item
        )
      );

      return success;
    } catch {
      setImageStatuses((prev) =>
        prev.map((item, i) =>
          i === index ? { ...item, status: "error" } : item
        )
      );
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit a consultation request.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (!formData.chiefComplaint.trim()) {
      toast({
        title: "Missing Information",
        description: "Please describe your chief complaint.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const status = uploadedImages.length > 0 ? "awaiting_assets" : "pending";
    const newConsultation: ConsultationInsert = {
      patient_id: user.id,
      title: formData.chiefComplaint.substring(0, 100), // Use first 100 chars as title
      description: `Main Concern: ${formData.chiefComplaint}\n\nMedical History: ${formData.knownIllnesses}\n\nAdditional Comments: ${formData.additionalComments}`,
      status: status,
      priority: "normal",
      images: [],
    };

    try {
      const { data, error } = await supabase
        .from("consultations")
        .insert(newConsultation)
        .select()
        .single<ConsultationInsert>();
      if (error) throw error;

      setImageStatuses(
        uploadedImages.map((file) => ({ file, status: "pending" }))
      );
      for (let i = 0; i < uploadedImages.length; i++) {
        await uploadWithStatus(uploadedImages[i], i, data.id);
      }
      console.log(data.id);
      const { data: updateData, error: updateError } = await supabase
        .from("consultations")
        .update({ status: "pending" })
        .eq("id", data.id)
        .select();
      console.log(updateData);
      console.log("Consultation data:", data);

      if (error) throw error;

      toast({
        title: "Consultation Submitted!",
        description:
          "Your consultation request has been submitted successfully.",
      });

      setCurrentStep(3); // Show success step
    } catch (error) {
      console.error("Error submitting consultation:", error);
      toast({
        title: "Submission Failed",
        description: "Failed to submit consultation request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep == 2 && !formData.chiefComplaint.trim()) {
      toast({
        title: "Missing Information",
        description: "Please Tell us what's going on with your skin.",
        variant: "destructive",
      });
      return;
    }

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" }); // <-- Add this line
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" }); // <-- Add this line
    }
  };

  if (currentStep === 3) {
    return <WaitingForDoctor />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              to="/patient/dashboard"
              className="flex items-center space-x-2"
            >
              <div className="w-32 h-13 rounded-lg flex items-center justify-center">
                <img
                  src="/DermitLong.png"
                  alt="Dermit Logo"
                  // className="w-5 h-5"
                />
                {/* <Stethoscope className="w-5 h-5 text-white" /> */}
              </div>
            </Link>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Step {currentStep} of 3
              </span>
              <div className="flex space-x-2">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`w-2 h-2 rounded-full ${
                      step <= currentStep ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            New Consultation Request
          </h1>
          <p className="text-gray-600">
            Share your skin concern with our certified dermatologists for
            professional advice
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Step 1: Image Upload */}
              {currentStep === 1 && (
                <Card className="shadow-xl border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Camera className="w-5 h-5 text-brand-text-secondary" />
                      <span>Upload Images (Optional)</span>
                    </CardTitle>
                    <CardDescription>
                      Upload clear photos of your skin concern for better
                      diagnosis
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                      <input
                        type="file"
                        id="image-upload"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">
                          Upload Photos
                        </h3>
                        <p className="text-gray-500">
                          Click to browse or drag and drop your images here
                        </p>
                        <p className="text-sm text-gray-400 mt-2">
                          Supports: JPG, PNG, WebP (Max 5MB each)
                        </p>
                      </label>
                    </div>

                    {uploadedImages.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {uploadedImages.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={URL.createObjectURL(image)}
                              alt={`Upload ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-brand-text-secondary mb-2">
                        Photography Tips:
                      </h4>
                      <ul className="text-sm text-brand-text-secondary space-y-1">
                        <li>• Use good lighting - natural light works best</li>
                        <li>• Take multiple angles if possible</li>
                        <li>• Keep the camera steady and in focus</li>
                        <li>
                          • Include surrounding healthy skin for comparison
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Medical Information */}
              {currentStep === 2 && (
                <Card className="shadow-xl border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="w-5 h-5 text-green-600" />
                      <span>Medical Information</span>
                    </CardTitle>
                    <CardDescription>
                      Provide details about your skin concern and medical
                      history
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="chief-complaint"
                        className="text-base font-semibold"
                      >
                        Tell us what's going on with your skin? *
                      </Label>
                      <Textarea
                        id="chief-complaint"
                        placeholder="Describe your main skin concern (e.g., 'Red, itchy rash on my arms for 2 weeks')"
                        value={formData.chiefComplaint}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            chiefComplaint: e.target.value,
                          })
                        }
                        className="min-h-[100px]"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="known-illnesses"
                        className="text-base font-semibold"
                      >
                        Known Medical Conditions
                      </Label>
                      <Textarea
                        id="known-illnesses"
                        placeholder="List any medical conditions, allergies, or medications you're currently taking"
                        value={formData.knownIllnesses}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            knownIllnesses: e.target.value,
                          })
                        }
                        className="min-h-[80px]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="additional-comments"
                        className="text-base font-semibold"
                      >
                        Additional Comments
                      </Label>
                      <Textarea
                        id="additional-comments"
                        placeholder="Any additional information that might be relevant to your case"
                        value={formData.additionalComments}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            additionalComments: e.target.value,
                          })
                        }
                        className="min-h-[80px]"
                      />
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start space-x-2">
                        <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-yellow-800">
                            Important Note
                          </h4>
                          <p className="text-sm text-yellow-700">
                            This platform is for non-emergency consultations
                            only. If you have a medical emergency, please
                            contact emergency services immediately.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Progress Summary */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Consultation Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Images uploaded
                    </span>
                    <Badge
                      variant={
                        uploadedImages.length > 0 ? "default" : "secondary"
                      }
                    >
                      {uploadedImages.length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Chief complaint
                    </span>
                    <Badge
                      variant={
                        formData.chiefComplaint ? "default" : "secondary"
                      }
                    >
                      {formData.chiefComplaint ? "✓" : "○"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Medical history
                    </span>
                    <Badge
                      variant={
                        formData.knownIllnesses ? "default" : "secondary"
                      }
                    >
                      {formData.knownIllnesses ? "✓" : "○"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Expected Timeline */}
              <Card className="shadow-lg bg-gradient-to-r from-blue-50 to-green-50">
                <CardHeader>
                  <CardTitle className="text-brand-text-secondary">
                    What to expect
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center space-x-2">
                      {/* <CheckCircle className="w-4 h-4 text-brand-primary" />A */}
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 border-2 border-gray-300 rounded-full"></div>
                        <span className="text-gray-600">
                          A doctor will be assigned to you in under 10 minutes
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 border-2 border-gray-300 rounded-full"></div>
                      <span className="text-gray-600">
                        You will enter a private chat room with your doctor
                        where you can further describe your issue and send more
                        pictures if necessary
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 border-2 border-gray-300 rounded-full"></div>
                      <span className="text-gray-600">
                        Your doctor will then give you a treatment plan suited
                        to your needs or will guide you through your next steps
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <div>
              {currentStep > 1 && (
                <Button type="button" variant="outline" onClick={prevStep}>
                  Previous
                </Button>
              )}
            </div>
            <div className="flex items-center space-x-4">
              {currentStep < 2 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-secondary hover:to-brand-primary"
                >
                  Next Step
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-brand-secondary to-brand-primary hover:from-brand-secondary hover:to-brand-primary"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit Consultation Request"}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
      <div className="space-y-2 p-4 border rounded-lg bg-gray-50">
        {submitting && (
          <div className="font-semibold mb-2">
            Submitting your consultation… ⏳
          </div>
        )}
      </div>
    </div>
  );
};

export default NewConsultation;
