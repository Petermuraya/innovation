
-- Add missing columns to project_submissions table for better project management
ALTER TABLE project_submissions ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE project_submissions ADD COLUMN IF NOT EXISTS featured_order INTEGER;
ALTER TABLE project_submissions ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN DEFAULT false;
ALTER TABLE project_submissions ADD COLUMN IF NOT EXISTS featured_by UUID REFERENCES auth.users(id);
ALTER TABLE project_submissions ADD COLUMN IF NOT EXISTS featured_at TIMESTAMP WITH TIME ZONE;

-- Enable RLS on project_submissions
ALTER TABLE project_submissions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own projects and approved public projects
CREATE POLICY "Users can view accessible projects" ON project_submissions
FOR SELECT USING (
  user_id = auth.uid() OR 
  (status = 'approved' AND is_hidden = false) OR
  public.is_admin_or_patron(auth.uid())
);

-- Policy: Users can insert their own projects
CREATE POLICY "Users can create their own projects" ON project_submissions
FOR INSERT WITH CHECK (user_id = auth.uid());

-- Policy: Users can update their own projects
CREATE POLICY "Users can update their own projects" ON project_submissions
FOR UPDATE USING (user_id = auth.uid());

-- Policy: Users can delete their own projects
CREATE POLICY "Users can delete their own projects" ON project_submissions
FOR DELETE USING (user_id = auth.uid());

-- Policy: Admins can manage all projects
CREATE POLICY "Admins can manage all projects" ON project_submissions
FOR ALL USING (public.is_admin_or_patron(auth.uid()));

-- Create a view for featured projects on home page
CREATE OR REPLACE VIEW featured_projects_home AS
SELECT 
  ps.*,
  m.name as author_name
FROM project_submissions ps
LEFT JOIN members m ON ps.user_id = m.user_id
WHERE ps.status = 'approved' 
  AND ps.is_featured = true 
  AND ps.is_hidden = false
ORDER BY ps.featured_order ASC NULLS LAST, ps.featured_at DESC
LIMIT 6;

-- Create function to manage featured projects (max 6)
CREATE OR REPLACE FUNCTION manage_featured_project(
  project_id UUID,
  make_featured BOOLEAN,
  admin_id UUID
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF make_featured THEN
    -- Check if we already have 6 featured projects
    IF (SELECT COUNT(*) FROM project_submissions WHERE is_featured = true AND status = 'approved') >= 6 THEN
      RAISE EXCEPTION 'Maximum of 6 featured projects allowed. Please unfeature a project first.';
    END IF;
    
    -- Feature the project
    UPDATE project_submissions 
    SET 
      is_featured = true,
      featured_by = admin_id,
      featured_at = now(),
      featured_order = COALESCE((SELECT MAX(featured_order) FROM project_submissions WHERE is_featured = true), 0) + 1
    WHERE id = project_id AND status = 'approved';
  ELSE
    -- Unfeature the project
    UPDATE project_submissions 
    SET 
      is_featured = false,
      featured_by = NULL,
      featured_at = NULL,
      featured_order = NULL
    WHERE id = project_id;
  END IF;
END;
$$;
