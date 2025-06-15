
-- Add action_url column to notifications table
ALTER TABLE public.notifications 
ADD COLUMN IF NOT EXISTS action_url TEXT;

-- Add expires_at column as well since it's referenced in the types
ALTER TABLE public.notifications 
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE;
