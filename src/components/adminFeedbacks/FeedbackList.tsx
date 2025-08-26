import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Mail, Phone, Users, Calendar } from "lucide-react";
import React from "react";
import { Database } from "@/integrations/supabase/types";

type FeedbackWithProfile =
  Database["public"]["Views"]["feedback_with_profiles"]["Row"];

interface FeedbackListProps {
  feedbacks: FeedbackWithProfile[];
  onClearSearch: () => void;
  searchTerm: string;
}

const FeedbackList: React.FC<FeedbackListProps> = ({
  feedbacks,
  onClearSearch,
  searchTerm,
}) => {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-blue-600" />
          <span>All Feedbacks ({feedbacks.length})</span>
        </CardTitle>
        <CardDescription>
          {searchTerm
            ? `Showing ${feedbacks.length} of ${feedbacks.length} feedbacks`
            : "Complete list of registered feedbacks"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {feedbacks.length > 0 ? (
            feedbacks.map((feedback) => (
              <div
                key={feedback.feedback_id}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                {/* Patient Info */}
                <div className="mb-3">
                  <h4 className="font-semibold text-gray-900">
                    Patient: {feedback.patient_first_name}{" "}
                    {feedback.patient_last_name}
                  </h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                    <div className="flex items-center space-x-1">
                      <Mail className="w-3 h-3" />
                      <span>{feedback.patient_email || "Not given"}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Phone className="w-3 h-3" />
                      <span>{feedback.patient_phone || "Not given"}</span>
                    </div>
                  </div>
                </div>

                {/* Doctor Info */}
                <div className="mb-3">
                  <h4 className="font-semibold text-gray-900">
                    Doctor: {feedback.doctor_first_name}{" "}
                    {feedback.doctor_last_name}
                  </h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                    <div className="flex items-center space-x-1">
                      <Mail className="w-3 h-3" />
                      <span>{feedback.doctor_email || "Not given"}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Phone className="w-3 h-3" />
                      <span>{feedback.doctor_phone || "Not given"}</span>
                    </div>
                  </div>
                </div>

                {/* Feedback Details */}
                <div className="mb-3 text-gray-700">
                  <p className="text-base text-gray-900 font-medium">
                    <span className="font-semibold text-gray-500">
                      Feedback Message:
                    </span>{" "}
                    {feedback.feedback_message || "No message provided"}
                  </p>
                  <p className="mt-1 text-base text-gray-900 font-medium">
                    <span className="font-semibold text-gray-500">Rating:</span>{" "}
                    {feedback.rating !== null
                      ? feedback.rating
                      : "No rating yet"}
                  </p>
                  <p className="mt-1 text-sm text-gray-700">
                    <span className="font-semibold text-gray-500">
                      Allow Contact:
                    </span>{" "}
                    {feedback.allow_contact ? "Yes" : "No"}
                  </p>
                  {feedback.allow_contact && (
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold text-gray-500">
                        Preferred Method:
                      </span>{" "}
                      {feedback.contact_method || "Not given"} -{" "}
                      {feedback.contact_value || "Not given"}
                    </p>
                  )}
                  <p className="mt-1 flex items-center space-x-1 text-sm text-gray-600">
                    <Calendar className="w-3 h-3 text-gray-500" />
                    <span>
                      {feedback.created_at
                        ? new Date(feedback.created_at).toLocaleString()
                        : "N/A"}
                    </span>
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                No feedbacks found matching your search criteria
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={onClearSearch}
              >
                Clear Search
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FeedbackList;
