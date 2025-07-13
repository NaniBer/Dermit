import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { BarChart3, Users, UserCheck, Stethoscope } from "lucide-react";

const PlatformStats = ({ stats }) => {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-green-600" />
          <span>Platform Statistics</span>
        </CardTitle>
        <CardDescription>Current platform metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">Total Patients</span>
            </div>
            <span className="text-xl font-bold text-gray-900">
              {stats.totalPatients}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Stethoscope className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium">Active Consultations</span>
            </div>
            <span className="text-xl font-bold text-gray-900">
              {stats.activeConsultations}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <UserCheck className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium">Registered Doctors</span>
            </div>
            <span className="text-xl font-bold text-gray-900">
              {stats.totalDoctors}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
export default PlatformStats;
