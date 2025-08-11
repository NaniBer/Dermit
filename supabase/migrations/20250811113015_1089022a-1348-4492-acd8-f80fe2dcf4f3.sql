-- Fix critical database security issues (corrected)

-- Enable RLS on tables that have policies but RLS disabled
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors_info ENABLE ROW LEVEL SECURITY;

-- Add missing RLS policies for chats table
CREATE POLICY "Users can view chats in their consultations" 
ON public.chats 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.consultations c 
    WHERE c.id = chats.consultation_id 
    AND (auth.uid() = c.patient_id OR auth.uid() = c.doctor_id OR has_role(auth.uid(), 'admin'::user_role))
  )
);

CREATE POLICY "Users can create chats for their consultations" 
ON public.chats 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.consultations c 
    WHERE c.id = chats.consultation_id 
    AND (auth.uid() = c.patient_id OR auth.uid() = c.doctor_id OR has_role(auth.uid(), 'admin'::user_role))
  )
);

-- Add RLS policies for media_assets
CREATE POLICY "Users can view media in their consultations" 
ON public.media_assets 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.consultations c 
    WHERE c.id = media_assets.consultation_id 
    AND (auth.uid() = c.patient_id OR auth.uid() = c.doctor_id OR has_role(auth.uid(), 'admin'::user_role))
  )
);

CREATE POLICY "Users can upload media to their consultations" 
ON public.media_assets 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.consultations c 
    WHERE c.id = media_assets.consultation_id 
    AND (auth.uid() = c.patient_id OR auth.uid() = c.doctor_id OR has_role(auth.uid(), 'admin'::user_role))
  )
);

-- Add RLS policies for patient_feedback
CREATE POLICY "Users can view their own feedback" 
ON public.patient_feedback 
FOR SELECT 
USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::user_role));

CREATE POLICY "Users can create their own feedback" 
ON public.patient_feedback 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Add RLS policies for doctors_info
CREATE POLICY "Doctors can view all doctor info" 
ON public.doctors_info 
FOR SELECT 
USING (has_role(auth.uid(), 'doctor'::user_role) OR has_role(auth.uid(), 'admin'::user_role));

CREATE POLICY "Doctors can update their own info" 
ON public.doctors_info 
FOR UPDATE 
USING (auth.uid() = profile_id OR has_role(auth.uid(), 'admin'::user_role));

-- Fix Security Definer function search paths
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role user_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;