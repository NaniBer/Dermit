-- Add consent tracking to profiles table
ALTER TABLE public.profiles 
ADD COLUMN consent_ai_training boolean DEFAULT false,
ADD COLUMN consent_data_storage boolean DEFAULT false,
ADD COLUMN consent_timestamp timestamp with time zone;

-- Create index for consent queries
CREATE INDEX idx_profiles_consent ON public.profiles(consent_ai_training, consent_data_storage);