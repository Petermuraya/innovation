
-- Update members table to track approval details
ALTER TABLE public.members 
ADD COLUMN IF NOT EXISTS approved_by uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS approved_at timestamp with time zone;

-- Create payment reminders tracking table
CREATE TABLE IF NOT EXISTS public.payment_reminders (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reminder_type text NOT NULL CHECK (reminder_type IN ('registration', 'subscription')),
  reminder_count integer NOT NULL DEFAULT 1,
  last_reminded_at timestamp with time zone NOT NULL DEFAULT now(),
  is_dismissed boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, reminder_type)
);

-- Enable RLS on payment_reminders
ALTER TABLE public.payment_reminders ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for payment_reminders
CREATE POLICY "Users can view their own reminders" 
  ON public.payment_reminders 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own reminders" 
  ON public.payment_reminders 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert reminders" 
  ON public.payment_reminders 
  FOR INSERT 
  WITH CHECK (true);

-- Create function to handle member approval
CREATE OR REPLACE FUNCTION public.approve_member(
  member_id uuid,
  approver_id uuid
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update member approval details
  UPDATE public.members 
  SET 
    registration_status = 'approved',
    approved_by = approver_id,
    approved_at = now(),
    updated_at = now()
  WHERE id = member_id;
  
  -- Create initial payment reminders
  INSERT INTO public.payment_reminders (user_id, reminder_type)
  SELECT user_id, 'registration'
  FROM public.members 
  WHERE id = member_id
  ON CONFLICT (user_id, reminder_type) DO NOTHING;
  
  INSERT INTO public.payment_reminders (user_id, reminder_type)
  SELECT user_id, 'subscription'
  FROM public.members 
  WHERE id = member_id
  ON CONFLICT (user_id, reminder_type) DO NOTHING;
END;
$$;

-- Create function to track payment reminder views
CREATE OR REPLACE FUNCTION public.increment_payment_reminder(
  reminder_user_id uuid,
  reminder_type_param text
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only increment registration reminders, subscription reminders stay at 1
  IF reminder_type_param = 'registration' THEN
    UPDATE public.payment_reminders
    SET 
      reminder_count = reminder_count + 1,
      last_reminded_at = now(),
      updated_at = now()
    WHERE user_id = reminder_user_id AND reminder_type = reminder_type_param;
  ELSE
    UPDATE public.payment_reminders
    SET 
      last_reminded_at = now(),
      updated_at = now()
    WHERE user_id = reminder_user_id AND reminder_type = reminder_type_param;
  END IF;
END;
$$;
