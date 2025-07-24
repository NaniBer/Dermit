import { Card, CardContent } from "@/components/ui/card";
import {
  MessageCircle,
  Calendar,
  User,
  FileText,
  Clock,
  CheckCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const ConsultationList = ({
  consultations,
  handleConsultationClick,
  tabTitle = "consultations",
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            Awaiting Doctor
          </Badge>
        );
      case "in_progress":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200">
            <MessageCircle className="w-3 h-3 mr-1" />
            In Progress
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            {priority}
          </Badge>
        );
      case "high":
        return (
          <Badge className="bg-orange-100 text-orange-800 border-orange-200">
            {priority}
          </Badge>
        );
      case "normal":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            {priority}
          </Badge>
        );
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  if (consultations.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p className="text-lg font-semibold">No {tabTitle}</p>
        <p className="text-sm">
          {tabTitle === "active"
            ? "You have no ongoing consultations at the moment."
            : tabTitle === "pending"
            ? "No consultations are waiting for a doctor yet."
            : tabTitle === "completed"
            ? "You haven’t completed any consultations yet."
            : "No consultations found."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {consultations.map((consultation) => (
        <Card
          key={consultation.id}
          className="border border-gray-200 hover:shadow-md transition-all duration-300 bg-gradient-to-r from-white to-gray-50 cursor-pointer"
          onClick={() => handleConsultationClick(consultation.id)}
        >
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(consultation.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {new Date(consultation.created_at).toLocaleTimeString()}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-gray-900">
                    {consultation.profiles?.first_name &&
                    consultation.profiles?.last_name
                      ? `Dr. ${consultation.profiles.first_name} ${consultation.profiles.last_name}`
                      : "Doctor Assigned"}
                  </span>
                </div>

                <div className="space-y-2">
                  <p className="font-semibold text-gray-900">
                    {consultation.title}
                  </p>
                  <p className="text-sm text-gray-600">
                    {consultation.description}
                  </p>
                  <div className="flex items-center gap-2">
                    {getPriorityBadge(consultation.priority || "normal")}
                    {getStatusBadge(consultation.status || "pending")}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {consultation.status !== "pending" && (
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleConsultationClick(consultation.id);
                    }}
                  >
                    <MessageCircle className="w-4 h-4 mr-1" />
                    {consultation.status === "completed"
                      ? "View Chat"
                      : "Continue Chat"}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ConsultationList;
