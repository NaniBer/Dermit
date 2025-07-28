import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Mail, Trash2, Edit, Phone } from "lucide-react";

const ExistingUser = ({ doctors, admins }) => {
  console.log(admins);
  return (
    <div className="lg:col-span-2">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-green-600" />
            <span>Registered Users</span>
          </CardTitle>
          <CardDescription>
            Manage existing doctor and admin accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="doctors" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="doctors">
                Doctors ({doctors?.length})
              </TabsTrigger>
              <TabsTrigger value="admins">Admins ({admins.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="doctors" className="mt-4">
              <div className="space-y-4">
                {doctors?.map((doctor) => (
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
                            {doctor?.first_name} {doctor?.last_name}
                          </h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                            <div className="flex items-center space-x-1">
                              <Mail className="w-3 h-3" />
                              <span>{doctor?.email}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="admins" className="mt-4">
              <div className="space-y-4">
                {admins.map((admin) => (
                  <div
                    // key={admin[0].id}
                    className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-purple-100 text-purple-600">
                            {(
                              admin?.first_name?.charAt(0) ||
                              admin?.email?.charAt(0) ||
                              "A"
                            ).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {admin?.first_name} {admin?.last_name}
                          </h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                            <div className="flex items-center space-x-1">
                              <Mail className="w-3 h-3" />
                              <span>{admin?.email}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                            <div className="flex items-center space-x-1">
                              <Phone className="w-3 h-3" />
                              <span>{admin?.phone}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                            <Badge
                              variant="outline"
                              className="bg-purple-50 text-purple-700"
                            >
                              Admin
                            </Badge>
                            {/* <span>Joined: {admin.joinDate}</span> */}
                          </div>
                        </div>
                      </div>
                      {/* <div className="flex items-center space-x-2">
                        <Badge className="bg-green-100 text-green-800">
                          {admin.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div> */}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
export default ExistingUser;
