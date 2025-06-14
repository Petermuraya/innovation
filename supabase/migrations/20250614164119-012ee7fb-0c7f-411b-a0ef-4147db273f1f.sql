
-- Add image_url column to events table for event banners
ALTER TABLE public.events 
ADD COLUMN image_url TEXT;

-- Add a comment to describe the column
COMMENT ON COLUMN public.events.image_url IS 'URL of the event banner/featured image';
