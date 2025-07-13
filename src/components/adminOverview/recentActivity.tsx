import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { Activity } from "lucide-react";

const RecentActivity = () => {
  const recentActivity = [
    {
      id: 1,
      type: "New Doctor",
      description: "Dr. Emma Wilson joined the platform",
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "Consultation",
      description: "123 consultations completed today",
      time: "4 hours ago",
    },
    {
      id: 3,
      type: "License Alert",
      description: "Dr. Michael Chen's license expires soon",
      time: "1 day ago",
    },
  ];
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-blue-600" />
          <span>Recent Activity</span>
        </CardTitle>
        <CardDescription>Latest platform events and updates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50"
            >
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {activity.type}
                  </Badge>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
                <p className="text-sm text-gray-700 mt-1">
                  {activity.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
export default RecentActivity;
