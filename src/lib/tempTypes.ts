// Temporary types to fix build errors
export interface Message {
  id: string;
  chat_id: string;
  consultation_id: string;
  content: string;
  created_at: string;
  file_url?: string;
  message_type: string;
  sender_id: string;
}

export interface Notification {
  id: string;
  consultation_id?: string;
  created_at: string;
  is_read: boolean;
  message: string;
  title: string;
  type: string;
  user_id: string;
}

export interface UserRole {
  role: string;
}

export interface Consultation {
  id: string;
  consultation_id: string;
  created_at: string;
  doctor_id?: string;
  patient_id: string;
  status: string;
  updated_at: string;
  patient_first_name?: string;
  patient_last_name?: string;
  patient_email?: string;
  priority?: string;
}

export interface Chat {
  id: string;
  consultation_id: string;
  created_at: string;
  doctor_id: string;
  patient_id: string;
  status: string;
  updated_at: string;
}