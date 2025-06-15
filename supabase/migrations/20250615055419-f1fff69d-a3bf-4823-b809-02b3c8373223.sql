
-- Create notification targets table to track who notifications are sent to
CREATE TABLE public.notification_targets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  notification_id UUID NOT NULL,
  target_type TEXT NOT NULL CHECK (target_type IN ('all', 'individual', 'community')),
  target_id UUID, -- user_id for individual, community_id for community, null for all
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notification templates table for pre-set notifications
CREATE TABLE public.notification_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'announcement',
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  category TEXT NOT NULL DEFAULT 'general',
  is_active BOOLEAN DEFAULT true,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Update notifications table to include admin control fields
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS created_by UUID;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS is_admin_notification BOOLEAN DEFAULT false;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS target_type TEXT DEFAULT 'individual';
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS scheduled_for TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS is_draft BOOLEAN DEFAULT false;

-- Add foreign key constraints
ALTER TABLE public.notification_targets 
ADD CONSTRAINT fk_notification_targets_notification 
FOREIGN KEY (notification_id) REFERENCES public.notifications(id) ON DELETE CASCADE;

-- Enable RLS on new tables
ALTER TABLE public.notification_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_templates ENABLE ROW LEVEL SECURITY;

-- RLS policies for notification_targets
CREATE POLICY "Admins can manage notification targets" ON public.notification_targets
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('super_admin', 'general_admin', 'chairman', 'vice_chairman')
  )
);

-- RLS policies for notification_templates
CREATE POLICY "Admins can manage notification templates" ON public.notification_templates
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('super_admin', 'general_admin', 'chairman', 'vice_chairman')
  )
);

-- Create function to send bulk notifications
CREATE OR REPLACE FUNCTION public.send_bulk_notification(
  p_title TEXT,
  p_message TEXT,
  p_type TEXT DEFAULT 'announcement',
  p_priority TEXT DEFAULT 'medium',
  p_target_type TEXT DEFAULT 'all',
  p_target_ids UUID[] DEFAULT NULL,
  p_scheduled_for TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'::jsonb
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  notification_id UUID;
  target_id UUID;
  user_ids UUID[];
BEGIN
  -- Check if user is admin
  IF NOT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('super_admin', 'general_admin', 'chairman', 'vice_chairman')
  ) THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required';
  END IF;

  -- Create the notification record
  INSERT INTO public.notifications (
    title, message, type, priority, metadata, created_by, 
    is_admin_notification, target_type, scheduled_for,
    is_draft, user_id
  ) VALUES (
    p_title, p_message, p_type, p_priority, p_metadata, 
    auth.uid(), true, p_target_type, p_scheduled_for,
    CASE WHEN p_scheduled_for IS NOT NULL THEN true ELSE false END,
    auth.uid() -- Temporary, will be updated below
  ) RETURNING id INTO notification_id;

  -- Determine target users based on target_type
  IF p_target_type = 'all' THEN
    -- Get all approved members
    SELECT ARRAY_AGG(user_id) INTO user_ids
    FROM public.members 
    WHERE registration_status = 'approved';
    
    INSERT INTO public.notification_targets (notification_id, target_type)
    VALUES (notification_id, 'all');
    
  ELSIF p_target_type = 'individual' AND p_target_ids IS NOT NULL THEN
    user_ids := p_target_ids;
    
    FOREACH target_id IN ARRAY p_target_ids LOOP
      INSERT INTO public.notification_targets (notification_id, target_type, target_id)
      VALUES (notification_id, 'individual', target_id);
    END LOOP;
    
  ELSIF p_target_type = 'community' AND p_target_ids IS NOT NULL THEN
    -- Get all users in specified communities
    SELECT ARRAY_AGG(DISTINCT cm.user_id) INTO user_ids
    FROM public.community_memberships cm
    WHERE cm.community_id = ANY(p_target_ids)
    AND cm.status = 'active';
    
    FOREACH target_id IN ARRAY p_target_ids LOOP
      INSERT INTO public.notification_targets (notification_id, target_type, target_id)
      VALUES (notification_id, 'community', target_id);
    END LOOP;
  END IF;

  -- Create individual notification records for each user (if not scheduled)
  IF p_scheduled_for IS NULL AND user_ids IS NOT NULL THEN
    FOREACH target_id IN ARRAY user_ids LOOP
      INSERT INTO public.notifications (
        user_id, title, message, type, priority, metadata,
        created_by, is_admin_notification, target_type
      ) VALUES (
        target_id, p_title, p_message, p_type, p_priority, p_metadata,
        auth.uid(), true, p_target_type
      );
    END LOOP;
    
    -- Delete the template notification
    DELETE FROM public.notifications WHERE id = notification_id;
  END IF;

  RETURN notification_id;
END;
$$;

-- Insert some default notification templates
INSERT INTO public.notification_templates (title, message, type, priority, category) VALUES
('Welcome to the Innovation Club', 'Welcome to our community! We''re excited to have you join us on this innovative journey.', 'announcement', 'medium', 'welcome'),
('Event Reminder', 'Don''t forget about the upcoming event. Your participation is important to us!', 'event', 'high', 'events'),
('Payment Due', 'Your membership payment is due. Please complete your payment to continue enjoying our services.', 'payment', 'high', 'payments'),
('Project Submission Deadline', 'Reminder: Project submissions are due soon. Submit your projects before the deadline.', 'alert', 'urgent', 'projects'),
('Community Meeting', 'Join us for our weekly community meeting. Your voice matters in our discussions.', 'announcement', 'medium', 'meetings'),
('Achievement Unlocked', 'Congratulations! You''ve achieved a new milestone in your journey with us.', 'achievement', 'high', 'achievements');
