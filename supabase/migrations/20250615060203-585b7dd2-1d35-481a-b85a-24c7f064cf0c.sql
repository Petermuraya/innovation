
-- Add missing columns to the notifications table
ALTER TABLE public.notifications 
ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent'));

ALTER TABLE public.notifications 
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- Update existing records to have default priority if null
UPDATE public.notifications 
SET priority = 'medium' 
WHERE priority IS NULL;
