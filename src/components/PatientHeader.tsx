import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  MessageCircle,
  Bell,
  ChevronDown,
  LogOut,
  Edit,
  Stethoscope,
  LayoutDashboard,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
const PatientHeader = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Dermit</span>
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link
                to="/patient/dashboard"
                className="text-gray-900 font-medium"
              >
                Dashboard
              </Link>
              <Link
                to="/patient/consultations"
                className="text-gray-600 hover:text-gray-900"
              >
                Consultations
              </Link>
              <Link
                to="/patient/chat"
                className="text-gray-600 hover:text-gray-900"
              >
                Messages
              </Link>
              <Link
                to="/patient/profile"
                className="text-gray-600 hover:text-gray-900"
              >
                Profile
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Bell className="w-4 h-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="/placeholder-patient.jpg" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <span className="hidden md:block text-sm font-medium">
                    John Doe
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="block md:hidden ">
                  <DropdownMenuItem
                    onClick={() => navigate("/patient/dashboard")}
                  >
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate("/patient/consultations")}
                  >
                    <Stethoscope className="w-4 h-4 mr-2" />
                    Consultations
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/patient/chat")}>
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Messages
                  </DropdownMenuItem>
                </div>
                <DropdownMenuItem onClick={() => navigate("/patient/profile")}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default PatientHeader;
