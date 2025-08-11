import Footer from "@/components/Footer";
import { ShieldCheck } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 flex flex-col">
      <main className="flex-1 flex items-center justify-center py-16">
        <div className="max-w-3xl w-full bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-8 h-8 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">Dermit</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">
            Privacy Policy
          </h1>

          <div className="prose max-w-none text-gray-800">
            <p>
              <strong>Effective Date:</strong> 25th of July, 2025
            </p>
            <p>
              <strong>Last Updated:</strong> 25th of July, 2025
            </p>
            <p>
              This Privacy Policy explains how <strong>Dermit</strong> (“we,”
              “us,” or “our”) collects, uses, and protects personal data when
              users (“you,” “patients” or “practitioners”) access our platform.
              By using Dermit, you agree to the terms described here.
            </p>

            <h2>1. What Information We Collect</h2>

            <h3>a. Personal Identifiable Information (PII)</h3>
            <ul>
              <li>Name, phone number, email address</li>
              <li>Demographic information</li>
              <li>Photos or descriptions of skin-related concerns</li>
              <li>Payment details (if applicable)</li>
            </ul>

            <h3>b. Health Information</h3>
            <ul>
              <li>Health complaints submitted through the platform</li>
              <li>Past medical history (if shared)</li>
              <li>Uploaded images or media of affected areas</li>
            </ul>

            <h3>c. Practitioner Credentials</h3>
            <ul>
              <li>Medical license</li>
              <li>Area of specialization</li>
              <li>ID verification documents (e.g. TIN, degrees)</li>
            </ul>

            <h3>d. Usage Data</h3>
            <ul>
              <li>Log data (IP, device type, browser)</li>
              <li>Session activity (timestamps, clicks, referrals)</li>
            </ul>

            <h2>2. Use of Data</h2>
            <p>We use your data to:</p>
            <ul>
              <li>
                Facilitate connections between patients and licensed
                dermatovenerologists
              </li>
              <li>Provide diagnostic support and follow-up recommendations</li>
              <li>Improve our platform’s functionality and user experience</li>
              <li>Maintain compliance with applicable regulations</li>
              <li>
                <strong>Train AI models</strong> (only with your explicit
                consent — see Section 6)
              </li>
            </ul>

            <h2>3. How We Share Data</h2>
            <p>
              We <strong>do not sell your data</strong>. However, we may share
              data with:
            </p>
            <ul>
              <li>Licensed practitioners you interact with on Dermit</li>
              <li>
                Cloud service providers for storage and platform operation
              </li>
              <li>Regulatory bodies (only if required by law)</li>
            </ul>

            <h2>4. Data Visibility to Practitioners</h2>
            <p>
              When you request a consultation, your shared images and
              descriptions will be{" "}
              <strong>visible to the licensed practitioner</strong> reviewing
              your case. This mirrors traditional medical consultations, and
              data is <em>not anonymized</em> for your assigned practitioner.
            </p>

            <h2>5. Data Protection Framework</h2>
            <p>
              We operate in compliance with{" "}
              <strong>
                Proclamation No. 1321/2024 – the Personal Data Protection
                Proclamation of Ethiopia
              </strong>
              . All data handling and storage practices are guided by this local
              legal framework. We ensure robust protections such as encryption,
              secure access controls, and lawful processing to safeguard your
              personal data.
            </p>

            <h2>6. AI Training Consent</h2>
            <p>
              We may use de-identified, non-personal health data to train
              machine learning models aimed at improving diagnostics and
              platform features. We will <strong>only</strong> do so with your{" "}
              <strong>explicit, opt-in consent</strong>. You can withdraw this
              at any time.
            </p>

            <h2>7. Data Protection & Security</h2>
            <ul>
              <li>End-to-end encryption during transmission</li>
              <li>Access controls for all internal systems</li>
              <li>Regular security reviews and compliance checks</li>
            </ul>

            <h2>8. Data Retention & Deletion</h2>
            <ul>
              <li>
                Consultation records are retained for a minimum of 1 year unless
                legally required longer.
              </li>
              <li>
                You may request to{" "}
                <strong>delete your account and all associated data</strong> by
                contacting:{" "}
                <a href="mailto:support@wemd.africa">support@wemd.africa</a>
              </li>
              <li>
                AI training data, if consented to, is retained in de-identified
                form
              </li>
            </ul>

            <h2>9. Children’s Data</h2>
            <p>
              Our platform is not intended for individuals under 18 without
              parental or guardian supervision.
            </p>

            <h2>10. Your Rights</h2>
            <p>Depending on your region, you may have rights to:</p>
            <ul>
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of data</li>
              <li>Object to specific processing</li>
              <li>Withdraw AI training consent</li>
            </ul>
            <p>
              To make a request, email us at:{" "}
              <strong>
                <a href="mailto:support@wemd.africa">support@wemd.africa</a>
              </strong>
            </p>

            <h2>Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will
              notify you of any material changes via email or in-app
              notifications.
            </p>

            <h2>Contact Us</h2>
            <ul>
              <li>
                <strong>Email:</strong> support@wemd.africa
              </li>
              {/* <li>
                <strong>Phone:</strong> [Insert number if desired]
              </li> */}
              <li>
                <strong>Address:</strong> WeMD Africa, Addis Ababa, Ethiopia
              </li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
