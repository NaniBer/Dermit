import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Stethoscope,
  ChevronDown,
  LogOut,
  Edit,
  LayoutDashboard,
  MessageCircle,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import NotificationDropdown from "@/components/NotificationDropdown";
import InstantNotificationSystem from "@/components/InstantNotificationSystem";
import { useState } from "react";
const DoctorHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const { user } = useAuth();
  const [notificationBadgeCount, setNotificationBadgeCount] = useState(0);

  const handleBadgeCountChange = (
    count: number | ((prev: number) => number)
  ) => {
    if (typeof count === "function") {
      setNotificationBadgeCount(count);
    } else {
      setNotificationBadgeCount(count);
    }
  };
  const fullname =
    user?.user_metadata?.first_name + " " + user?.user_metadata?.last_name;

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-32 h-13 rounded-lg flex items-center justify-center">
                <img
                  src="/DermitLong.png"
                  alt="Dermit Logo"
                  // className="w-5 h-5"
                />
                {/* <Stethoscope className="w-5 h-5 text-white" /> */}
              </div>
              {/* <span className="text-xl font-bold text-gray-900">Dermit</span> */}
              <Badge variant="secondary" className="ml-2">
                Doctor
              </Badge>
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link
                to="/doctor/dashboard"
                className={`${
                  currentPath === "/doctor/dashboard"
                    ? "text-gray-900 font-semibold"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/doctor/consultations"
                className={`${
                  currentPath === "/doctor/consultations"
                    ? "text-gray-900 font-semibold"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Consultations
              </Link>
              <Link
                to="/doctor/patients"
                className={`${
                  currentPath === "/doctor/patients"
                    ? "text-gray-900 font-semibold"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Patients
              </Link>
              <Link
                to="/doctor/profile"
                className={`${
                  currentPath === "/doctor/profile"
                    ? "text-gray-900 font-semibold"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Profile
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <InstantNotificationSystem
              onBadgeCountChange={handleBadgeCountChange}
            />
            <NotificationDropdown badgeCount={notificationBadgeCount} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <Avatar className="w-8 h-8 md:hidden block">
                    <AvatarImage src="/placeholder-doctor.jpg" />
                    <AvatarFallback>Dr</AvatarFallback>
                  </Avatar>
                  <span className="hidden md:block text-sm font-medium">
                    Dr. {fullname}
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="block md:hidden ">
                  <DropdownMenuItem
                    onClick={() => navigate("/doctor/dashboard")}
                  >
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate("/doctor/consultations")}
                  >
                    <Stethoscope className="w-4 h-4 mr-2" />
                    Consultations
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate("/doctor/patients")}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Patients
                  </DropdownMenuItem>
                </div>
                <DropdownMenuItem onClick={() => navigate("/doctor/profile")}>
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
export default DoctorHeader;
