import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
const PatientDashboardButton = () => {
  const navigate = useNavigate();
  return (
    <div className="flex justify-start items-center h-full mx-auto px-4 sm:px-6 lg:px-8 ">
      {/* <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200">
        Go to Patient Dashboard
      </button> */}

      <Button
        variant="ghost"
        onClick={() => navigate("/patient/dashboard")}
        className="px-4 py-2 rounded  transition duration-200 text-black       "
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>
    </div>
  );
};
export default PatientDashboardButton;
