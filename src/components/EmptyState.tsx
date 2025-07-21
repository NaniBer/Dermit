import { Button } from "@/components/ui/button";
import { MessageCircle, Calendar, Plus } from "lucide-react";
import { Link } from "react-router-dom";

interface EmptyStateProps {
  type: "conversations" | "appointments";
}

const EmptyState = ({ type }: EmptyStateProps) => {
  if (type === "conversations") {
    return (
      <div className="text-center py-12">
        <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No conversations yet
        </h3>
        <p className="text-gray-500 mb-6">
          Start your first consultation to connect with a dermatologist!
        </p>
        <Link to="/patient/new-consultation">
          <Button className="bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-secondary hover:to-brand-primary">
            <Plus className="w-4 h-4 mr-2" />
            Start New Consultation
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No upcoming appointments
      </h3>
      <p className="text-gray-500 mb-6">
        Schedule your first consultation with our dermatology experts.
      </p>
      <Link to="/patient/new-consultation">
        <Button className="bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-secondary hover:to-brand-primary">
          <Plus className="w-4 h-4 mr-2" />
          Schedule Consultation
        </Button>
      </Link>
    </div>
  );
};

export default EmptyState;
