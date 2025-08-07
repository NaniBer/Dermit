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
        type="submit"
        className="px-4 py-2 rounded hover:bg-blue-600 transition duration-200 bg-white text-black       "
        onClick={() => {
          navigate("/patient/dashboard");
        }}
      >
        <ArrowLeft />
        Dashboard
      </Button>
    </div>
  );
};
export default PatientDashboardButton;
