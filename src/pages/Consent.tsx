import { useState } from "react";
import ConsentCheckboxes from "@/components/consentCheckboxes";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const Consent = () => {
  const navigate = useNavigate();
  const [consentTerms, setConsentTerms] = useState(false);
  const [consentPrivacy, setConsentPrivacy] = useState(false);
  const { user } = useAuth();

  const handleContinue = async () => {
    try {
      console.log("User consented 🎉");

      const { error } = await supabase
        .from("profiles")
        .update({
          consent_terms: consentTerms,
          consent_privacy: consentPrivacy,
          consent_timestamp: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) {
        console.error("Failed to update consent:", error.message);
        // You can show a toast or alert here
      } else {
        // Proceed to next step or route
        console.log("Consent saved successfully ✅");
        navigate("/patient/dashboard"); // optional redirection
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  return (
    <div className="max-w-lg mx-auto py-10 px-4">
      <h2 className="text-2xl font-bold mb-4">Consent Required</h2>
      <p className="text-gray-600 mb-6">
        We care about your privacy and want to make sure you understand and
        agree to our terms before continuing.
      </p>

      <ConsentCheckboxes
        consentTerms={consentTerms}
        consentPrivacy={consentPrivacy}
        setConsentTerms={setConsentTerms}
        setConsentPrivacy={setConsentPrivacy}
      />

      <div className="pt-6">
        <Button
          onClick={handleContinue}
          disabled={!consentTerms || !consentPrivacy}
          className="bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-secondary hover:to-brand-primary text-white px-8 py-3 text-lg"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default Consent;
