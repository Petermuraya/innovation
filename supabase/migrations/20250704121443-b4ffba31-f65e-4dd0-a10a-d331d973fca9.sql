
-- Complete migration from user-based to member-based system
-- This migration will rename tables, update foreign keys, and fix all relationships

BEGIN;

-- Step 1: Create member_roles table (since you mentioned it was renamed)
CREATE TABLE IF NOT EXISTS public.member_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role),
  UNIQUE(member_id, role)
);

-- Step 2: Create member_website_visits table (since you mentioned it was renamed)
CREATE TABLE IF NOT EXISTS public.member_website_visits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  visit_date DATE NOT NULL DEFAULT CURRENT_DATE,
  visit_count INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, visit_date)
);

-- Step 3: Migrate data from user_roles to member_roles if user_roles still exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_roles') THEN
    INSERT INTO public.member_roles (member_id, user_id, role, created_at, updated_at)
    SELECT 
      m.id as member_id,
      ur.user_id,
      ur.role,
      ur.created_at,
      ur.updated_at
    FROM public.user_roles ur
    JOIN public.members m ON m.user_id = ur.user_id
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END
$$;

-- Step 4: Migrate data from user_website_visits to member_website_visits if it exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_website_visits') THEN
    INSERT INTO public.member_website_visits (member_id, user_id, visit_date, visit_count, created_at, updated_at)
    SELECT 
      m.id as member_id,
      uwv.user_id,
      uwv.visit_date,
      uwv.visit_count,
      uwv.created_at,
      uwv.updated_at
    FROM public.user_website_visits uwv
    JOIN public.members m ON m.user_id = uwv.user_id
    ON CONFLICT (user_id, visit_date) DO NOTHING;
  END IF;
END
$$;

-- Step 5: Update member_points table to include member_id reference
ALTER TABLE public.member_points 
ADD COLUMN IF NOT EXISTS member_id UUID REFERENCES public.members(id) ON DELETE CASCADE;

-- Update member_points to populate member_id
UPDATE public.member_points 
SET member_id = m.id
FROM public.members m
WHERE member_points.user_id = m.user_id
AND member_points.member_id IS NULL;

-- Step 6: Update project_submissions to include member_id
ALTER TABLE public.project_submissions 
ADD COLUMN IF NOT EXISTS member_id UUID REFERENCES public.members(id) ON DELETE CASCADE;

-- Update project_submissions to populate member_id
UPDATE public.project_submissions 
SET member_id = m.id
FROM public.members m
WHERE project_submissions.user_id = m.user_id
AND project_submissions.member_id IS NULL;

-- Step 7: Update other tables to include member_id references
ALTER TABLE public.project_likes 
ADD COLUMN IF NOT EXISTS member_id UUID REFERENCES public.members(id) ON DELETE CASCADE;

UPDATE public.project_likes 
SET member_id = m.id
FROM public.members m
WHERE project_likes.user_id = m.user_id
AND project_likes.member_id IS NULL;

ALTER TABLE public.project_comments 
ADD COLUMN IF NOT EXISTS member_id UUID REFERENCES public.members(id) ON DELETE CASCADE;

UPDATE public.project_comments 
SET member_id = m.id
FROM public.members m
WHERE project_comments.user_id = m.user_id
AND project_comments.member_id IS NULL;

-- Step 8: Enable RLS on new tables
ALTER TABLE public.member_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_website_visits ENABLE ROW LEVEL SECURITY;

-- Step 9: Create RLS policies for member_roles
DROP POLICY IF EXISTS "Public can view member roles" ON public.member_roles;
DROP POLICY IF EXISTS "Members can insert roles" ON public.member_roles;
DROP POLICY IF EXISTS "Members can view own roles" ON public.member_roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON public.member_roles;

CREATE POLICY "Public can view member roles" ON public.member_roles
  FOR SELECT USING (true);

CREATE POLICY "Members can insert roles" ON public.member_roles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Members can view own roles" ON public.member_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage roles" ON public.member_roles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.member_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('super_admin', 'general_admin', 'admin')
    )
  );

-- Step 10: Create RLS policies for member_website_visits
CREATE POLICY "Members can manage own visits" ON public.member_website_visits
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "System can create visits" ON public.member_website_visits
  FOR INSERT WITH CHECK (true);

-- Step 11: Update function to use member tables
CREATE OR REPLACE FUNCTION public.track_member_website_visit(user_id_param uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  visit_exists boolean;
  member_id_param uuid;
BEGIN
  -- Get member_id from user_id
  SELECT id INTO member_id_param FROM public.members WHERE user_id = user_id_param;
  
  IF member_id_param IS NULL THEN
    RETURN false;
  END IF;

  -- Check if user already visited today
  SELECT EXISTS(
    SELECT 1 FROM public.member_website_visits
    WHERE user_id = user_id_param AND visit_date = CURRENT_DATE
  ) INTO visit_exists;
  
  IF visit_exists THEN
    -- Update visit count
    UPDATE public.member_website_visits
    SET visit_count = visit_count + 1, updated_at = now()
    WHERE user_id = user_id_param AND visit_date = CURRENT_DATE;
    RETURN false; -- No points awarded for multiple visits same day
  ELSE
    -- Insert new visit record
    INSERT INTO public.member_website_visits (member_id, user_id, visit_date)
    VALUES (member_id_param, user_id_param, CURRENT_DATE);
    
    -- Award points for daily visit
    PERFORM public.award_activity_points(user_id_param, 'website_visit', NULL, 'Daily website visit');
    RETURN true; -- Points awarded
  END IF;
END;
$$;

-- Step 12: Update enhanced member leaderboard view
DROP VIEW IF EXISTS public.enhanced_member_leaderboard;

CREATE OR REPLACE VIEW public.enhanced_member_leaderboard AS
SELECT 
  m.user_id,
  m.name,
  m.email,
  m.avatar_url,
  m.registration_status,
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
  ROW_NUMBER() OVER (ORDER BY COALESCE(total_points.points, 0) DESC, m.created_at ASC) as rank
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
  FROM public.member_points
  WHERE activity_type = 'event_attendance'
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
  FROM public.member_website_visits
  GROUP BY user_id
) visit_days ON m.user_id = visit_days.user_id
LEFT JOIN (
  SELECT user_id, COUNT(*) as count
  FROM public.member_points
  WHERE activity_type = 'semester_subscription'
  GROUP BY user_id
) subscriptions ON m.user_id = subscriptions.user_id
WHERE m.registration_status = 'approved'
ORDER BY total_points DESC, m.created_at ASC;

-- Step 13: Grant permissions
GRANT SELECT ON public.enhanced_member_leaderboard TO authenticated;
GRANT SELECT ON public.enhanced_member_leaderboard TO anon;
GRANT SELECT, INSERT, UPDATE ON public.member_roles TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.member_website_visits TO authenticated;

-- Step 14: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_member_roles_user_id ON public.member_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_member_roles_member_id ON public.member_roles(member_id);
CREATE INDEX IF NOT EXISTS idx_member_website_visits_user_id ON public.member_website_visits(user_id);
CREATE INDEX IF NOT EXISTS idx_member_website_visits_member_id ON public.member_website_visits(member_id);
CREATE INDEX IF NOT EXISTS idx_member_points_member_id ON public.member_points(member_id);
CREATE INDEX IF NOT EXISTS idx_project_submissions_member_id ON public.project_submissions(member_id);

-- Step 15: Drop old tables if they exist (optional - uncomment if you want to remove them)
-- DROP TABLE IF EXISTS public.user_roles CASCADE;
-- DROP TABLE IF EXISTS public.user_website_visits CASCADE;

COMMIT;
