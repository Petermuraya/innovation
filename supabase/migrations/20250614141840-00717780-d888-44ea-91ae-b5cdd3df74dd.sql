
-- Handle dependent views first - we need to recreate the member_management_view after the column change

-- Drop the dependent view temporarily
DROP VIEW IF EXISTS public.member_management_view;

-- Create the comprehensive role enum
CREATE TYPE public.comprehensive_role AS ENUM (
  'member',
  'super_admin',
  'general_admin', 
  'community_admin',
  'events_admin',
  'projects_admin',
  'finance_admin',
  'content_admin',
  'technical_admin',
  'marketing_admin'
);

-- Create role permissions table to define what each role can do
CREATE TABLE public.role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role comprehensive_role NOT NULL,
  permission_key TEXT NOT NULL,
  permission_name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(role, permission_key)
);

-- Create role hierarchy table to define role relationships
CREATE TABLE public.role_hierarchy (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_role comprehensive_role NOT NULL,
  child_role comprehensive_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(parent_role, child_role)
);

-- Handle the user_roles table transition carefully
-- First, add a new column with the comprehensive_role type
ALTER TABLE public.user_roles ADD COLUMN new_role comprehensive_role;

-- Update the new_role column based on existing role values
UPDATE public.user_roles 
SET new_role = CASE 
  WHEN role = 'admin' THEN 'general_admin'::comprehensive_role
  WHEN role = 'member' THEN 'member'::comprehensive_role
  WHEN role = 'patron' THEN 'super_admin'::comprehensive_role
  ELSE 'member'::comprehensive_role
END;

-- Drop the old role column and rename new_role to role
ALTER TABLE public.user_roles DROP COLUMN role CASCADE;
ALTER TABLE public.user_roles RENAME COLUMN new_role TO role;

-- Set the default and not null constraint
ALTER TABLE public.user_roles ALTER COLUMN role SET DEFAULT 'member'::comprehensive_role;
ALTER TABLE public.user_roles ALTER COLUMN role SET NOT NULL;

-- Recreate the member_management_view with the new role column
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

-- Insert role hierarchy relationships
INSERT INTO public.role_hierarchy (parent_role, child_role) VALUES
-- Super admin can manage all other roles
('super_admin', 'general_admin'),
('super_admin', 'community_admin'),
('super_admin', 'events_admin'),
('super_admin', 'projects_admin'),
('super_admin', 'finance_admin'),
('super_admin', 'content_admin'),
('super_admin', 'technical_admin'),
('super_admin', 'marketing_admin'),
-- General admin can manage specific functional roles
('general_admin', 'community_admin'),
('general_admin', 'events_admin'),
('general_admin', 'projects_admin'),
('general_admin', 'content_admin');

-- Insert comprehensive role permissions
INSERT INTO public.role_permissions (role, permission_key, permission_name, description) VALUES
-- Super Admin - Full system access
('super_admin', 'system_config', 'System Configuration', 'Configure system-wide settings'),
('super_admin', 'role_management', 'Role Management', 'Assign and revoke all admin roles'),
('super_admin', 'user_management', 'User Management', 'Full user account management'),
('super_admin', 'financial_oversight', 'Financial Oversight', 'Access all financial data and reports'),
('super_admin', 'system_analytics', 'System Analytics', 'View comprehensive system analytics'),

-- General Admin - Cross-functional management
('general_admin', 'member_approval', 'Member Approval', 'Approve/reject member registrations'),
('general_admin', 'content_moderation', 'Content Moderation', 'Moderate user-generated content'),
('general_admin', 'basic_analytics', 'Basic Analytics', 'View general system statistics'),
('general_admin', 'announcement_create', 'Create Announcements', 'Create system-wide announcements'),

-- Community Admin - Community management
('community_admin', 'community_create', 'Create Communities', 'Create and configure communities'),
('community_admin', 'community_manage', 'Manage Communities', 'Manage community settings and membership'),
('community_admin', 'attendance_tracking', 'Attendance Tracking', 'Track meeting attendance'),
('community_admin', 'member_assignment', 'Member Assignment', 'Assign members to communities'),

-- Events Admin - Event management
('events_admin', 'event_create', 'Create Events', 'Create and schedule events'),
('events_admin', 'event_manage', 'Manage Events', 'Edit and manage existing events'),
('events_admin', 'attendance_manage', 'Manage Attendance', 'Track and manage event attendance'),
('events_admin', 'venue_booking', 'Venue Booking', 'Book and manage event venues'),

-- Projects Admin - Project oversight
('projects_admin', 'project_review', 'Project Review', 'Review and approve project submissions'),
('projects_admin', 'project_feature', 'Feature Projects', 'Feature projects on homepage'),
('projects_admin', 'project_feedback', 'Project Feedback', 'Provide feedback on projects'),
('projects_admin', 'showcase_manage', 'Manage Showcase', 'Manage project showcase events'),

-- Finance Admin - Financial management
('finance_admin', 'payment_processing', 'Payment Processing', 'Process membership and event payments'),
('finance_admin', 'financial_reports', 'Financial Reports', 'Generate financial reports'),
('finance_admin', 'fee_management', 'Fee Management', 'Set and manage membership fees'),
('finance_admin', 'refund_processing', 'Refund Processing', 'Process payment refunds'),

-- Content Admin - Content management
('content_admin', 'blog_moderation', 'Blog Moderation', 'Moderate blog posts and articles'),
('content_admin', 'newsletter_manage', 'Newsletter Management', 'Create and send newsletters'),
('content_admin', 'social_media', 'Social Media Management', 'Manage social media content'),
('content_admin', 'content_creation', 'Content Creation', 'Create official club content'),

-- Technical Admin - Technical oversight
('technical_admin', 'system_maintenance', 'System Maintenance', 'Perform system maintenance tasks'),
('technical_admin', 'user_support', 'User Support', 'Provide technical support to users'),
('technical_admin', 'integration_manage', 'Integration Management', 'Manage third-party integrations'),
('technical_admin', 'backup_restore', 'Backup & Restore', 'Manage system backups and restores'),

-- Marketing Admin - Marketing and outreach
('marketing_admin', 'campaign_create', 'Create Campaigns', 'Create marketing campaigns'),
('marketing_admin', 'partnership_manage', 'Partnership Management', 'Manage external partnerships'),
('marketing_admin', 'analytics_marketing', 'Marketing Analytics', 'View marketing performance metrics'),
('marketing_admin', 'outreach_manage', 'Outreach Management', 'Manage member outreach programs');

-- Create enhanced role checking function that supports hierarchy
CREATE OR REPLACE FUNCTION public.has_role_or_higher(_user_id uuid, _required_role comprehensive_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  -- Check if user has the exact role
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = _user_id AND ur.role = _required_role
  )
  OR 
  -- Check if user has a parent role that grants access
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    JOIN public.role_hierarchy rh ON ur.role = rh.parent_role
    WHERE ur.user_id = _user_id AND rh.child_role = _required_role
  )
  OR
  -- Super admin has access to everything
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = _user_id AND ur.role = 'super_admin'
  )
$$;

-- Create function to check specific permissions
CREATE OR REPLACE FUNCTION public.has_permission(_user_id uuid, _permission_key text)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles ur
    JOIN public.role_permissions rp ON ur.role = rp.role
    WHERE ur.user_id = _user_id AND rp.permission_key = _permission_key
  )
  OR
  -- Super admin has all permissions
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = _user_id AND ur.role = 'super_admin'
  )
$$;

-- Create view for user roles with hierarchy information
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

-- Update the existing has_role function to work with new enum
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
