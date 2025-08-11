-- Fix critical security issues: Enable RLS on tables with policies but no RLS
-- This addresses the Policy Exists RLS Disabled errors

-- Enable RLS on tables that have policies but RLS is disabled
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_profiles ENABLE ROW LEVEL SECURITY;

-- Drop security definer views that pose security risks
-- These views bypass RLS and user permissions
DROP VIEW IF EXISTS public.consultations_with_patient_profiles;
DROP VIEW IF EXISTS public.doctor_profiles;
DROP VIEW IF EXISTS public.patient_profile;
DROP VIEW IF EXISTS public.patient_profiles;
DROP VIEW IF EXISTS public.admin_profiles;

-- Fix function search paths for security
-- Update functions to have immutable search paths
CREATE OR REPLACE FUNCTION public.notify_doctors_new_consultation()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
BEGIN
  -- Insert notification for all doctors
  INSERT INTO public.notifications (user_id, title, message, type, consultation_id)
  SELECT 
    p.id,
    'New Consultation Request',
    'A new consultation request has been submitted: ' || NEW.title,
    'info',
    NEW.id
  FROM public.profiles p
  JOIN public.user_roles ur ON p.id = ur.user_id
  WHERE ur.role = 'doctor';
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_consultation_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = 'public'
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.accept_consultation(consult_id uuid, doc_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SET search_path = 'public'
AS $function$
DECLARE
  rows_updated INT;
BEGIN
  UPDATE consultations
  SET doctor_id = doc_id,
      status = 'accepted'
  WHERE id = consult_id
    AND status = 'pending';

  GET DIAGNOSTICS rows_updated = ROW_COUNT;

  IF rows_updated = 1 THEN
    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
END;
$function$;

CREATE OR REPLACE FUNCTION public.create_doctor_info_if_doctor()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = 'public'
AS $function$
BEGIN
  IF NEW.role = 'doctor' THEN
     INSERT INTO doctors_info(profile_id, status)
    VALUES (NEW.user_id, 'active');
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.split_full_name()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = 'public'
AS $function$
declare
  full_name text;
begin
  full_name := NEW.full_name;

  if full_name is not null and position(' ' in full_name) > 0 then
    NEW.first_name := split_part(full_name, ' ', 1);
    NEW.last_name := trim(both from substring(full_name from position(' ' in full_name)));
  else
    NEW.first_name := full_name;
    NEW.last_name := null;
  end if;

  return NEW;
end;
$function$;

CREATE OR REPLACE FUNCTION public.update_doctor(p_doctor_id uuid, p_first_name text, p_last_name text, p_email text, p_phone text, p_specialty text, p_profilepic text)
 RETURNS void
 LANGUAGE plpgsql
 SET search_path = 'public'
AS $function$
BEGIN
    -- Update profiles table
    UPDATE profiles
    SET first_name = p_first_name,
        last_name = p_last_name,
        email = p_email,
        phone = p_phone
    WHERE id = p_doctor_id;

    -- Update doctors_info table
    UPDATE doctors_info
    SET specialty = p_specialty,
        profile_pic = p_profilePic
    WHERE profile_id = p_doctor_id;
END;
$function$;