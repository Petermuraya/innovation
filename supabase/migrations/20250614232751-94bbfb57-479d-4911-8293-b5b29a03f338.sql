
-- Create community activities table for weekly activities
CREATE TABLE IF NOT EXISTS public.community_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  community_id UUID NOT NULL REFERENCES public.community_groups(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  activity_type TEXT DEFAULT 'weekly' CHECK (activity_type IN ('weekly', 'workshop', 'meeting')),
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  location TEXT,
  max_participants INTEGER,
  registration_required BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'ongoing', 'completed', 'cancelled')),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create community learning resources table
CREATE TABLE IF NOT EXISTS public.community_learning_resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  community_id UUID NOT NULL REFERENCES public.community_groups(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  resource_type TEXT NOT NULL CHECK (resource_type IN ('document', 'video', 'link', 'tutorial', 'code')),
  resource_url TEXT NOT NULL,
  file_size BIGINT,
  tags TEXT[] DEFAULT '{}',
  difficulty_level TEXT DEFAULT 'beginner' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  is_featured BOOLEAN DEFAULT false,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create community activity attendance table
CREATE TABLE IF NOT EXISTS public.community_activity_attendance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  activity_id UUID NOT NULL REFERENCES public.community_activities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  attended BOOLEAN DEFAULT false,
  attendance_time TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  marked_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(activity_id, user_id)
);

-- Create community workshops table
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
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create workshop registrations table
CREATE TABLE IF NOT EXISTS public.workshop_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workshop_id UUID NOT NULL REFERENCES public.community_workshops(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  registration_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT DEFAULT 'registered' CHECK (status IN ('registered', 'attended', 'cancelled')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  notes TEXT,
  UNIQUE(workshop_id, user_id)
);

-- Enable RLS on all new tables
ALTER TABLE public.community_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_learning_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_activity_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workshop_registrations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for community_activities
CREATE POLICY "Anyone can view community activities" 
  ON public.community_activities 
  FOR SELECT 
  USING (true);

CREATE POLICY "Community admins can manage activities" 
  ON public.community_activities 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.community_admin_roles car
      WHERE car.user_id = auth.uid() 
      AND car.community_id = community_activities.community_id 
      AND car.is_active = true
    )
    OR 
    public.has_role_or_higher(auth.uid(), 'general_admin')
  );

-- RLS Policies for community_learning_resources
CREATE POLICY "Anyone can view learning resources" 
  ON public.community_learning_resources 
  FOR SELECT 
  USING (true);

CREATE POLICY "Community admins can manage learning resources" 
  ON public.community_learning_resources 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.community_admin_roles car
      WHERE car.user_id = auth.uid() 
      AND car.community_id = community_learning_resources.community_id 
      AND car.is_active = true
    )
    OR 
    public.has_role_or_higher(auth.uid(), 'general_admin')
  );

-- RLS Policies for community_activity_attendance
CREATE POLICY "Community admins can view attendance" 
  ON public.community_activity_attendance 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.community_admin_roles car
      JOIN public.community_activities ca ON ca.community_id = car.community_id
      WHERE car.user_id = auth.uid() 
      AND ca.id = community_activity_attendance.activity_id
      AND car.is_active = true
    )
    OR 
    public.has_role_or_higher(auth.uid(), 'general_admin')
    OR
    auth.uid() = community_activity_attendance.user_id
  );

CREATE POLICY "Community admins can manage attendance" 
  ON public.community_activity_attendance 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.community_admin_roles car
      JOIN public.community_activities ca ON ca.community_id = car.community_id
      WHERE car.user_id = auth.uid() 
      AND ca.id = community_activity_attendance.activity_id
      AND car.is_active = true
    )
    OR 
    public.has_role_or_higher(auth.uid(), 'general_admin')
  );

-- RLS Policies for community_workshops
CREATE POLICY "Anyone can view workshops" 
  ON public.community_workshops 
  FOR SELECT 
  USING (true);

CREATE POLICY "Community admins can manage workshops" 
  ON public.community_workshops 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.community_admin_roles car
      WHERE car.user_id = auth.uid() 
      AND car.community_id = community_workshops.community_id 
      AND car.is_active = true
    )
    OR 
    public.has_role_or_higher(auth.uid(), 'general_admin')
  );

-- RLS Policies for workshop_registrations
CREATE POLICY "Users can view their own workshop registrations" 
  ON public.workshop_registrations 
  FOR SELECT 
  USING (
    auth.uid() = user_id
    OR
    EXISTS (
      SELECT 1 FROM public.community_admin_roles car
      JOIN public.community_workshops cw ON cw.community_id = car.community_id
      WHERE car.user_id = auth.uid() 
      AND cw.id = workshop_registrations.workshop_id
      AND car.is_active = true
    )
    OR 
    public.has_role_or_higher(auth.uid(), 'general_admin')
  );

CREATE POLICY "Users can register for workshops" 
  ON public.workshop_registrations 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Community admins can manage workshop registrations" 
  ON public.workshop_registrations 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.community_admin_roles car
      JOIN public.community_workshops cw ON cw.community_id = car.community_id
      WHERE car.user_id = auth.uid() 
      AND cw.id = workshop_registrations.workshop_id
      AND car.is_active = true
    )
    OR 
    public.has_role_or_higher(auth.uid(), 'general_admin')
  );

-- Function to automatically notify community members about new activities/events
CREATE OR REPLACE FUNCTION public.notify_community_members()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
$$;

-- Create triggers for automatic notifications
DROP TRIGGER IF EXISTS trigger_notify_activity_created ON public.community_activities;
CREATE TRIGGER trigger_notify_activity_created
  AFTER INSERT ON public.community_activities
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_community_members();

DROP TRIGGER IF EXISTS trigger_notify_workshop_created ON public.community_workshops;
CREATE TRIGGER trigger_notify_workshop_created
  AFTER INSERT ON public.community_workshops
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_community_members();

-- Update the existing community_events trigger if it exists
DROP TRIGGER IF EXISTS trigger_notify_event_created ON public.community_events;
CREATE TRIGGER trigger_notify_event_created
  AFTER INSERT ON public.community_events
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_community_members();
