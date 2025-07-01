import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock, CalendarDays } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import EmptyState from "@/components/EmptyState";
import { Badge } from "@/components/ui/badge";

const UpcomingConsultations = () => {
  const upcomingConsultations = []; // Empty to show empty state
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CalendarDays className="w-5 h-5 text-blue-600" />
          <span>Upcoming Consultations</span>
        </CardTitle>
        <CardDescription>
          Your scheduled appointments with dermatologists
        </CardDescription>
      </CardHeader>
      <CardContent>
        {upcomingConsultations.length > 0 ? (
          <div className="space-y-4">
            {upcomingConsultations.map((consultation) => (
              <div
                key={consultation.id}
                className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200"
              >
                <div className="flex items-center space-x-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      Dr
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {consultation.doctor}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {consultation.specialty}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {consultation.date} at {consultation.time}
                      </span>
                    </div>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="bg-green-100 text-green-800 border-green-200"
                >
                  Confirmed
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState type="appointments" />
        )}
      </CardContent>
    </Card>
  );
};
export default UpcomingConsultations;
