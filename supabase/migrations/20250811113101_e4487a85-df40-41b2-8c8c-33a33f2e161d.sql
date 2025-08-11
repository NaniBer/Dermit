-- Fix remaining security issues

-- Enable RLS on remaining tables
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_profiles ENABLE ROW LEVEL SECURITY;

-- Fix functions with mutable search paths
CREATE OR REPLACE FUNCTION public.accept_consultation(consult_id uuid, doc_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SET search_path = public
AS $$
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
$$;

CREATE OR REPLACE FUNCTION public.create_doctor_info_if_doctor()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.role = 'doctor' THEN
     INSERT INTO doctors_info(profile_id, status)
    VALUES (NEW.user_id, 'active');
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id, 
    NEW.email, 
    NEW.raw_user_meta_data ->> 'first_name', 
    NEW.raw_user_meta_data ->> 'last_name'
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.split_full_name()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  full_name text;
BEGIN
  full_name := NEW.full_name;

  IF full_name IS NOT NULL AND position(' ' in full_name) > 0 THEN
    NEW.first_name := split_part(full_name, ' ', 1);
    NEW.last_name := trim(both from substring(full_name from position(' ' in full_name)));
  ELSE
    NEW.first_name := full_name;
    NEW.last_name := NULL;
  END IF;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_doctor(p_doctor_id uuid, p_first_name text, p_last_name text, p_email text, p_phone text, p_specialty text, p_profilepic text)
RETURNS void
LANGUAGE plpgsql
SET search_path = public
AS $$
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
$$;

CREATE OR REPLACE FUNCTION public.update_consultation_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;