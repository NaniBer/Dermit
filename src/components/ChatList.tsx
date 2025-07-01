import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, MessageCircle, AlertCircle } from "lucide-react";
import { ReactNode } from "react";

type ChatItem = {
  id: string;
  conversationId?: string;
  doctor?: string;
  patient?: string;
  specialty?: string;
  avatar?: string;
  age?: number;
  urgency?: string;
  status?: string;
  condition?: string;
  lastMessage: string;
  unread?: boolean;
  time: string;
  messageTime?: string;
  date?: string;
};

type ChatListProps = {
  title: string;
  description: string;
  icon?: React.ElementType;
  items: ChatItem[];
  type: "doctor" | "patient";
  variant?: "default" | "all-consultations";
  onClick: (id: string) => void;
};

const ChatList = ({
  title,
  description,
  icon: Icon = MessageSquare,
  items,
  type,
  variant = "default",
  onClick,
}: ChatListProps) => {
  const getInitials = (name?: string) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };

  return (
    <Card className="shadow-lg mb-8">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Icon className="w-5 h-5 text-green-600" />
          <span>{title}</span>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent>
        {items.length > 0 ? (
          <div className="space-y-4">
            {items.map((item) => {
              const displayName =
                type === "patient" ? item.doctor : item.patient;
              const avatarText =
                type === "patient" ? item.avatar : getInitials(item.patient);

              return (
                <div
                  key={item.id}
                  onClick={() =>
                    onClick(
                      type === "patient" && item.conversationId
                        ? item.conversationId
                        : item.id
                    )
                  }
                  className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg cursor-pointer border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-200"
                >
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-green-100 text-green-600">
                      {avatarText}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {displayName}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {type === "patient"
                            ? item.specialty
                            : `Age: ${item.age}`}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-gray-500">
                          {item.time}
                        </span>
                        {type === "patient" && item.unread && (
                          <div className="w-2 h-2 bg-red-500 rounded-full mt-1 ml-auto"></div>
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-2">
                      {item.lastMessage}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      {/* Patient View */}
                      {type === "patient" && item.unread && (
                        <Badge className="bg-blue-100 text-blue-800 text-xs">
                          New Message
                        </Badge>
                      )}

                      {/* Doctor - Active Consultations */}
                      {type === "doctor" && variant === "default" && (
                        <>
                          <Badge
                            variant={
                              item.urgency === "high"
                                ? "destructive"
                                : item.urgency === "medium"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {item.urgency} priority
                          </Badge>
                          {item.status === "waiting" && (
                            <AlertCircle className="w-4 h-4 text-orange-500" />
                          )}
                          {item.condition && (
                            <Badge variant="outline">{item.condition}</Badge>
                          )}
                        </>
                      )}

                      {/* Doctor - All Consultations */}
                      {variant === "all-consultations" && (
                        <>
                          <Badge
                            className={
                              item.urgency === "high"
                                ? "bg-red-100 text-red-800"
                                : item.urgency === "medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                            }
                          >
                            {item.urgency} priority
                          </Badge>
                          <Badge
                            className={
                              item.status === "active"
                                ? "bg-green-100 text-green-800"
                                : item.status === "waiting"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-gray-100 text-gray-800"
                            }
                          >
                            {item.status}
                          </Badge>
                          {item.status === "waiting" && (
                            <AlertCircle className="w-4 h-4 text-orange-500" />
                          )}
                        </>
                      )}
                    </div>

                    {/* Footer (extra date info for all-consultations) */}
                    {variant === "all-consultations" && (
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">
                          {item.messageTime}
                        </span>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>
                            {item.date} at {item.time}
                          </span>
                          {item.condition && (
                            <Badge variant="outline">{item.condition}</Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              {type === "patient"
                ? "No recent messages"
                : variant === "all-consultations"
                ? "No consultations found"
                : "No active consultations"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ChatList;
