import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import {
  CheckCircle,
  Eye,
  Activity,
  FileText,
  Calendar,
  Clock,
  AlertCircle,
  Stethoscope,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
const PastDiagnosis = ({ pastDiagnosesList }) => {
  const handleDiagnosisClick = (diagnosis) => {
    setSelectedDiagnosis(diagnosis);
    setIsDialogOpen(true);
  };
  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedDiagnosis(null);
  };

  const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-purple-600" />
            <span>Past Diagnosis</span>
          </CardTitle>
          <CardDescription>
            Click on any diagnosis to view details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pastDiagnosesList.map((diagnosis) => (
              <div
                key={diagnosis.id}
                onClick={() => handleDiagnosisClick(diagnosis)}
                className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:shadow-md hover:border-gray-300 transition-all duration-200 group"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                    {diagnosis.condition}
                  </h4>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <Eye className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">{diagnosis.doctor}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {diagnosis.date}
                  </span>
                  <Badge
                    variant="secondary"
                    className={`text-xs ${
                      diagnosis.severity === "Mild"
                        ? "bg-green-100 text-green-800"
                        : diagnosis.severity === "Mild to Moderate"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {diagnosis.severity}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <span>Diagnosis Details</span>
            </DialogTitle>
            <DialogDescription>
              Complete medical record for this consultation
            </DialogDescription>
          </DialogHeader>

          {selectedDiagnosis && (
            <div className="space-y-6">
              {/* Header Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Condition
                    </label>
                    <p className="text-lg font-semibold text-gray-900">
                      {selectedDiagnosis.condition}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Severity
                    </label>
                    <Badge
                      className={`mt-1 ${
                        selectedDiagnosis.severity === "Mild"
                          ? "bg-green-100 text-green-800"
                          : selectedDiagnosis.severity === "Mild to Moderate"
                          ? "bg-yellow-100 text-yellow-800"
                          : selectedDiagnosis.severity === "Benign"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {selectedDiagnosis.severity}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Doctor
                    </label>
                    <p className="text-gray-900">{selectedDiagnosis.doctor}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Date
                    </label>
                    <p className="text-gray-900">{selectedDiagnosis.date}</p>
                  </div>
                </div>
              </div>

              {/* Symptoms */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-orange-600" />
                  <span>Symptoms</span>
                </h4>
                <p className="text-gray-700 bg-orange-50 p-3 rounded-lg border border-orange-200">
                  {selectedDiagnosis.symptoms}
                </p>
              </div>

              {/* Diagnosis */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                  <Stethoscope className="w-4 h-4 text-blue-600" />
                  <span>Diagnosis</span>
                </h4>
                <p className="text-gray-700 bg-blue-50 p-3 rounded-lg border border-blue-200">
                  {selectedDiagnosis.diagnosis}
                </p>
              </div>

              {/* Treatment */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-green-600" />
                  <span>Treatment Plan</span>
                </h4>
                <p className="text-gray-700 bg-green-50 p-3 rounded-lg border border-green-200">
                  {selectedDiagnosis.treatment}
                </p>
              </div>

              {/* Prescription */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-purple-600" />
                  <span>Prescription</span>
                </h4>
                <p className="text-gray-700 bg-purple-50 p-3 rounded-lg border border-purple-200">
                  {selectedDiagnosis.prescription}
                </p>
              </div>

              {/* Follow-up */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <span>Follow-up Instructions</span>
                </h4>
                <p className="text-gray-700 bg-indigo-50 p-3 rounded-lg border border-indigo-200">
                  {selectedDiagnosis.followUp}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button variant="outline" onClick={closeDialog}>
                  Close
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Download Report
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default PastDiagnosis;
