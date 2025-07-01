import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface DashboardButtonProps {
  description: string;
  value: string | number;
  icon: LucideIcon; // icon component (like CheckCircle, MessageCircle, etc.)
  color?: string; // tailwind color name, like "green" or "blue"
}

const DashboardButton = ({
  description,
  value,
  icon: Icon,
  color,
}: DashboardButtonProps) => {
  return (
    <Card className="shadow-lg">
      <CardContent className="p-6">
        <div className="flex flex-col items-center sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 text-center sm:text-left">
          <div>
            <p className="text-sm font-medium text-gray-600">{description}</p>
            <p className={`text-3xl font-bold text-${color}-600`}>{value}</p>
          </div>
          <div
            className={`w-12 h-12 bg-${color}-100 rounded-full flex items-center justify-center`}
          >
            <Icon className={`w-6 h-6 text-${color}-600`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardButton;
