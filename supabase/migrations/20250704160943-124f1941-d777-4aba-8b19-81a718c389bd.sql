
-- First, let's create the communities table with the specific communities you mentioned
INSERT INTO public.community_groups (id, name, description, meeting_schedule, is_active) VALUES
  ('web-dev', 'Web Development', 'Frontend and backend web development community focusing on modern web technologies', 'Weekly on Fridays at 6:00 PM', true),
  ('cybersecurity', 'Cybersecurity', 'Information security, ethical hacking, and cybersecurity best practices', 'Bi-weekly on Wednesdays at 7:00 PM', true),
  ('mobile-dev', 'Mobile Development', 'iOS, Android, and cross-platform mobile app development', 'Weekly on Thursdays at 6:30 PM', true),
  ('iot', 'Internet of Things (IoT)', 'Connected devices, sensors, and IoT system development', 'Weekly on Tuesdays at 7:00 PM', true),
  ('ml-ai', 'Machine Learning & Artificial Intelligence (ML/AI)', 'Machine learning algorithms, AI models, and data science', 'Bi-weekly on Saturdays at 10:00 AM', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  meeting_schedule = EXCLUDED.meeting_schedule,
  updated_at = now();

-- Create community_activities table for community-specific activities
CREATE TABLE IF NOT EXISTS public.community_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  community_id UUID NOT NULL REFERENCES public.community_groups(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  activity_type TEXT DEFAULT 'workshop'::text,
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  location TEXT,
  max_participants INTEGER,
  registration_required BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'scheduled'::text,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create community_workshops table for workshops
CREATE TABLE IF NOT EXISTS public.community_workshops (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  community_id UUID NOT NULL REFERENCES public.community_groups(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  instructor_name TEXT,
  instructor_bio TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  max_participants INTEGER DEFAULT 30,
  registration_fee NUMERIC DEFAULT 0,
  requirements TEXT[],
  learning_outcomes TEXT[],
  status TEXT DEFAULT 'upcoming'::text,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create community_learning_resources table
CREATE TABLE IF NOT EXISTS public.community_learning_resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  community_id UUID NOT NULL REFERENCES public.community_groups(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  resource_type TEXT NOT NULL,
  resource_url TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  difficulty_level TEXT DEFAULT 'beginner'::text,
  file_size BIGINT,
  is_featured BOOLEAN DEFAULT false,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create community_online_meetings table for online meetings
CREATE TABLE IF NOT EXISTS public.community_online_meetings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  community_id UUID NOT NULL REFERENCES public.community_groups(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  meeting_link TEXT NOT NULL,
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  max_participants INTEGER,
  status TEXT DEFAULT 'scheduled'::text,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create meeting_link_attendance table to track online meeting attendance
CREATE TABLE IF NOT EXISTS public.meeting_link_attendance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  meeting_id UUID NOT NULL REFERENCES public.community_online_meetings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  points_awarded BOOLEAN DEFAULT false,
  UNIQUE(meeting_id, user_id)
);

-- Enable RLS on all new tables
ALTER TABLE public.community_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_learning_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_online_meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_link_attendance ENABLE ROW LEVEL SECURITY;

-- RLS Policies for community_activities
CREATE POLICY "Anyone can view community activities" ON public.community_activities FOR SELECT USING (true);

-- RLS Policies for community_workshops
CREATE POLICY "Anyone can view workshops" ON public.community_workshops FOR SELECT USING (true);

-- RLS Policies for community_learning_resources
CREATE POLICY "Anyone can view learning resources" ON public.community_learning_resources FOR SELECT USING (true);

-- RLS Policies for community_online_meetings
CREATE POLICY "Community members can view meetings" ON public.community_online_meetings FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.community_memberships cm
    WHERE cm.community_id = community_online_meetings.community_id
    AND cm.user_id = auth.uid()
    AND cm.status = 'active'
  )
);

-- RLS Policies for meeting_link_attendance
CREATE POLICY "Users can view their own attendance" ON public.meeting_link_attendance FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can record their own attendance" ON public.meeting_link_attendance FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Add trigger to check membership limit (max 3 communities)
CREATE OR REPLACE FUNCTION public.check_membership_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM public.community_memberships 
      WHERE user_id = NEW.user_id AND status = 'active') >= 3 THEN
    RAISE EXCEPTION 'User cannot join more than 3 communities';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER membership_limit_trigger
  BEFORE INSERT ON public.community_memberships
  FOR EACH ROW
  EXECUTE FUNCTION public.check_membership_limit();

-- Create triggers for community notifications
CREATE OR REPLACE FUNCTION public.notify_community_members()
RETURNS TRIGGER AS $$
DECLARE
  member_record RECORD;
  notification_title TEXT;
  notification_message TEXT;
  notification_type TEXT;
BEGIN
  -- Determine notification details based on table
  IF TG_TABLE_NAME = 'community_activities' THEN
    notification_title := 'New Community Activity: ' || NEW.title;
    notification_message := 'A new activity has been scheduled in your community: ' || NEW.description;
    notification_type := 'activity';
  ELSIF TG_TABLE_NAME = 'community_events' THEN
    notification_title := 'New Community Event: ' || NEW.title;
    notification_message := 'A new event has been scheduled in your community: ' || NEW.description;
    notification_type := 'event';
  ELSIF TG_TABLE_NAME = 'community_workshops' THEN
    notification_title := 'New Workshop: ' || NEW.title;
    notification_message := 'A new workshop is available for registration: ' || NEW.description;
    notification_type := 'workshop';
  ELSE
    RETURN NEW;
  END IF;

  -- Get all community members and send notifications
  FOR member_record IN 
    SELECT cm.user_id 
    FROM public.community_memberships cm 
    WHERE cm.community_id = NEW.community_id 
    AND cm.status = 'active'
  LOOP
    INSERT INTO public.notifications (
      user_id,
      title,
      message,
      type,
      priority,
      metadata
    ) VALUES (
      member_record.user_id,
      notification_title,
      notification_message,
      notification_type,
      'medium',
      jsonb_build_object(
        'community_id', NEW.community_id,
        'item_id', NEW.id,
        'item_type', TG_TABLE_NAME
      )
    );
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for notifications
CREATE TRIGGER notify_community_activities
  AFTER INSERT ON public.community_activities
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_community_members();

CREATE TRIGGER notify_community_workshops
  AFTER INSERT ON public.community_workshops
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_community_members();
