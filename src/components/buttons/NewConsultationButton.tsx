import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";

const NewConsultationButton = () => {
  return (
    <Link to="/patient/new-consultation">
      <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 border-dashed border-blue-200 hover:border-blue-400 bg-gradient-to-br from-blue-50 to-green-50">
        <CardContent className="p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">New Consultation</h3>
          <p className="text-sm text-gray-600">
            Start a new consultation with a certified dermatologist
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};
export default NewConsultationButton;
