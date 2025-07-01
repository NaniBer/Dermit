
-- Create consultations table to track patient requests
CREATE TABLE public.consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  doctor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  images TEXT[], -- Array of image URLs
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table for real-time chat
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id UUID REFERENCES public.consultations(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file')),
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'warning', 'error', 'success')),
  is_read BOOLEAN DEFAULT FALSE,
  consultation_id UUID REFERENCES public.consultations(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for consultations
CREATE POLICY "Users can view their own consultations" ON public.consultations
  FOR SELECT USING (
    auth.uid() = patient_id OR 
    auth.uid() = doctor_id OR 
    has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Patients can create consultations" ON public.consultations
  FOR INSERT WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Doctors and admins can update consultations" ON public.consultations
  FOR UPDATE USING (
    auth.uid() = doctor_id OR 
    has_role(auth.uid(), 'admin')
  );

-- RLS Policies for messages
CREATE POLICY "Users can view messages in their consultations" ON public.messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.consultations c 
      WHERE c.id = consultation_id AND (
        auth.uid() = c.patient_id OR 
        auth.uid() = c.doctor_id OR 
        has_role(auth.uid(), 'admin')
      )
    )
  );

CREATE POLICY "Users can send messages in their consultations" ON public.messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM public.consultations c 
      WHERE c.id = consultation_id AND (
        auth.uid() = c.patient_id OR 
        auth.uid() = c.doctor_id OR 
        has_role(auth.uid(), 'admin')
      )
    )
  );

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications" ON public.notifications
  FOR INSERT WITH CHECK (true);

-- Enable realtime for messages and notifications
ALTER TABLE public.messages REPLICA IDENTITY FULL;
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
ALTER TABLE public.consultations REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.consultations;

-- Function to create notification when consultation is created
CREATE OR REPLACE FUNCTION public.notify_doctors_new_consultation()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new consultation notifications
CREATE TRIGGER on_consultation_created
  AFTER INSERT ON public.consultations
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_doctors_new_consultation();

-- Function to update consultation updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_consultation_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updating consultation timestamp
CREATE TRIGGER update_consultations_updated_at
  BEFORE UPDATE ON public.consultations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_consultation_updated_at();
