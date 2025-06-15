
-- First, drop ALL storage policies that might reference roles
DO $$
DECLARE
    policy_name TEXT;
BEGIN
    -- Get all policy names on storage.objects and drop them
    FOR policy_name IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'storage' AND tablename = 'objects'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || policy_name || '" ON storage.objects';
    END LOOP;
END $$;

-- Also drop any policies on other storage tables
DO $$
DECLARE
    policy_name TEXT;
    table_name TEXT;
BEGIN
    -- Get all policy names on all storage tables and drop them
    FOR policy_name, table_name IN 
        SELECT policyname, tablename
        FROM pg_policies 
        WHERE schemaname = 'storage'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || policy_name || '" ON storage.' || table_name;
    END LOOP;
END $$;

-- Drop ALL policies that might reference roles on public tables
DO $$
DECLARE
    policy_name TEXT;
    table_name TEXT;
BEGIN
    -- Get all policy names that might reference roles and drop them
    FOR policy_name, table_name IN 
        SELECT policyname, tablename
        FROM pg_policies p
        WHERE p.schemaname = 'public'
        AND (
            p.policyname ILIKE '%admin%' 
            OR p.policyname ILIKE '%role%'
            OR EXISTS (
                SELECT 1 FROM pg_depend d
                JOIN pg_class c ON d.objid = c.oid
                JOIN pg_attribute a ON c.oid = a.attrelid
                WHERE d.refobjid = (
                    SELECT oid FROM pg_class 
                    WHERE relname = 'user_roles' 
                    AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
                )
                AND a.attname = 'role'
                AND c.relname = p.tablename
            )
        )
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || policy_name || '" ON public.' || table_name;
    END LOOP;
END $$;

-- Explicitly drop known policies that reference roles
DROP POLICY IF EXISTS "Admins can manage all blogs" ON public.blogs;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage all submissions" ON public.user_submissions;
DROP POLICY IF EXISTS "Admins can view relevant submissions" ON public.user_submissions;
DROP POLICY IF EXISTS "Admins can manage all events" ON public.events;
DROP POLICY IF EXISTS "Admins can manage all projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can manage all certificates" ON public.certificates;
DROP POLICY IF EXISTS "Admins can manage all admin requests" ON public.admin_requests;
DROP POLICY IF EXISTS "Admins can manage all members" ON public.members;
DROP POLICY IF EXISTS "Admins can manage constitution documents" ON public.constitution_documents;
DROP POLICY IF EXISTS "Admins can manage all community events" ON public.community_events;
DROP POLICY IF EXISTS "Admins can manage all career opportunities" ON public.career_opportunities;
DROP POLICY IF EXISTS "Admins can manage all notifications" ON public.notifications;
DROP POLICY IF EXISTS "Admins can manage all weekly meetings" ON public.weekly_meetings;
DROP POLICY IF EXISTS "Admins can manage all mpesa configurations" ON public.mpesa_configurations;
DROP POLICY IF EXISTS "Admins can manage all point configurations" ON public.point_configurations;
DROP POLICY IF EXISTS "Admins can manage all official communications" ON public.official_communications;

-- Drop dependent views
DROP VIEW IF EXISTS public.member_management_view;
DROP VIEW IF EXISTS public.user_roles_with_hierarchy;

-- Update the user_roles table to use the comprehensive_role enum instead of user_role
ALTER TABLE public.user_roles 
ALTER COLUMN role TYPE comprehensive_role 
USING role::text::comprehensive_role;

-- Update the has_role function to use comprehensive_role
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role comprehensive_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Recreate the user_roles_with_hierarchy view
CREATE OR REPLACE VIEW public.user_roles_with_hierarchy AS
SELECT 
  ur.user_id,
  ur.role as assigned_role,
  array_agg(DISTINCT rh.child_role) FILTER (WHERE rh.child_role IS NOT NULL) as inherited_roles,
  array_agg(DISTINCT rp.permission_key) FILTER (WHERE rp.permission_key IS NOT NULL) as permissions
FROM public.user_roles ur
LEFT JOIN public.role_hierarchy rh ON ur.role = rh.parent_role
LEFT JOIN public.role_permissions rp ON ur.role = rp.role
GROUP BY ur.user_id, ur.role;

-- Recreate the member_management_view with the updated role column type
CREATE OR REPLACE VIEW public.member_management_view AS
SELECT 
  m.id,
  m.user_id,
  m.created_at,
  m.updated_at,
  COALESCE(SUM(mp.points), 0) as total_points,
  COUNT(DISTINCT ea.id) as events_attended,
  COUNT(DISTINCT ps.id) as projects_submitted,
  COUNT(DISTINCT c.id) as certificates_earned,
  ARRAY_AGG(DISTINCT ur.role) FILTER (WHERE ur.role IS NOT NULL) as roles,
  m.name,
  m.email,
  m.phone,
  m.course,
  m.registration_status,
  m.avatar_url,
  m.bio,
  m.year_of_study,
  m.skills,
  m.github_username,
  m.linkedin_url
FROM public.members m
LEFT JOIN public.member_points mp ON m.user_id = mp.user_id
LEFT JOIN public.event_attendance ea ON m.user_id = ea.user_id
LEFT JOIN public.project_submissions ps ON m.user_id = ps.user_id
LEFT JOIN public.certificates c ON m.user_id = c.user_id
LEFT JOIN public.user_roles ur ON m.user_id = ur.user_id
GROUP BY m.id, m.user_id, m.created_at, m.updated_at, m.name, m.email, m.phone, 
         m.course, m.registration_status, m.avatar_url, m.bio, m.year_of_study, 
         m.skills, m.github_username, m.linkedin_url;

-- Drop the old user_role enum if it's no longer needed
DROP TYPE IF EXISTS user_role CASCADE;

-- Recreate basic storage policies with updated role types
CREATE POLICY "Public file access" ON storage.objects
FOR SELECT USING (bucket_id = 'public');

CREATE POLICY "Authenticated users can upload" ON storage.objects
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can upload constitution documents" ON storage.objects
FOR ALL USING (
  bucket_id = 'constitution-documents' AND 
  EXISTS (
    SELECT 1 FROM public.user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role IN ('super_admin', 'general_admin', 'chairman', 'vice_chairman')
  )
);
