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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Star, Mail, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "react-router-dom";
import SaveAsPDF from "./pdfViewer";

const PatientFeedback = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();

  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [allowContact, setAllowContact] = useState(false);
  const [loading, setLoading] = useState(false);
  const [contactMethod, setContactMethod] = useState<
    "telegram" | "phone" | "email" | ""
  >("");
  const [contactValue, setContactValue] = useState("");
  const [consultation, setConsultation] = useState<any>(null);
  const [formData, setFormData] = useState({
    patientName: "",
    // age: "",
    // gender: "",
    doctorName: "",
    date: "",
    observations: "",
    diagnosis: "",
    treatmentPlan: "",
    // notes: "",
  });

  useEffect(() => {
    const fetchConsultation = async () => {
      const { data, error } = await supabase
        .from("consultations")
        .select("observations, diagnosis, treatment_plan, created_at,doctor_id")
        .eq("id", id)
        .maybeSingle();
      console.log(user);

      if (error) {
        console.error("Failed to fetch consultation summary", error);
      } else {
        setConsultation(data);
        console.log(consultation.doctor_id);
        const { data: fetchDoctorData, error: fetchDoctorError } =
          await supabase
            .from("profiles")
            .select("first_name, last_name")
            .eq("id", consultation.doctor_id)
            .maybeSingle();

        const doctorName =
          fetchDoctorData.first_name + " " + fetchDoctorData.last_name;
        console.log(name);
        setFormData((prev) => ({
          ...prev,
          patientName:
            user?.user_metadata?.name ||
            user?.user_metadata.first_name +
              " " +
              user?.user_metadata?.last_name,
          doctorName:
            fetchDoctorData.first_name + " " + fetchDoctorData.last_name,
          date: consultation.date,
          observations: consultation.observations,
          diagnosis: consultation.diagnosis,
          treatmentPlan: consultation.treatment_plan,
        }));
      }
      setLoading(false);
    };

    if (id) fetchConsultation();
  }, []);

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !feedbackMessage ||
      (allowContact && (!contactMethod || !contactValue))
    ) {
      toast({
        title: "Missing info",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("patient_feedback").insert({
        user_id: user?.id ?? null,
        rating,
        consultation_id: id, // add logic if needed
        feedback_message: feedbackMessage,
        allow_contact: allowContact,
        contact_method: contactMethod || null,
        contact_value: contactValue || null,
        created_at: new Date().toISOString(),
      });

      if (error) throw error;

      toast({
        title: "Thank you for your feedback!",
        description: "We appreciate your thoughts. You're helping us grow 🌱",
      });

      navigate("/");
    } catch (error) {
      toast({
        title: "Oops!",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center px-4 py-10">
      {/* Left: Summary Card */}
      {/* <Card className="shadow-lg w-full lg:w-1/2">
          <CardHeader>
            <CardTitle className="text-lg text-center lg:text-left">
              Your Consultation Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="flex justify-center">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
            ) : (
              <>
                <div>
                  <p className="font-medium mb-1">Observations / Findings</p>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {consultation?.observations || "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="font-medium mb-1">Diagnosis / Impression</p>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {consultation?.diagnosis || "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="font-medium mb-1">Treatment Plan / Advice</p>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {consultation?.treatment_plan || "Not provided"}
                  </p>
                </div>
              </>
            )}
          </CardContent>
          
        </Card> */}

      {/* Right: Feedback Form */}
      <div className="w-full lg:w-1/2">
        <Card className="shadow-xl border-none rounded-2xl">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900">
              We Value Your Feedback
            </CardTitle>
            <CardDescription className="text-gray-600 text-sm sm:text-base">
              Tell us about your experience with{" "}
              <span className="font-semibold text-brand-primary">Dermit</span>.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFeedbackSubmit} className="space-y-6">
              {/* Rating */}
              <div>
                <Label className="block mb-2 text-gray-700 font-medium text-center">
                  Rate your experience
                </Label>
                <div className="flex justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setRating(num)}
                      className={`transition-transform hover:scale-105 ${
                        rating && rating >= num
                          ? "text-brand-primary"
                          : "text-gray-300"
                      }`}
                      aria-label={`Rate ${num} star${num > 1 ? "s" : ""}`}
                    >
                      <Star
                        className="w-7 h-7"
                        fill={rating && rating >= num ? "currentColor" : "none"}
                        color={
                          rating && rating >= num
                            ? "hsl(var(--brand-primary))"
                            : "#D1D5DB"
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Feedback */}
              <div>
                <Label
                  htmlFor="feedback-message"
                  className="block mb-2 text-gray-700 font-medium"
                >
                  Comments or suggestions
                </Label>
                <Textarea
                  id="feedback-message"
                  placeholder="How was your experience? What can we improve?"
                  rows={5}
                  value={feedbackMessage}
                  onChange={(e) => setFeedbackMessage(e.target.value)}
                  required
                />
              </div>

              {/* Allow Contact */}
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="allow-contact"
                  checked={allowContact}
                  onCheckedChange={(checked) =>
                    setAllowContact(checked as boolean)
                  }
                  className="mt-1"
                />
                <Label
                  htmlFor="allow-contact"
                  className="text-sm leading-relaxed text-gray-700 cursor-pointer"
                >
                  I’m open to being contacted for follow-up.
                </Label>
              </div>

              {/* Contact Method */}
              {allowContact && (
                <div className="grid gap-3 pl-1 sm:pl-7">
                  <Label
                    htmlFor="contact-method"
                    className="font-medium text-gray-700"
                  >
                    Preferred contact method
                  </Label>
                  <select
                    id="contact-method"
                    value={contactMethod}
                    onChange={(e) =>
                      setContactMethod(
                        e.target.value as "telegram" | "phone" | "email"
                      )
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    required
                  >
                    <option value="">Select method</option>
                    <option value="telegram">Telegram</option>
                    <option value="phone">Phone</option>
                    <option value="email">Email</option>
                  </select>

                  <Input
                    type="text"
                    value={contactValue}
                    onChange={(e) => setContactValue(e.target.value)}
                    placeholder={
                      contactMethod === "telegram"
                        ? "@yourhandle"
                        : contactMethod === "phone"
                        ? "+251911223344"
                        : "you@example.com"
                    }
                    required
                  />
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-brand-primary to-brand-secondary hover:bg-brand-primary-hover text-white font-semibold"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Feedback"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PatientFeedback;
