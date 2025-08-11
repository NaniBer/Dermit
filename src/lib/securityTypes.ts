// Temporary security-focused types to fix build errors and maintain type safety

export interface SecureMessage {
  id: string;
  chat_id?: string;
  consultation_id: string;
  content: string;
  created_at: string;
  file_url?: string;
  message_type: string;
  sender_id: string;
}

export interface SecureNotification {
  id: string;
  consultation_id?: string;
  created_at: string;
  is_read: boolean;
  message: string;
  title: string;
  type: string;
  user_id: string;
}

export interface SecureUserRole {
  role: string;
  user_id: string;
  created_at: string;
  id: string;
}

export interface SecureConsultation {
  id: string;
  consultation_id?: string;
  created_at: string;
  doctor_id?: string;
  patient_id: string;
  status: string;
  updated_at: string;
  patient_first_name?: string;
  patient_last_name?: string;
  patient_email?: string;
  priority?: string;
  title: string;
  description?: string;
  treatment_plan?: string;
  diagnosis?: string;
  observations?: string;
  images?: string[];
}

export interface SecureChat {
  id: string;
  consultation_id: string;
  created_at: string;
  doctor_id: string;
  patient_id: string;
  status: string;
  updated_at: string;
}

export interface SecureDoctorInfo {
  id: number;
  profile_id: string;
  status: 'active' | 'inactive' | 'pending';
  specialty?: string;
  license_number?: string;
  years_of_experience?: number;
  education?: string;
  certifications?: string;
  bio?: string;
  profile_pic?: string;
  created_at: string;
}

export interface SecureProfile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
  consent_terms?: boolean;
  consent_privacy?: boolean;
  consent_timestamp?: string;
}

// Type guard functions for runtime safety
export function isSecureMessage(obj: any): obj is SecureMessage {
  return obj && typeof obj.id === 'string' && typeof obj.content === 'string';
}

export function isSecureConsultation(obj: any): obj is SecureConsultation {
  return obj && typeof obj.id === 'string' && typeof obj.patient_id === 'string';
}

export function isSecureUserRole(obj: any): obj is SecureUserRole {
  return obj && typeof obj.role === 'string' && typeof obj.user_id === 'string';
}

export function isSecureChat(obj: any): obj is SecureChat {
  return obj && typeof obj.id === 'string' && typeof obj.consultation_id === 'string';
}

// Security validation helpers
export function sanitizeInput(input: string): string {
  return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
}

export function validateUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}