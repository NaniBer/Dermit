import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Adjust the Consultation type as needed
interface Consultation {
  id: string;
  status: string;
}

interface ChatHeaderProps {
  consultation: Consultation;
  onEndClick: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  consultation,
  onEndClick,
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Avatar className="w-12 h-12">
          <AvatarFallback>PT</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-lg">Patient Consultation</CardTitle>
          <CardDescription>
            Consultation #{consultation.id.substring(0, 8)}
          </CardDescription>
        </div>
      </div>
      {consultation.status !== "completed" && (
        <Button variant="destructive" className="ml-4" onClick={onEndClick}>
          End Consultation
        </Button>
      )}
    </div>
  );
};

export default ChatHeader;
