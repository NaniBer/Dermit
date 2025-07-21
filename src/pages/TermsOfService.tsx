import { Stethoscope } from "lucide-react";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex flex-col">
      <main className="flex-1 flex items-center justify-center py-16">
        <div className="max-w-3xl w-full bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-8 h-8 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-lg flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">Dermit</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">
            Terms of Service
          </h1>
          <div className="prose max-w-none text-gray-800">
            <p>
              <strong>Effective Date:</strong> 25th of July, 2025
            </p>
            <p>
              <strong>Operated by:</strong> WeMD Africa
            </p>
            <p>
              These Terms of Service (“Terms”) govern your use of Dermit, a
              platform that connects users with licensed dermatology and
              venereology professionals. By accessing or using Dermit, you agree
              to these Terms.
            </p>

            <h2>1. Overview</h2>
            <p>
              Dermit is a digital platform that connects individuals (“Users”)
              seeking dermatological or venereological consultations with
              verified and licensed medical professionals (“Practitioners”).
              Dermit is operated by <strong>WeMD Africa</strong> and acts solely
              as a broker between Users and Practitioners.
            </p>
            <p>
              <strong>Dermit does not provide medical care</strong> and is{" "}
              <strong>not a healthcare provider</strong>. All healthcare
              services are delivered solely by the Practitioners, who operate
              independently.
            </p>

            <h2>2. Eligibility</h2>
            <ul>
              <li>
                Be at least 18 years old or have parental/legal guardian
                consent;
              </li>
              <li>Accept these Terms in full;</li>
              <li>
                For Practitioners: Hold valid credentials (medical license,
                specialty certificate, degree, and active TIN).
              </li>
            </ul>

            <h2>3. Our Role and Disclaimer</h2>
            <ul>
              <li>
                Dermit facilitates secure connections between Users and licensed
                Practitioners.
              </li>
              <li>
                Dermit is not responsible for diagnoses, prescriptions, or
                medical outcomes.
              </li>
              <li>
                Practitioners are independently responsible for the quality,
                legality, and ethics of their services.
              </li>
              <li>
                <strong>
                  Use of the Platform does not create a doctor-patient
                  relationship with Dermit.
                </strong>
              </li>
            </ul>

            <h2>4. Access to User Data</h2>
            <ul>
              <li>
                Practitioners will have full access to user-submitted data,
                including photos, messages, and health information, similar to
                an in-person consultation.
              </li>
              <li>
                Users agree that once a case is submitted, their data is shared
                with a licensed Practitioner for diagnosis and medical opinion.
              </li>
              <li>
                Practitioners are required to treat all user data with strict
                medical confidentiality and in accordance with medical ethics
                and data protection laws.
              </li>
            </ul>

            <h2>5. Consent to Use of Data for AI Training</h2>
            <ul>
              <li>
                Users may be asked to consent to the use of{" "}
                <strong>anonymized</strong> and{" "}
                <strong>non-identifiable</strong> medical data for training
                machine learning models.
              </li>
              <li>
                This data will <strong>never</strong> include names, contact
                details, or personal identifiers.
              </li>
              <li>
                Use is strictly for internal research and product improvement —
                and only with explicit user consent.
              </li>
              <li>Users may opt out at any time.</li>
            </ul>

            <h2>6. Escrow & Payment Terms</h2>
            <h3>6.1. Payment Mechanism</h3>
            <p>
              Payments are held in <strong>escrow</strong> by a third-party
              provider. Funds are released after the service is delivered and
              confirmed by the User, or 72 hours without dispute.
            </p>
            <h3>6.2. Platform Fees</h3>
            <p>
              Dermit charges a transaction fee (visible during checkout) to
              support platform operations.
            </p>
            <h3>6.3. No Off-Platform Payments</h3>
            <p>
              Off-platform payments are strictly prohibited. Violators may be
              suspended or banned.
            </p>
            <h3>6.4. Dispute Handling</h3>
            <p>
              Users can file a dispute within 72 hours. Dermit will mediate
              using platform communication logs. However, medical opinions
              cannot be reversed.
            </p>

            <h2>7. Privacy and Data Protection</h2>
            <ul>
              <li>
                Your data is stored securely and encrypted in alignment with{" "}
                <strong>
                  Proclamation No. 1321/2024 – the Personal Data Protection
                  Proclamation of Ethiopia
                </strong>
                .
              </li>
              <li>
                Only authorized Dermit staff and assigned Practitioners have
                access to your personal information, strictly on a need-to-know
                basis.
              </li>
              <li>
                You have the right to request correction or deletion of your
                personal data at any time, in accordance with applicable data
                protection laws.
              </li>
            </ul>

            <h2>8. Practitioner Obligations</h2>
            <ul>
              <li>Keep all licenses and credentials up to date.</li>
              <li>Uphold medical and legal standards.</li>
              <li>Maintain confidentiality at all times.</li>
              <li>Operate only within certified specialties.</li>
            </ul>

            <h2>9. User Responsibilities</h2>
            <ul>
              <li>Provide accurate, truthful information.</li>
              <li>Use the platform for legitimate medical concerns only.</li>
              <li>Do not abuse or harass Practitioners.</li>
              <li>Avoid submitting offensive or inappropriate content.</li>
            </ul>

            <h2>10. Limitation of Liability</h2>
            <ul>
              <li>
                Dermit does not guarantee medical accuracy, suitability, or
                platform uptime.
              </li>
              <li>
                Dermit is not liable for Practitioner services, misused advice,
                or lack of in-person care.
              </li>
            </ul>

            <h2>11. Termination</h2>
            <p>
              We may suspend or terminate your account for violating terms,
              fraud, or bypassing payments.
            </p>

            <h2>12. Updates and Changes</h2>
            <p>
              Terms may be updated at any time. Users will be notified, and
              continued use means acceptance.
            </p>

            <h2>13. Contact</h2>
            <p>
              For support, complaints, or questions, contact us at: <br />
              📧{" "}
              <a
                href="mailto:support@wemd.africa"
                className="text-blue-600 underline"
              >
                support@wemd.africa
              </a>
              <br />
              📍 WeMD Africa, Addis Ababa, Ethiopia
            </p>
          </div>
        </div>
      </main>
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="max-w-3xl mx-auto flex items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-lg flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">Dermit</span>
          </div>
          <p className="text-gray-400 text-sm">
            © 2024 Dermit by WeMD Africa. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default TermsOfService;
