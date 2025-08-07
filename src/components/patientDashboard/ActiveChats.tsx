import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
const ActiveChats = () => {
  const { user } = useAuth();
  const [recentChats, setRecentChats] = useState([]);
  useEffect(() => {
    const fetchRecentChats = async () => {
      try {
        const { data, error } = await supabase
          .from("consultations")
          .select("*")
          .eq("patient_id", user.id)
          .eq("status", "in_progress")
          .order("created_at", { ascending: false });

        if (error) throw error;

        setRecentChats(data || []);
      } catch (error) {
        console.error("Error fetching recent chats:", error);
      }
    };

    fetchRecentChats();
  }, []);

  return (
    <Link to="/patient/consultations">
      <Card className="shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
        <CardContent className="p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-brand-secondary to-brand-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Active Chats</h3>
          <p className="text-sm text-gray-600">
            {recentChats.length} ongoing conversations with doctors
          </p>
          {recentChats.some((chat) => chat.unread) && (
            <Badge className="mt-2 bg-red-100 text-red-800">New Messages</Badge>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};
export default ActiveChats;
