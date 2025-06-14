
-- Create certificate storage bucket (only if it doesn't exist)
INSERT INTO storage.buckets (id, name, public)
VALUES ('certificates', 'certificates', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies if they exist and recreate them
DROP POLICY IF EXISTS "Allow authenticated users to upload certificates" ON storage.objects;
DROP POLICY IF EXISTS "Allow public access to view certificates" ON storage.objects;
DROP POLICY IF EXISTS "Allow certificate owners and admins to delete" ON storage.objects;

-- Create storage policies for certificates bucket
CREATE POLICY "Allow authenticated users to upload certificates" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'certificates' AND auth.role() = 'authenticated');

CREATE POLICY "Allow public access to view certificates" ON storage.objects
FOR SELECT USING (bucket_id = 'certificates');

CREATE POLICY "Allow certificate owners and admins to delete" ON storage.objects
FOR DELETE USING (
  bucket_id = 'certificates' AND 
  (auth.uid() = owner OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'patron'))
);

-- Update members table to include additional fields for better member management
ALTER TABLE members ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS year_of_study TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS skills TEXT[];
ALTER TABLE members ADD COLUMN IF NOT EXISTS github_username TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS linkedin_url TEXT;

-- Create official communications table
CREATE TABLE IF NOT EXISTS official_communications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'announcement' CHECK (type IN ('announcement', 'news', 'update', 'policy')),
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  target_audience TEXT NOT NULL DEFAULT 'all' CHECK (target_audience IN ('all', 'members', 'admins', 'community_leads')),
  published BOOLEAN NOT NULL DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  published_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  attachments JSONB DEFAULT '[]'::jsonb,
  tags TEXT[] DEFAULT '{}'::text[]
);

-- Enable RLS on official_communications
ALTER TABLE official_communications ENABLE ROW LEVEL SECURITY;

-- Create functions for better role checking (avoiding potential RLS recursion)
CREATE OR REPLACE FUNCTION public.is_patron(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = 'patron'
  )
$$;

CREATE OR REPLACE FUNCTION public.is_admin_or_patron(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('admin', 'patron')
  )
$$;

-- Policies for official_communications
DROP POLICY IF EXISTS "Admins and patrons can manage communications" ON official_communications;
CREATE POLICY "Admins and patrons can manage communications" ON official_communications
FOR ALL USING (public.is_admin_or_patron(auth.uid()));

DROP POLICY IF EXISTS "Published communications visible to target audience" ON official_communications;
CREATE POLICY "Published communications visible to target audience" ON official_communications
FOR SELECT USING (
  published = true AND
  (target_audience = 'all' OR 
   (target_audience = 'members' AND auth.role() = 'authenticated') OR
   (target_audience = 'admins' AND public.is_admin_or_patron(auth.uid())) OR
   (target_audience = 'community_leads' AND EXISTS(SELECT 1 FROM community_admin_roles WHERE user_id = auth.uid() AND is_active = true)))
);

-- Create private admin communications table
CREATE TABLE IF NOT EXISTS admin_communications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'internal' CHECK (type IN ('internal', 'urgent', 'meeting', 'decision')),
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'critical')),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_read_by JSONB DEFAULT '{}'::jsonb,
  attachments JSONB DEFAULT '[]'::jsonb,
  requires_response BOOLEAN DEFAULT false,
  deadline TIMESTAMP WITH TIME ZONE,
  resolved BOOLEAN DEFAULT false,
  resolved_by UUID REFERENCES auth.users(id),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on admin_communications
ALTER TABLE admin_communications ENABLE ROW LEVEL SECURITY;

-- Policies for admin_communications (only admins and patrons can access)
DROP POLICY IF EXISTS "Only admins and patrons can access admin communications" ON admin_communications;
CREATE POLICY "Only admins and patrons can access admin communications" ON admin_communications
FOR ALL USING (public.is_admin_or_patron(auth.uid()));

-- Update certificates table to include more metadata
ALTER TABLE certificates ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE certificates ADD COLUMN IF NOT EXISTS achievement_type TEXT DEFAULT 'completion';
ALTER TABLE certificates ADD COLUMN IF NOT EXISTS verification_code TEXT UNIQUE DEFAULT gen_random_uuid()::text;
ALTER TABLE certificates ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true;
ALTER TABLE certificates ADD COLUMN IF NOT EXISTS social_share_enabled BOOLEAN DEFAULT true;

-- Update certificates table RLS policies
DROP POLICY IF EXISTS "Users can view certificates" ON certificates;
DROP POLICY IF EXISTS "Admins can manage all certificates" ON certificates;
DROP POLICY IF EXISTS "Admins can manage certificates" ON certificates;
DROP POLICY IF EXISTS "Users can view accessible certificates" ON certificates;

ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own certificates and public certificates
CREATE POLICY "Users can view accessible certificates" 
  ON certificates 
  FOR SELECT 
  USING (
    user_id = auth.uid() 
    OR (is_public = true AND social_share_enabled = true)
    OR public.is_admin_or_patron(auth.uid())
  );

-- Policy: Admins and patrons can manage all certificates
CREATE POLICY "Admins can manage certificates" 
  ON certificates 
  FOR ALL 
  USING (public.is_admin_or_patron(auth.uid()));

-- Create function to auto-assign patron role to first admin
CREATE OR REPLACE FUNCTION auto_assign_patron_role()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if this is the first admin being created
  IF NEW.role = 'admin' AND NOT EXISTS (
    SELECT 1 FROM user_roles WHERE role = 'patron'
  ) THEN
    -- Assign patron role to this user
    INSERT INTO user_roles (user_id, role) 
    VALUES (NEW.user_id, 'patron')
    ON CONFLICT (user_id) DO UPDATE SET role = 'patron';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-assigning patron role
DROP TRIGGER IF EXISTS auto_assign_patron ON user_roles;
CREATE TRIGGER auto_assign_patron
  AFTER INSERT ON user_roles
  FOR EACH ROW
  EXECUTE FUNCTION auto_assign_patron_role();

-- Create improved member management view
CREATE OR REPLACE VIEW member_management_view AS
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
  COALESCE(ur.roles, ARRAY[]::text[]) as roles,
  COALESCE(mp.total_points, 0) as total_points,
  COALESCE(ea.events_attended, 0) as events_attended,
  COALESCE(ps.projects_submitted, 0) as projects_submitted,
  COALESCE(cert.certificates_earned, 0) as certificates_earned
FROM members m
LEFT JOIN (
  SELECT user_id, ARRAY_AGG(role::text) as roles
  FROM user_roles
  GROUP BY user_id
) ur ON m.user_id = ur.user_id
LEFT JOIN (
  SELECT user_id, SUM(points) as total_points
  FROM member_points
  GROUP BY user_id
) mp ON m.user_id = mp.user_id
LEFT JOIN (
  SELECT user_id, COUNT(*) as events_attended
  FROM event_attendance
  GROUP BY user_id
) ea ON m.user_id = ea.user_id
LEFT JOIN (
  SELECT user_id, COUNT(*) as projects_submitted
  FROM project_submissions
  GROUP BY user_id
) ps ON m.user_id = ps.user_id
LEFT JOIN (
  SELECT user_id, COUNT(*) as certificates_earned
  FROM certificates
  GROUP BY user_id
) cert ON m.user_id = cert.user_id;
