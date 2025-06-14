
-- Create a table to store point configuration that admins can manage
CREATE TABLE public.point_configurations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  activity_type text NOT NULL UNIQUE,
  points_value integer NOT NULL DEFAULT 0,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Insert default point configurations
INSERT INTO public.point_configurations (activity_type, points_value, description) VALUES
('event_attendance', 10, 'Points awarded for attending an event'),
('project_submission', 25, 'Points awarded for submitting a project'),
('blog_post', 15, 'Points awarded for writing a blog post'),
('website_visit', 1, 'Points awarded for daily website visit'),
('semester_subscription', 100, 'Points awarded for semester subscription payment'),
('project_approval', 50, 'Bonus points when project gets approved'),
('blog_approval', 30, 'Bonus points when blog gets approved');

-- Add website visit tracking table
CREATE TABLE public.user_website_visits (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  visit_date date NOT NULL DEFAULT CURRENT_DATE,
  visit_count integer DEFAULT 1,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, visit_date)
);

-- Add columns to member_points table for better tracking
ALTER TABLE public.member_points 
ADD COLUMN IF NOT EXISTS activity_type text,
ADD COLUMN IF NOT EXISTS activity_date date DEFAULT CURRENT_DATE;

-- Enable RLS on new tables
ALTER TABLE public.point_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_website_visits ENABLE ROW LEVEL SECURITY;

-- RLS policies for point_configurations (only admins can modify, everyone can read)
CREATE POLICY "Everyone can view point configurations" 
  ON public.point_configurations 
  FOR SELECT 
  USING (true);

CREATE POLICY "Only admins can modify point configurations" 
  ON public.point_configurations 
  FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS policies for user_website_visits
CREATE POLICY "Users can view their own website visits" 
  ON public.user_website_visits 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own website visits" 
  ON public.user_website_visits 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own website visits" 
  ON public.user_website_visits 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Function to award points based on configuration
CREATE OR REPLACE FUNCTION public.award_activity_points(
  user_id_param uuid,
  activity_type_param text,
  source_id_param uuid DEFAULT NULL,
  description_param text DEFAULT NULL
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  points_to_award integer;
  config_description text;
BEGIN
  -- Get points value from configuration
  SELECT points_value, description INTO points_to_award, config_description
  FROM public.point_configurations
  WHERE activity_type = activity_type_param AND is_active = true;
  
  -- Only award points if configuration exists and is active
  IF points_to_award IS NOT NULL AND points_to_award > 0 THEN
    INSERT INTO public.member_points (
      user_id, 
      points, 
      source, 
      source_id, 
      description,
      activity_type,
      activity_date
    )
    VALUES (
      user_id_param,
      points_to_award,
      activity_type_param,
      source_id_param,
      COALESCE(description_param, config_description),
      activity_type_param,
      CURRENT_DATE
    );
  END IF;
END;
$$;

-- Function to track website visits and award points
CREATE OR REPLACE FUNCTION public.track_website_visit(user_id_param uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  visit_exists boolean;
BEGIN
  -- Check if user already visited today
  SELECT EXISTS(
    SELECT 1 FROM public.user_website_visits
    WHERE user_id = user_id_param AND visit_date = CURRENT_DATE
  ) INTO visit_exists;
  
  IF visit_exists THEN
    -- Update visit count
    UPDATE public.user_website_visits
    SET visit_count = visit_count + 1, updated_at = now()
    WHERE user_id = user_id_param AND visit_date = CURRENT_DATE;
    RETURN false; -- No points awarded for multiple visits same day
  ELSE
    -- Insert new visit record
    INSERT INTO public.user_website_visits (user_id, visit_date)
    VALUES (user_id_param, CURRENT_DATE);
    
    -- Award points for daily visit
    PERFORM public.award_activity_points(user_id_param, 'website_visit', NULL, 'Daily website visit');
    RETURN true; -- Points awarded
  END IF;
END;
$$;

-- Enhanced leaderboard view with activity breakdown
CREATE OR REPLACE VIEW public.enhanced_member_leaderboard AS
SELECT 
  m.user_id,
  m.name,
  m.email,
  m.avatar_url,
  COALESCE(total_points.points, 0) as total_points,
  COALESCE(event_points.points, 0) as event_points,
  COALESCE(project_points.points, 0) as project_points,
  COALESCE(blog_points.points, 0) as blog_points,
  COALESCE(visit_points.points, 0) as visit_points,
  COALESCE(subscription_points.points, 0) as subscription_points,
  COALESCE(events_attended.count, 0) as events_attended,
  COALESCE(projects_created.count, 0) as projects_created,
  COALESCE(blogs_written.count, 0) as blogs_written,
  COALESCE(visit_days.count, 0) as visit_days,
  COALESCE(subscriptions.count, 0) as subscriptions_made,
  ROW_NUMBER() OVER (ORDER BY COALESCE(total_points.points, 0) DESC) as rank
FROM public.members m
LEFT JOIN (
  SELECT user_id, SUM(points) as points
  FROM public.member_points
  GROUP BY user_id
) total_points ON m.user_id = total_points.user_id
LEFT JOIN (
  SELECT user_id, SUM(points) as points
  FROM public.member_points
  WHERE activity_type = 'event_attendance'
  GROUP BY user_id
) event_points ON m.user_id = event_points.user_id
LEFT JOIN (
  SELECT user_id, SUM(points) as points
  FROM public.member_points
  WHERE activity_type IN ('project_submission', 'project_approval')
  GROUP BY user_id
) project_points ON m.user_id = project_points.user_id
LEFT JOIN (
  SELECT user_id, SUM(points) as points
  FROM public.member_points
  WHERE activity_type IN ('blog_post', 'blog_approval')
  GROUP BY user_id
) blog_points ON m.user_id = blog_points.user_id
LEFT JOIN (
  SELECT user_id, SUM(points) as points
  FROM public.member_points
  WHERE activity_type = 'website_visit'
  GROUP BY user_id
) visit_points ON m.user_id = visit_points.user_id
LEFT JOIN (
  SELECT user_id, SUM(points) as points
  FROM public.member_points
  WHERE activity_type = 'semester_subscription'
  GROUP BY user_id
) subscription_points ON m.user_id = subscription_points.user_id
LEFT JOIN (
  SELECT user_id, COUNT(*) as count
  FROM public.event_attendance
  GROUP BY user_id
) events_attended ON m.user_id = events_attended.user_id
LEFT JOIN (
  SELECT user_id, COUNT(*) as count
  FROM public.project_submissions
  GROUP BY user_id
) projects_created ON m.user_id = projects_created.user_id
LEFT JOIN (
  SELECT user_id, COUNT(*) as count
  FROM public.blogs
  WHERE status = 'published'
  GROUP BY user_id
) blogs_written ON m.user_id = blogs_written.user_id
LEFT JOIN (
  SELECT user_id, COUNT(DISTINCT visit_date) as count
  FROM public.user_website_visits
  GROUP BY user_id
) visit_days ON m.user_id = visit_days.user_id
LEFT JOIN (
  SELECT user_id, COUNT(*) as count
  FROM public.mpesa_payments
  WHERE status = 'completed' AND payment_type = 'subscription'
  GROUP BY user_id
) subscriptions ON m.user_id = subscriptions.user_id
WHERE m.registration_status = 'approved'
ORDER BY total_points DESC;
