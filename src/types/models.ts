// Centralized data models for the app

export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
  // Add more fields as needed
}

export type ConsultationStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type ConsultationPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface Consultation {
  id: string;
  patient_id: string;
  doctor_id?: string | null;
  title: string;
  description: string;
  status: ConsultationStatus;
  priority: ConsultationPriority;
  images: string[];
  created_at: string;
  updated_at: string;
  profiles?: Profile; // For joined queries
}

export type MessageType = 'text' | 'image' | 'file';

export interface Message {
  id: string;
  chat_id?: string;
  consultation_id: string;
  sender_id: string;
  content: string;
  message_type: MessageType;
  file_url?: string | null;
  created_at: string;
}

export interface MessageInsert {
  consultation_id: string;
  sender_id: string;
  content: string;
  message_type: MessageType;
  file_url?: string | null;
} 