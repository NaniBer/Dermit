import { Button } from "@/components/ui/button";
import { MessageCircle, Calendar, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface EmptyStateProps {
  type: "conversations" | "appointments";
}

const EmptyState = ({ type }: EmptyStateProps) => {
  const { t } = useTranslation();
  if (type === "conversations") {
    return (
      <div className="text-center py-12">
        <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {t("noConversationsTitle")}
        </h3>
        <p className="text-gray-500 mb-6">{t("noConversationsDescription")}</p>
        <Link to="/patient/new-consultation">
          <Button className="bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-secondary hover:to-brand-primary">
            <Plus className="w-4 h-4 mr-2" />
            {t("newConsultation")}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {t("noUpcomingAppointments")}
      </h3>
      <p className="text-gray-500 mb-6">
        {t("noUpcomingAppointmentsDescription")}
      </p>
      <Link to="/patient/new-consultation">
        <Button className="bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-secondary hover:to-brand-primary">
          <Plus className="w-4 h-4 mr-2" />
          {t("scheduleConsultation")}
        </Button>
      </Link>
    </div>
  );
};

export default EmptyState;
