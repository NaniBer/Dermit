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
export interface ProfileData {
  first_name: string | null;
  last_name: string | null;
}
const PatientFeedback = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();

  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [allowContact, setAllowContact] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pictureLoading, setPictureLoading] = useState(false);
  const [pictureDeleted, setPictureDeleted] = useState(false);
  const [contactMethod, setContactMethod] = useState<
    "telegram" | "phone" | "email" | ""
  >("");
  const [contactValue, setContactValue] = useState("");
  const [consultation, setConsultation] = useState(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
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
        console.log(data);
        console.log(consultation.doctor_id);
        const { data: fetchDoctorData, error: fetchDoctorError } =
          await supabase
            .from("profiles")
            .select("first_name, last_name")
            .eq("id", consultation.doctor_id)
            .maybeSingle<ProfileData>();

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

  const deletePicture = async () => {
    setPictureLoading(true);

    try {
      const res = await fetch(`${backendUrl}/delete-image`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          consultation_id: id,
        }),
      });

      const data = await res.json();

      console.log("🧨 Picture(s) deleted:", data);

      if (!res.ok) {
        throw new Error(
          data.error || "Something went wrong while deleting the picture."
        );
      }

      // Maybe show a toast or update UI if successful
      // toast.success("Image(s) deleted successfully!");
    } catch (error) {
      console.error("❌ Error deleting picture:", error);
      // toast.error("Failed to delete image.");
    } finally {
      setPictureLoading(false); // Always stop the loading spinner
      setPictureDeleted(true); // Set the state to indicate picture deletion
    }
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      rating === null || // 👈 No stars, no service
      (allowContact && (!contactMethod || !contactValue))
    ) {
      toast({
        title: "Missing info",
        description:
          "Please give a rating and fill in any required contact info.",
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
      {/* Right: Feedback Form */}
      <div className="w-full lg:w-1/2">
        <Card className="flex flex-col justify-between p-6">
          {pictureDeleted ? (
            <div className="text-center">
              <h2 className="text-lg font-semibold">Picture Deleted</h2>
              <p className="text-gray-600 mt-2">
                Your picture has been deleted from our database.
              </p>
            </div>
          ) : (
            <>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  We Value Your Privacy
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Should we delete your picture from our database?
                  <span className="text-sm text-gray-500 block mt-1">
                    If you haven’t uploaded a picture, feel free to ignore this
                    message.
                  </span>
                </CardDescription>
              </CardHeader>

              <div className="flex justify-center">
                <Button
                  variant="destructive"
                  className="mt-4 px-6 py-2"
                  disabled={pictureLoading}
                  onClick={() => {
                    deletePicture();
                  }}
                >
                  {pictureLoading ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </>
          )}
        </Card>

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
                <Label className="block mb-2  text-gray-700 font-medium text-center">
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
