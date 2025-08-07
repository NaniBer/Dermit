import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface ActionButtonProps {
  handleAcceptConsultation: () => void;
  handleDeclineConsultation: () => void;
}

const ActionButtons: React.FC<ActionButtonProps> = ({
  handleAcceptConsultation,
  handleDeclineConsultation,
}) => {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg">Consultation Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          onClick={handleAcceptConsultation}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Accept Consultation
        </Button>
        <Button
          onClick={handleDeclineConsultation}
          variant="outline"
          className="w-full border-red-200 text-red-600 hover:bg-red-50"
        >
          Decline Consultation
        </Button>
      </CardContent>
    </Card>
  );
};

export default ActionButtons;
