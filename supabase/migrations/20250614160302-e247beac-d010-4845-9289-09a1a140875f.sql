
-- Second part: Set up role hierarchy and permissions for new roles
-- Add role hierarchy relationships for chairman and vice chairman
INSERT INTO public.role_hierarchy (parent_role, child_role) VALUES
-- Chairman is the highest role, can manage all other roles
('chairman', 'super_admin'),
('chairman', 'general_admin'),
('chairman', 'community_admin'),
('chairman', 'events_admin'),
('chairman', 'projects_admin'),
('chairman', 'finance_admin'),
('chairman', 'content_admin'),
('chairman', 'technical_admin'),
('chairman', 'marketing_admin'),
('chairman', 'vice_chairman'),
-- Vice chairman can manage most roles except chairman
('vice_chairman', 'super_admin'),
('vice_chairman', 'general_admin'),
('vice_chairman', 'community_admin'),
('vice_chairman', 'events_admin'),
('vice_chairman', 'projects_admin'),
('vice_chairman', 'finance_admin'),
('vice_chairman', 'content_admin'),
('vice_chairman', 'technical_admin'),
('vice_chairman', 'marketing_admin');

-- Add permissions for chairman
INSERT INTO public.role_permissions (role, permission_key, permission_name, description) VALUES
-- Chairman - Full organizational control
('chairman', 'organizational_oversight', 'Organizational Oversight', 'Complete oversight of all organizational operations'),
('chairman', 'strategic_planning', 'Strategic Planning', 'Lead organizational strategic planning'),
('chairman', 'executive_decisions', 'Executive Decisions', 'Make high-level executive decisions'),
('chairman', 'board_management', 'Board Management', 'Manage board meetings and decisions'),
('chairman', 'certificate_upload', 'Certificate Upload', 'Upload and manage certificates'),

-- Vice Chairman - Executive support and operations
('vice_chairman', 'deputy_oversight', 'Deputy Oversight', 'Support chairman in organizational oversight'),
('vice_chairman', 'operations_management', 'Operations Management', 'Manage day-to-day operations'),
('vice_chairman', 'strategic_support', 'Strategic Support', 'Support strategic planning initiatives'),
('vice_chairman', 'certificate_upload', 'Certificate Upload', 'Upload and manage certificates');

-- Also add certificate upload permission to patron role for backwards compatibility
INSERT INTO public.role_permissions (role, permission_key, permission_name, description) VALUES
('super_admin', 'certificate_upload', 'Certificate Upload', 'Upload and manage certificates')
ON CONFLICT (role, permission_key) DO NOTHING;
