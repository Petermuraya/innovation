
-- Create table for scheduled online meetings
CREATE TABLE public.community_online_meetings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  community_id UUID NOT NULL REFERENCES public.community_groups(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  meeting_link TEXT NOT NULL,
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  max_participants INTEGER,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'ongoing', 'completed', 'cancelled'))
);

-- Enable RLS
ALTER TABLE public.community_online_meetings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for online meetings
CREATE POLICY "Community members can view meetings" 
  ON public.community_online_meetings 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.community_memberships cm
      WHERE cm.user_id = auth.uid() 
      AND cm.community_id = community_online_meetings.community_id
      AND cm.status = 'active'
    )
    OR 
    public.has_role_or_higher(auth.uid(), 'general_admin')
  );

CREATE POLICY "Community admins can manage meetings" 
  ON public.community_online_meetings 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.community_admin_roles car
      WHERE car.user_id = auth.uid() 
      AND car.community_id = community_online_meetings.community_id
      AND car.is_active = true
    )
    OR 
    public.has_role_or_higher(auth.uid(), 'general_admin')
  );

-- Create table to track meeting attendance via links
CREATE TABLE public.meeting_link_attendance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  meeting_id UUID NOT NULL REFERENCES public.community_online_meetings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  points_awarded BOOLEAN DEFAULT false,
  UNIQUE(meeting_id, user_id) -- Ensure one user can only join each meeting once
);

-- Enable RLS
ALTER TABLE public.meeting_link_attendance ENABLE ROW LEVEL SECURITY;

-- RLS Policies for meeting attendance
CREATE POLICY "Users can view their own attendance" 
  ON public.meeting_link_attendance 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can record their own attendance" 
  ON public.meeting_link_attendance 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Community admins can view all attendance" 
  ON public.meeting_link_attendance 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.community_online_meetings com
      JOIN public.community_admin_roles car ON car.community_id = com.community_id
      WHERE com.id = meeting_link_attendance.meeting_id
      AND car.user_id = auth.uid() 
      AND car.is_active = true
    )
    OR 
    public.has_role_or_higher(auth.uid(), 'general_admin')
  );

-- Add point configuration for meeting attendance
INSERT INTO public.point_configurations (activity_type, points_value, description, is_active) 
VALUES ('online_meeting_attendance', 30, 'Attending online community meetings', true)
ON CONFLICT (activity_type) DO NOTHING;

-- Create function to record meeting attendance and award points
CREATE OR REPLACE FUNCTION public.record_meeting_attendance(meeting_id_param uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_id_param uuid := auth.uid();
  community_id_param uuid;
  meeting_title text;
  already_attended boolean;
  result jsonb;
BEGIN
  -- Check if user is authenticated
  IF user_id_param IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'User not authenticated');
  END IF;

  -- Get meeting details
  SELECT com.community_id, com.title INTO community_id_param, meeting_title
  FROM public.community_online_meetings com
  WHERE com.id = meeting_id_param;

  IF community_id_param IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'Meeting not found');
  END IF;

  -- Check if user is a member of the community
  IF NOT EXISTS (
    SELECT 1 FROM public.community_memberships cm
    WHERE cm.user_id = user_id_param 
    AND cm.community_id = community_id_param
    AND cm.status = 'active'
  ) THEN
    RETURN jsonb_build_object('success', false, 'message', 'User is not a member of this community');
  END IF;

  -- Check if user already attended this meeting
  SELECT EXISTS(
    SELECT 1 FROM public.meeting_link_attendance mla
    WHERE mla.meeting_id = meeting_id_param AND mla.user_id = user_id_param
  ) INTO already_attended;

  IF already_attended THEN
    RETURN jsonb_build_object('success', false, 'message', 'You have already joined this meeting');
  END IF;

  -- Record attendance
  INSERT INTO public.meeting_link_attendance (meeting_id, user_id, points_awarded)
  VALUES (meeting_id_param, user_id_param, true);

  -- Award points for meeting attendance
  PERFORM public.award_activity_points(
    user_id_param, 
    'online_meeting_attendance', 
    meeting_id_param, 
    'Attended online meeting: ' || meeting_title
  );

  -- Also record in community attendance tracking
  INSERT INTO public.community_attendance_tracking (
    user_id, 
    community_id, 
    attendance_type, 
    attended, 
    attendance_time, 
    marked_by
  )
  VALUES (
    user_id_param, 
    community_id_param, 
    'meeting', 
    true, 
    now(), 
    user_id_param
  );

  RETURN jsonb_build_object('success', true, 'message', 'Meeting attendance recorded and points awarded');
END;
$$;

-- Create view for meeting statistics
CREATE OR REPLACE VIEW public.community_meeting_stats AS
SELECT 
  com.id as meeting_id,
  com.community_id,
  com.title,
  com.scheduled_date,
  com.status,
  COUNT(mla.user_id) as total_attendees,
  SUM(CASE WHEN mla.points_awarded THEN 1 ELSE 0 END) as points_awarded_count
FROM public.community_online_meetings com
LEFT JOIN public.meeting_link_attendance mla ON com.id = mla.meeting_id
GROUP BY com.id, com.community_id, com.title, com.scheduled_date, com.status;
