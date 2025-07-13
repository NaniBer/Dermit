import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Edit, Users, Calendar } from "lucide-react";
import React from "react";

export interface Patient {
  id: number;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  status: string;
  consultations: number;
  lastConsultation: string;
  assignedDoctor: string;
}
interface PatientListProps {
  patients: Patient[];
  onClearSearch: () => void;
  searchTerm: string;
}

const PatientList: React.FC<PatientListProps> = ({
  patients,
  onClearSearch,
  searchTerm,
}) => {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-blue-600" />
          <span>All Patients ({patients.length})</span>
        </CardTitle>
        <CardDescription>
          {searchTerm
            ? `Showing ${patients.length} of ${patients.length} patients`
            : "Complete list of registered patients"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {patients.length > 0 ? (
            patients.map((patient) => (
              <div
                key={patient.id}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {patient.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {patient.name}
                      </h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <div className="flex items-center space-x-1">
                          <Mail className="w-3 h-3" />
                          <span>{patient.email}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Phone className="w-3 h-3" />
                          <span>{patient.phone}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>Joined: {patient.joinDate}</span>
                        </div>
                        <span>Assigned to: {patient.assignedDoctor}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      className={
                        patient.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {patient.status}
                    </Badge>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Consultations:</span>
                    <p className="font-medium">{patient.consultations}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Last Consultation:</span>
                    <p className="font-medium">{patient.lastConsultation}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Status:</span>
                    <p className="font-medium capitalize">{patient.status}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                No patients found matching your search criteria
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={onClearSearch}
              >
                Clear Search
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
export default PatientList;
