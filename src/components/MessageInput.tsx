import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Paperclip, Send } from "lucide-react";

interface ChatInputProps {
  loading: boolean;
  message: string;
  imagePreview: string;
  handleSendMessage: (e: React.FormEvent) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setUploadedImage: (file: File | null) => void;
  setImagePreview: (preview: string) => void;
  setMessage: (msg: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  loading,
  message,
  imagePreview,
  handleSendMessage,
  handleImageUpload,
  setUploadedImage,
  setImagePreview,
  setMessage,
}) => {
  return (
    <div className="border-t p-4">
      <form onSubmit={handleSendMessage} className="flex space-x-2">
        {imagePreview && (
          <div className="mb-2 relative">
            <img
              src={imagePreview}
              alt="Image preview"
              className="h-20 w-auto rounded border"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-0 right-0"
              onClick={() => {
                setUploadedImage(null);
                setImagePreview("");
              }}
            >
              Remove
            </Button>
          </div>
        )}
        {/* Hidden file input */}
        <input
          type="file"
          accept="image/*"
          id="chat-image-upload"
          className="hidden"
          onChange={handleImageUpload}
          disabled={loading}
        />

        {/* Upload Button */}
        <Button
          type="button"
          variant="ghost"
          className="p-2"
          disabled={loading}
          onClick={() => document.getElementById("chat-image-upload")?.click()}
        >
          <Paperclip className="w-5 h-5" />
        </Button>

        {/* Text Input */}
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1"
        />

        {/* Send Button */}
        <Button type="submit" size="sm">
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
};

export default ChatInput;
