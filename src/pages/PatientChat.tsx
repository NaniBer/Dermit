import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  Phone,
  Video,
  MoreVertical,
  ChevronDown,
  LogOut,
  Edit,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import FileUpload from "@/components/FileUpload";
import EmptyState from "@/components/EmptyState";
import PatientHeader from "@/components/PatientHeader";

const PatientChat = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeConversationId = searchParams.get("conversation") || "1";
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    navigate("/login");
  };

  // Mock conversations data
  const conversations = [
    {
      id: "1",
      doctor: "Dr. Sarah Johnson",
      specialty: "Dermatology",
      lastMessage:
        "Based on your symptoms and the images, this appears to be atopic dermatitis...",
      timestamp: "2 hours ago",
      status: "active",
      unread: true,
    },
    {
      id: "2",
      doctor: "Dr. Michael Chen",
      specialty: "Pediatric Dermatology",
      lastMessage:
        "Your skin condition has improved significantly. Continue with the treatment...",
      timestamp: "1 day ago",
      status: "completed",
      unread: false,
    },
  ];

  // Mock messages data - would be filtered by conversation ID in real app
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "doctor",
      content:
        "Hello! I've reviewed the images you uploaded. Can you tell me more about when you first noticed this skin condition?",
      timestamp: "10:30 AM",
      type: "text",
    },
    {
      id: 2,
      sender: "patient",
      content:
        "Hi Dr. Johnson! I first noticed it about 2 weeks ago. It started as a small red patch and has been getting bigger.",
      timestamp: "10:32 AM",
      type: "text",
    },
    {
      id: 3,
      sender: "doctor",
      content:
        "Thank you for the information. Have you experienced any itching, burning, or pain in the affected area?",
      timestamp: "10:35 AM",
      type: "text",
    },
    {
      id: 4,
      sender: "patient",
      content:
        "Yes, there's been some mild itching, especially at night. No burning or severe pain though.",
      timestamp: "10:37 AM",
      type: "text",
    },
    {
      id: 5,
      sender: "doctor",
      content:
        "Based on your symptoms and the images, this appears to be atopic dermatitis (eczema). I'm prescribing a topical corticosteroid cream. Apply it twice daily to the affected area.",
      timestamp: "10:45 AM",
      type: "text",
    },
  ]);

  const activeConversation = conversations.find(
    (conv) => conv.id === activeConversationId
  );

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: "patient" as const,
        content: message,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        type: "text" as const,
      };
      setMessages([...messages, newMessage]);
      setMessage("");
    }
  };

  const handleFileSelect = (file: File, type: "image" | "file" | "camera") => {
    const fileMessage = {
      id: messages.length + 1,
      sender: "patient" as const,
      content: `📎 ${file.name}`,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: type === "image" || type === "camera" ? "image" : "file",
    };
    setMessages([...messages, fileMessage]);
    console.log(`File uploaded: ${file.name}, Type: ${type}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const selectConversation = (conversationId: string) => {
    navigate(`/patient/chat?conversation=${conversationId}`);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <PatientHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8 h-[calc(100vh-200px)]">
          {/* Chat Sidebar */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg h-full">
              <CardHeader>
                <CardTitle className="text-lg">Your Conversations</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {conversations.length > 0 ? (
                  <div className="space-y-3">
                    {conversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        onClick={() => selectConversation(conversation.id)}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          activeConversationId === conversation.id
                            ? "bg-blue-50 border-blue-200"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarFallback>
                              {conversation.doctor
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">
                              {conversation.doctor}
                            </h4>
                            <p className="text-xs text-gray-600">
                              {conversation.specialty}
                            </p>
                            <p className="text-xs text-gray-500 line-clamp-1 mt-1">
                              {conversation.lastMessage}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-gray-400">
                                {conversation.timestamp}
                              </span>
                              <Badge
                                className={`text-xs ${
                                  conversation.status === "active"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {conversation.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState type="conversations" />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-3">
            {activeConversation ? (
              <Card className="shadow-lg h-full flex flex-col">
                {/* Chat Header */}
                <CardHeader className="border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback className="bg-green-100 text-green-600">
                          {activeConversation.doctor
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {activeConversation.doctor}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {activeConversation.specialty} • Online
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Video className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.sender === "patient"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          msg.sender === "patient"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        {msg.type === "image" && (
                          <div className="flex items-center space-x-2 mb-1">
                            <ImageIcon className="w-4 h-4" />
                            <span className="text-xs">Image</span>
                          </div>
                        )}
                        {msg.type === "file" && (
                          <div className="flex items-center space-x-2 mb-1">
                            <FileText className="w-4 h-4" />
                            <span className="text-xs">File</span>
                          </div>
                        )}
                        <p className="text-sm">{msg.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            msg.sender === "patient"
                              ? "text-blue-100"
                              : "text-gray-500"
                          }`}
                        >
                          {msg.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </CardContent>

                {/* Message Input */}
                <div className="border-t border-gray-200 p-4">
                  <div className="flex items-center space-x-2">
                    <FileUpload onFileSelect={handleFileSelect} />
                    <Input
                      placeholder="Type your message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1"
                    />
                    <Button
                      onClick={sendMessage}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="shadow-lg h-full flex items-center justify-center">
                <EmptyState type="conversations" />
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientChat;
