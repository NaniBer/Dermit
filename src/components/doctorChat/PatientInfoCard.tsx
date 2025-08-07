import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
interface Consultation {
  status: string;
  title: string;
  priority: string;
  created_at?: string;
}

interface PatientInfoProps {
  consultation: Consultation;
}
const PatientInfoCard: React.FC<PatientInfoProps> = ({ consultation }) => {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg">Patient Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Title</label>
            <p className="text-gray-900">{consultation.title}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Status</label>
            <Badge
              className={
                consultation.status === "in_progress"
                  ? "bg-green-100 text-green-800"
                  : consultation.status === "pending"
                  ? "bg-orange-100 text-orange-800"
                  : "bg-gray-100 text-gray-800"
              }
            >
              {consultation.status}
            </Badge>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">
              Priority
            </label>
            <Badge
              className={
                consultation.priority === "high"
                  ? "bg-red-100 text-red-800"
                  : consultation.priority === "normal"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-green-100 text-green-800"
              }
            >
              {consultation.priority}
            </Badge>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Created</label>
            <p className="text-gray-900">
              {new Date(consultation.created_at!).toLocaleDateString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
export default PatientInfoCard;
