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
import { Mail, Phone, Edit, Users } from "lucide-react";
import React from "react";

interface Doctor {
  id: number;
  first_name: string;
  email: string;
  phone: string;
  specialty: string;
  licenseNumber: string;
  licenseExpiry: string;
  experience: string;
  status: string;
  patients: number;
  consultations: number;
  joinDate: string;
}

interface DoctorListProps {
  doctors: Doctor[];
  onEdit: (id: number) => void;
  onToggleStatus: (id: number) => void;
}

const DoctorsList: React.FC<DoctorListProps> = ({
  doctors,
  onEdit,
  onToggleStatus,
}) => {
  console.log(doctors);
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-purple-600" />
          <span>All Doctors</span>
        </CardTitle>
        <CardDescription>
          Manage doctor profiles and credentials
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-12 h-12">
                    {doctor?.profilePic || doctor?.profile_pic ? (
                      <img
                        src={doctor.profilePic || doctor.profile_pic}
                        alt={`${doctor.first_name ?? "User"}'s avatar`}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : doctor?.first_name ? (
                      <AvatarFallback className="bg-purple-100 text-purple-600">
                        {doctor.first_name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    ) : (
                      <AvatarFallback className="bg-purple-100 text-purple-600">
                        U
                      </AvatarFallback>
                    )}
                  </Avatar>

                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {doctor?.first_name}
                    </h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <div className="flex items-center space-x-1">
                        <Mail className="w-3 h-3" />
                        <span>{doctor.email}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Phone className="w-3 h-3" />
                        <span>{doctor.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge
                    className={
                      doctor.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }
                  >
                    {doctor.status}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(doctor.id)}
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onToggleStatus(doctor.id)}
                    className={
                      doctor.status === "active"
                        ? "text-red-600"
                        : "text-green-600"
                    }
                  >
                    {doctor.status === "active" ? "Deactivate" : "Activate"}
                  </Button>
                </div>
              </div>
              {/* <div className="mt-3 grid grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Specialty:</span>
                  <p className="font-medium">{doctor.specialty}</p>
                </div>
                <div>
                  <span className="text-gray-500">Experience:</span>
                  <p className="font-medium">{doctor.experience}</p>
                </div>
                <div>
                  <span className="text-gray-500">Patients:</span>
                  <p className="font-medium">{doctor.patients}</p>
                </div>
                <div>
                  <span className="text-gray-500">Consultations:</span>
                  <p className="font-medium">{doctor.consultations}</p>
                </div>
              </div> */}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
export default DoctorsList;
