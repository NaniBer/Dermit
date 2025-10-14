-- Create doctor_registrations table to store pending doctor applications
CREATE TABLE IF NOT EXISTS public.doctor_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  city_country TEXT NOT NULL,
  experience INTEGER NOT NULL,
  medical_license_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, rejected
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT
);

-- Enable RLS
ALTER TABLE public.doctor_registrations ENABLE ROW LEVEL SECURITY;

-- Admins can view all registrations
CREATE POLICY "Admins can view all doctor registrations"
ON public.doctor_registrations
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Admins can update registrations (approve/reject)
CREATE POLICY "Admins can update doctor registrations"
ON public.doctor_registrations
FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

-- Anyone can insert a registration (public form)
CREATE POLICY "Anyone can submit doctor registration"
ON public.doctor_registrations
FOR INSERT
WITH CHECK (true);

-- Create function to notify admins of new doctor registrations
CREATE OR REPLACE FUNCTION public.notify_admins_new_doctor_registration()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert notification for all admins
  INSERT INTO public.notifications (user_id, title, message, type)
  SELECT 
    ur.user_id,
    'New Doctor Registration',
    'A new doctor has registered: ' || NEW.full_name || ' (' || NEW.email || ')',
    'info'
  FROM public.user_roles ur
  WHERE ur.role = 'admin';
  
  RETURN NEW;
END;
$$;

-- Create trigger to notify admins when a new doctor registers
CREATE TRIGGER trigger_notify_admins_new_doctor_registration
AFTER INSERT ON public.doctor_registrations
FOR EACH ROW
EXECUTE FUNCTION public.notify_admins_new_doctor_registration();

-- Add index for faster queries
CREATE INDEX idx_doctor_registrations_status ON public.doctor_registrations(status);
CREATE INDEX idx_doctor_registrations_email ON public.doctor_registrations(email);