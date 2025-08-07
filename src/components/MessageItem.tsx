// MessageItem.tsx (or .tsx file inside components/chat/)
import { FileText, Camera } from "lucide-react";
interface MessageType {
  id: string;
  consultation_id: string;
  sender_id: string;
  content: string;
  message_type: string; // you can extend this if you have more types
  file_url?: string; // optional, only for images or files
  signedUrl?: string; // optional, for signed URLs if you’re using Cloudinary or similar
  created_at: string | Date;
  // Add any other properties your messages might have
}

interface MessageItemProps {
  message: MessageType; // your message type
  currentUserId: string | undefined;
}

const MessageItem = ({ message, currentUserId }: MessageItemProps) => {
  const isCurrentUser = message.sender_id === currentUserId;

  return (
    <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          isCurrentUser
            ? "bg-brand-primary text-white"
            : "bg-gray-100 text-gray-900"
        }`}
      >
        {message.message_type === "image" && message.file_url ? (
          <img
            src={message.signedUrl || message.file_url}
            alt="chat attachment"
            className="rounded-md max-w-full h-auto"
          />
        ) : (
          <p className="text-sm">{message.content}</p>
        )}

        {message.file_url && message.message_type !== "image" && (
          <div className="mt-2">
            <div className="flex items-center space-x-2 text-xs">
              <FileText className="w-3 h-3" />
              <a
                href={message.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Download Attachment
              </a>
            </div>
          </div>
        )}

        <p className="text-xs mt-1 opacity-75">
          {new Date(message.created_at!).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};

export default MessageItem;
