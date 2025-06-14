
-- Create table to track community visits
CREATE TABLE public.community_visits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  community_id UUID NOT NULL,
  visit_date DATE NOT NULL DEFAULT CURRENT_DATE,
  visit_count INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, community_id, visit_date)
);

-- Enable RLS on community visits
ALTER TABLE public.community_visits ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own visits
CREATE POLICY "Users can view their own community visits" 
  ON public.community_visits 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy for users to insert their own visits
CREATE POLICY "Users can create their own community visits" 
  ON public.community_visits 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy for users to update their own visits
CREATE POLICY "Users can update their own community visits" 
  ON public.community_visits 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Add new point configurations for community activities
INSERT INTO public.point_configurations (activity_type, points_value, description, is_active) VALUES
('community_visit', 5, 'Daily community visit', true),
('community_participation', 10, 'Participating in community activities', true),
('community_event_attendance', 15, 'Attending community events', true);

-- Create function to track community visits and award points
CREATE OR REPLACE FUNCTION public.track_community_visit(user_id_param uuid, community_id_param uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  visit_exists boolean;
BEGIN
  -- Check if user already visited this community today
  SELECT EXISTS(
    SELECT 1 FROM public.community_visits
    WHERE user_id = user_id_param 
    AND community_id = community_id_param 
    AND visit_date = CURRENT_DATE
  ) INTO visit_exists;
  
  IF visit_exists THEN
    -- Update visit count
    UPDATE public.community_visits
    SET visit_count = visit_count + 1, updated_at = now()
    WHERE user_id = user_id_param 
    AND community_id = community_id_param 
    AND visit_date = CURRENT_DATE;
    RETURN false; -- No points awarded for multiple visits same day
  ELSE
    -- Insert new visit record
    INSERT INTO public.community_visits (user_id, community_id, visit_date)
    VALUES (user_id_param, community_id_param, CURRENT_DATE);
    
    -- Award points for daily community visit
    PERFORM public.award_activity_points(user_id_param, 'community_visit', community_id_param, 'Daily community visit');
    RETURN true; -- Points awarded
  END IF;
END;
$$;
