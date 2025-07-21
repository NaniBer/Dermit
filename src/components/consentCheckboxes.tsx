import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

type ConsentCheckboxesProps = {
  consentTerms: boolean;
  consentPrivacy: boolean;
  setConsentTerms: (checked: boolean) => void;
  setConsentPrivacy: (checked: boolean) => void;
};

const ConsentCheckboxes = ({
  consentTerms,
  consentPrivacy,
  setConsentTerms,
  setConsentPrivacy,
}: ConsentCheckboxesProps) => {
  return (
    <div className="space-y-5 pt-4 border-t border-gray-200">
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <Checkbox
            id="consent-terms"
            checked={consentTerms}
            onCheckedChange={(checked) => setConsentTerms(checked as boolean)}
            className="mt-1"
          />
          <Label
            htmlFor="consent-terms"
            className="text-sm text-gray-700 leading-relaxed cursor-pointer"
          >
            I have read and agree to the{" "}
            <a
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Terms of Service
            </a>
            .
          </Label>
        </div>

        <div className="flex items-start space-x-3">
          <Checkbox
            id="consent-privacy"
            checked={consentPrivacy}
            onCheckedChange={(checked) => setConsentPrivacy(checked as boolean)}
            className="mt-1"
          />
          <Label
            htmlFor="consent-privacy"
            className="text-sm text-gray-700 leading-relaxed cursor-pointer"
          >
            I have read and agree to the{" "}
            <a
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Privacy Policy
            </a>
            .
          </Label>
        </div>
      </div>

      <div className="pt-3 border-t border-gray-200">
        <p className="text-sm font-medium text-gray-900">
          By continuing, you confirm that you have reviewed and agreed to the
          above.
        </p>
      </div>
    </div>
  );
};

export default ConsentCheckboxes;
