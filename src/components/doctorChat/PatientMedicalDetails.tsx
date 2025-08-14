import { useState } from "react";
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";

import ImageViewer from "@/components/ImageViewer";

interface Consultation {
  status: string;
  title: string;
  priority: string;
  description?: string;
  images?: string[];
  created_at?: string;
}
interface PatientMedicalDetailsProps {
  images: string[];
  consultation: Consultation;
}

const PatientMedicalDetails: React.FC<PatientMedicalDetailsProps> = ({
  images,
  consultation,
}) => {
  const [showImagesModal, setShowImagesModal] = useState(false);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg">Medical Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600">
              Description
            </label>
            <p className="text-sm text-gray-900 whitespace-pre-line">
              {consultation.description || "No description provided. "}
            </p>
          </div>

          {images && images.length > 0 && (
            <div>
              <label className="text-sm font-medium text-gray-600">
                Images
              </label>
              <p className="text-sm text-gray-900">
                {images.length} image(s) uploaded
              </p>
              <Button
                variant="outline"
                className="mt-2"
                onClick={() => setShowImagesModal(true)}
              >
                View Images
              </Button>

              <Dialog open={showImagesModal} onOpenChange={setShowImagesModal}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Consultation Images</DialogTitle>
                  </DialogHeader>

                  <ImageViewer images={images} />
                  <DialogClose asChild>
                    <Button className="mt-4 w-full">Close</Button>
                  </DialogClose>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
export default PatientMedicalDetails;
