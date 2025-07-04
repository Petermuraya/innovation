
-- Complete member-centric system with proper RLS policies for public access
-- This migration ensures all user references are replaced with member references
-- and fixes RLS policies to allow public viewing of approved content

BEGIN;

-- Step 1: Ensure all necessary tables exist with proper member-centric structure
CREATE TABLE IF NOT EXISTS public.members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  email TEXT NOT NULL,
  name TEXT,
  full_name TEXT,
  phone TEXT,
  course TEXT,
  department TEXT DEFAULT 'School of Computing and Information Technology',
  year_of_study TEXT,
  avatar_url TEXT,
  registration_status TEXT NOT NULL DEFAULT 'pending' CHECK (registration_status IN ('pending', 'approved', 'rejected')),
  bio TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  portfolio_url TEXT,
  skills TEXT[],
  interests TEXT[],
  payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('paid', 'unpaid', 'partial')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.member_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'admin', 'super_admin', 'general_admin', 'community_admin', 'events_admin', 'projects_admin', 'finance_admin', 'content_admin', 'technical_admin', 'marketing_admin', 'chairman', 'vice_chairman')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role),
  UNIQUE(member_id, role)
);

-- Migrate data from user_roles to member_roles if user_roles exists
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

-- Step 2: Create/update project tables with proper member relationships
CREATE TABLE IF NOT EXISTS public.project_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID REFERENCES public.members(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  github_url TEXT,
  thumbnail_url TEXT,
  tech_tags TEXT[],
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  admin_feedback TEXT,
  reviewer_id UUID REFERENCES public.members(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create member points table
CREATE TABLE IF NOT EXISTS public.member_points (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  points INTEGER NOT NULL DEFAULT 0,
  source_id UUID,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create project interactions tables
CREATE TABLE IF NOT EXISTS public.project_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.project_submissions(id) ON DELETE CASCADE,
  member_id UUID REFERENCES public.members(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(project_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.project_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.project_submissions(id) ON DELETE CASCADE,
  member_id UUID REFERENCES public.members(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Step 3: Enable RLS on all tables
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_comments ENABLE ROW LEVEL SECURITY;

-- Step 4: Create comprehensive RLS policies for public viewing of approved content

-- Members table policies
DROP POLICY IF EXISTS "Public can view approved members" ON public.members;
DROP POLICY IF EXISTS "Members can view all members" ON public.members;
DROP POLICY IF EXISTS "Members can insert own record" ON public.members;
DROP POLICY IF EXISTS "Members can update own record" ON public.members;
DROP POLICY IF EXISTS "Admins can manage all members" ON public.members;

CREATE POLICY "Public can view approved members" ON public.members
  FOR SELECT USING (registration_status = 'approved');

CREATE POLICY "Members can insert own record" ON public.members
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Members can update own record" ON public.members
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all members" ON public.members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.member_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('super_admin', 'general_admin', 'admin')
    )
  );

-- Member roles policies
DROP POLICY IF EXISTS "Public can view member roles" ON public.member_roles;
DROP POLICY IF EXISTS "Members can view own roles" ON public.member_roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON public.member_roles;

CREATE POLICY "Public can view member roles" ON public.member_roles
  FOR SELECT USING (true);

CREATE POLICY "Members can insert roles" ON public.member_roles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage roles" ON public.member_roles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.member_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('super_admin', 'general_admin')
    )
  );

-- Project submissions policies - PUBLIC ACCESS to approved projects
DROP POLICY IF EXISTS "Public can view approved projects" ON public.project_submissions;
DROP POLICY IF EXISTS "Members can view own projects" ON public.project_submissions;
DROP POLICY IF EXISTS "Members can insert projects" ON public.project_submissions;
DROP POLICY IF EXISTS "Members can update own projects" ON public.project_submissions;
DROP POLICY IF EXISTS "Admins can manage all projects" ON public.project_submissions;

CREATE POLICY "Public can view approved projects" ON public.project_submissions
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Members can view own projects" ON public.project_submissions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Members can insert projects" ON public.project_submissions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Members can update own projects" ON public.project_submissions
  FOR UPDATE USING (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Admins can manage all projects" ON public.project_submissions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.member_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('super_admin', 'general_admin', 'projects_admin')
    )
  );

-- Member points policies - PUBLIC READ for leaderboard
DROP POLICY IF EXISTS "Public can view member points" ON public.member_points;
DROP POLICY IF EXISTS "Members can view own points" ON public.member_points;
DROP POLICY IF EXISTS "System can insert points" ON public.member_points;

CREATE POLICY "Public can view member points" ON public.member_points
  FOR SELECT USING (true);

CREATE POLICY "System can insert points" ON public.member_points
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage points" ON public.member_points
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.member_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('super_admin', 'general_admin')
    )
  );

-- Project interactions policies
CREATE POLICY "Public can view project likes" ON public.project_likes
  FOR SELECT USING (true);

CREATE POLICY "Members can manage own likes" ON public.project_likes
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Public can view project comments" ON public.project_comments
  FOR SELECT USING (true);

CREATE POLICY "Members can manage own comments" ON public.project_comments
  FOR ALL USING (auth.uid() = user_id);

-- Step 5: Create public leaderboard views
CREATE OR REPLACE VIEW public.member_leaderboard AS
SELECT 
  m.id,
  m.name,
  m.full_name,
  m.email,
  m.avatar_url,
  COALESCE(SUM(mp.points), 0) as total_points,
  COALESCE(SUM(CASE WHEN mp.activity_type = 'event_attendance' THEN mp.points END), 0) as event_points,
  COALESCE(SUM(CASE WHEN mp.activity_type = 'project_submission' THEN mp.points END), 0) as project_points,
  COALESCE(SUM(CASE WHEN mp.activity_type = 'blog_post' THEN mp.points END), 0) as blog_points,
  COALESCE(SUM(CASE WHEN mp.activity_type = 'daily_visit' THEN mp.points END), 0) as visit_points,
  COUNT(CASE WHEN mp.activity_type = 'event_attendance' THEN 1 END) as events_attended,
  COUNT(CASE WHEN mp.activity_type = 'project_submission' THEN 1 END) as projects_created,
  COUNT(CASE WHEN mp.activity_type = 'blog_post' THEN 1 END) as blogs_written,
  COUNT(CASE WHEN mp.activity_type = 'daily_visit' THEN 1 END) as visit_days,
  ROW_NUMBER() OVER (ORDER BY COALESCE(SUM(mp.points), 0) DESC) as rank
FROM public.members m
LEFT JOIN public.member_points mp ON mp.member_id = m.id
WHERE m.registration_status = 'approved'
GROUP BY m.id, m.name, m.full_name, m.email, m.avatar_url
ORDER BY total_points DESC;

CREATE OR REPLACE VIEW public.project_leaderboard AS
SELECT 
  ps.id,
  ps.title,
  ps.description,
  ps.github_url,
  ps.thumbnail_url,
  ps.tech_tags,
  ps.status,
  ps.created_at,
  ps.updated_at,
  m.name as author_name,
  m.full_name as author_full_name,
  COALESCE(like_counts.likes_count, 0) as likes_count,
  COALESCE(comment_counts.comments_count, 0) as comments_count,
  COALESCE(like_counts.likes_count, 0) * 3 + COALESCE(comment_counts.comments_count, 0) * 2 as engagement_score
FROM public.project_submissions ps
LEFT JOIN public.members m ON m.id = ps.member_id
LEFT JOIN (
  SELECT project_id, COUNT(*) as likes_count
  FROM public.project_likes
  GROUP BY project_id
) like_counts ON like_counts.project_id = ps.id
LEFT JOIN (
  SELECT project_id, COUNT(*) as comments_count
  FROM public.project_comments
  GROUP BY project_id
) comment_counts ON comment_counts.project_id = ps.id
WHERE ps.status = 'approved'
ORDER BY engagement_score DESC;

-- Step 6: Grant public access to views and tables
GRANT SELECT ON public.member_leaderboard TO anon, authenticated;
GRANT SELECT ON public.project_leaderboard TO anon, authenticated;
GRANT SELECT ON public.members TO anon, authenticated;
GRANT SELECT ON public.project_submissions TO anon, authenticated;
GRANT SELECT ON public.member_points TO anon, authenticated;
GRANT SELECT ON public.project_likes TO anon, authenticated;
GRANT SELECT ON public.project_comments TO anon, authenticated;

-- Allow insert/update for authenticated users where appropriate
GRANT INSERT, UPDATE ON public.members TO authenticated;
GRANT INSERT, UPDATE ON public.project_submissions TO authenticated;
GRANT INSERT, DELETE ON public.project_likes TO authenticated;
GRANT INSERT, UPDATE ON public.project_comments TO authenticated;

-- Step 7: Drop old user tables if they exist (keeping auth.users)
DROP TABLE IF EXISTS public.user_roles CASCADE;
DROP VIEW IF EXISTS public.user_roles_with_hierarchy CASCADE;

-- Step 8: Create updated trigger for member registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_member_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_member_registration() CASCADE;
DROP FUNCTION IF EXISTS public.handle_complete_user_registration() CASCADE;

CREATE OR REPLACE FUNCTION public.handle_member_registration()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  member_full_name TEXT;
  member_phone TEXT;
  member_course TEXT;
  member_department TEXT;
  new_member_id UUID;
BEGIN
  -- Extract metadata safely
  member_full_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name', 
    NEW.raw_user_meta_data->>'fullName', 
    SPLIT_PART(NEW.email, '@', 1)
  );
  
  member_phone := COALESCE(NEW.raw_user_meta_data->>'phone', '');
  member_course := COALESCE(NEW.raw_user_meta_data->>'course', '');
  member_department := COALESCE(
    NEW.raw_user_meta_data->>'department', 
    'School of Computing and Information Technology'
  );

  -- Insert into members table
  INSERT INTO public.members (
    user_id, email, name, full_name, phone, course, department, registration_Status
  ) VALUES (
    NEW.id, NEW.email, member_full_name, member_full_name, member_phone, member_course, member_department, 'pending'
  ) RETURNING id INTO new_member_id;

  -- Insert default member role
  INSERT INTO public.member_roles (member_id, user_id, role)
  VALUES (new_member_id, NEW.id, 'member')
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;

EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't prevent user creation
    RAISE LOG 'Error in member registration trigger for %: %', NEW.email, SQLERRM;
    RETURN NEW;
END;
$$;

-- Create the trigger
CREATE TRIGGER on_auth_member_registration
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_member_registration();

-- Step 9: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_members_user_id ON public.members(user_id);
CREATE INDEX IF NOT EXISTS idx_members_registration_status ON public.members(registration_status);
CREATE INDEX IF NOT EXISTS idx_member_roles_user_id ON public.member_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_member_roles_member_id ON public.member_roles(member_id);
CREATE INDEX IF NOT EXISTS idx_project_submissions_status ON public.project_submissions(status);
CREATE INDEX IF NOT EXISTS idx_project_submissions_member_id ON public.project_submissions(member_id);
CREATE INDEX IF NOT EXISTS idx_member_points_member_id ON public.member_points(member_id);

COMMIT;
