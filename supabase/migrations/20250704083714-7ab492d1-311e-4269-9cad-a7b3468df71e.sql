
-- Add the missing admin_type column to admin_requests table
ALTER TABLE public.admin_requests 
ADD COLUMN IF NOT EXISTS admin_type text DEFAULT 'general_admin';

-- Update the simple_role enum to include all the roles needed
ALTER TYPE public.simple_role ADD VALUE IF NOT EXISTS 'general_admin';
ALTER TYPE public.simple_role ADD VALUE IF NOT EXISTS 'community_admin';

-- Recreate the member_management_view that's referenced in the code
CREATE OR REPLACE VIEW public.member_management_view AS
SELECT 
  m.id,
  m.user_id,
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
  m.linkedin_url,
  m.created_at,
  m.updated_at,
  COALESCE(mp.total_points, 0) as total_points,
  COALESCE(ea.events_attended, 0) as events_attended,
  COALESCE(ps.projects_submitted, 0) as projects_submitted,
  COALESCE(c.certificates_earned, 0) as certificates_earned,
  array_agg(DISTINCT ur.role) FILTER (WHERE ur.role IS NOT NULL) as roles
FROM public.members m
LEFT JOIN (
  SELECT user_id, SUM(points) as total_points
  FROM public.member_points
  GROUP BY user_id
) mp ON m.user_id = mp.user_id
LEFT JOIN (
  SELECT user_id, COUNT(*) as events_attended
  FROM public.event_attendance
  GROUP BY user_id
) ea ON m.user_id = ea.user_id
LEFT JOIN (
  SELECT user_id, COUNT(*) as projects_submitted
  FROM public.project_submissions
  GROUP BY user_id
) ps ON m.user_id = ps.user_id
LEFT JOIN (
  SELECT user_id, COUNT(*) as certificates_earned
  FROM public.certificates
  GROUP BY user_id
) c ON m.user_id = c.user_id
LEFT JOIN public.user_roles ur ON m.user_id = ur.user_id
GROUP BY m.id, m.user_id, m.name, m.email, m.phone, m.course, m.registration_status, 
         m.avatar_url, m.bio, m.year_of_study, m.skills, m.github_username, m.linkedin_url,
         m.created_at, m.updated_at, mp.total_points, ea.events_attended, ps.projects_submitted, c.certificates_earned;
