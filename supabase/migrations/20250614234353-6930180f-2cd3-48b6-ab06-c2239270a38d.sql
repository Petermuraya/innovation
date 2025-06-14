
-- Add points for community dashboard visits (only insert if they don't exist)
INSERT INTO public.point_configurations (activity_type, points_value, description, is_active) 
SELECT * FROM (VALUES
('community_dashboard_visit', 3, 'Daily community dashboard visit', true),
('community_event_attendance', 20, 'Attending community events', true),
('community_workshop_attendance', 25, 'Attending community workshops', true),
('community_activity_attendance', 15, 'Attending community activities', true)
) AS v(activity_type, points_value, description, is_active)
WHERE NOT EXISTS (
  SELECT 1 FROM public.point_configurations pc 
  WHERE pc.activity_type = v.activity_type
);

-- Create community attendance tracking table for real-time attendance
CREATE TABLE IF NOT EXISTS public.community_attendance_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  community_id UUID NOT NULL REFERENCES public.community_groups(id) ON DELETE CASCADE,
  activity_id UUID,
  event_id UUID,
  workshop_id UUID,
  attendance_type TEXT NOT NULL CHECK (attendance_type IN ('activity', 'event', 'workshop')),
  attended BOOLEAN DEFAULT false,
  attendance_time TIMESTAMP WITH TIME ZONE,
  marked_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, activity_id, event_id, workshop_id, attendance_type)
);

-- Enable RLS
ALTER TABLE public.community_attendance_tracking ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own attendance" ON public.community_attendance_tracking;
DROP POLICY IF EXISTS "Community admins can manage attendance" ON public.community_attendance_tracking;

-- RLS Policies
CREATE POLICY "Users can view their own attendance" 
  ON public.community_attendance_tracking 
  FOR SELECT 
  USING (
    auth.uid() = user_id
    OR
    EXISTS (
      SELECT 1 FROM public.community_admin_roles car
      WHERE car.user_id = auth.uid() 
      AND car.community_id = community_attendance_tracking.community_id
      AND car.is_active = true
    )
    OR 
    public.has_role_or_higher(auth.uid(), 'general_admin')
  );

CREATE POLICY "Community admins can manage attendance" 
  ON public.community_attendance_tracking 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.community_admin_roles car
      WHERE car.user_id = auth.uid() 
      AND car.community_id = community_attendance_tracking.community_id
      AND car.is_active = true
    )
    OR 
    public.has_role_or_higher(auth.uid(), 'general_admin')
  );

-- Create function to track community dashboard visits
CREATE OR REPLACE FUNCTION public.track_community_dashboard_visit(user_id_param uuid, community_id_param uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  visit_exists boolean;
BEGIN
  -- Check if user already visited this community dashboard today
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
    
    -- Award points for daily community dashboard visit
    PERFORM public.award_activity_points(user_id_param, 'community_dashboard_visit', community_id_param, 'Daily community dashboard visit');
    RETURN true; -- Points awarded
  END IF;
END;
$$;

-- Create function to mark attendance and award points
CREATE OR REPLACE FUNCTION public.mark_community_attendance(
  user_id_param uuid, 
  community_id_param uuid,
  attendance_type_param text,
  activity_id_param uuid DEFAULT NULL,
  event_id_param uuid DEFAULT NULL,
  workshop_id_param uuid DEFAULT NULL,
  marked_by_param uuid DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  activity_type_for_points text;
  source_id_param uuid;
  description_text text;
BEGIN
  -- Determine the activity type for points and source ID
  IF attendance_type_param = 'activity' THEN
    activity_type_for_points := 'community_activity_attendance';
    source_id_param := activity_id_param;
    description_text := 'Attended community activity';
  ELSIF attendance_type_param = 'event' THEN
    activity_type_for_points := 'community_event_attendance';
    source_id_param := event_id_param;
    description_text := 'Attended community event';
  ELSIF attendance_type_param = 'workshop' THEN
    activity_type_for_points := 'community_workshop_attendance';
    source_id_param := workshop_id_param;
    description_text := 'Attended community workshop';
  ELSE
    RAISE EXCEPTION 'Invalid attendance type: %', attendance_type_param;
  END IF;

  -- Insert or update attendance record
  INSERT INTO public.community_attendance_tracking (
    user_id, 
    community_id, 
    activity_id, 
    event_id, 
    workshop_id,
    attendance_type, 
    attended, 
    attendance_time, 
    marked_by
  )
  VALUES (
    user_id_param, 
    community_id_param, 
    activity_id_param, 
    event_id_param, 
    workshop_id_param,
    attendance_type_param, 
    true, 
    now(), 
    marked_by_param
  )
  ON CONFLICT (user_id, attendance_type, COALESCE(activity_id, '00000000-0000-0000-0000-000000000000'::uuid), COALESCE(event_id, '00000000-0000-0000-0000-000000000000'::uuid), COALESCE(workshop_id, '00000000-0000-0000-0000-000000000000'::uuid))
  DO UPDATE SET 
    attended = true,
    attendance_time = now(),
    marked_by = marked_by_param,
    updated_at = now();

  -- Award points for attendance
  PERFORM public.award_activity_points(user_id_param, activity_type_for_points, source_id_param, description_text);
END;
$$;

-- Create view for user attendance statistics
CREATE OR REPLACE VIEW public.user_community_attendance_stats AS
SELECT 
  cat.user_id,
  cat.community_id,
  cg.name as community_name,
  COUNT(*) as total_attended,
  COUNT(*) FILTER (WHERE cat.attendance_type = 'activity') as activities_attended,
  COUNT(*) FILTER (WHERE cat.attendance_type = 'event') as events_attended,
  COUNT(*) FILTER (WHERE cat.attendance_type = 'workshop') as workshops_attended,
  ROUND(
    (COUNT(*) FILTER (WHERE cat.attended = true)::decimal / 
     NULLIF(COUNT(*), 0)) * 100, 2
  ) as attendance_percentage
FROM public.community_attendance_tracking cat
JOIN public.community_groups cg ON cat.community_id = cg.id
WHERE cat.attended = true
GROUP BY cat.user_id, cat.community_id, cg.name;
