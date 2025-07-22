import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const DoctorThankyou = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center space-y-6">
          <h2 className="text-3xl font-bold text-gray-900">Thank You!</h2>
          <p className="text-gray-700 leading-relaxed">
            Thank you for providing excellent care to your patient. Your
            dedication makes a real difference!
          </p>
          <Link to="/doctor/dashboard" className="w-full">
            <Button className="w-full bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold transition-colors">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DoctorThankyou;
