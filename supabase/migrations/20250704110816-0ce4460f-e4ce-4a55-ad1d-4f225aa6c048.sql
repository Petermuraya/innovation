
-- Complete refactoring from user-based system to member-based system
-- This migration consolidates user data into the member table and updates all relationships

-- Start transaction to ensure atomicity
BEGIN;

-- Step 1: First, ensure all existing user data is properly migrated to members table
-- Update members table to include all user fields that might be missing
ALTER TABLE public.members 
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS linkedin_url TEXT,
ADD COLUMN IF NOT EXISTS github_url TEXT,
ADD COLUMN IF NOT EXISTS portfolio_url TEXT,
ADD COLUMN IF NOT EXISTS skills TEXT[],
ADD COLUMN IF NOT EXISTS interests TEXT[],
ADD COLUMN IF NOT EXISTS year_of_study TEXT,
ADD COLUMN IF NOT EXISTS registration_number TEXT,
ADD COLUMN IF NOT EXISTS current_academic_year INTEGER,
ADD COLUMN IF NOT EXISTS registration_year INTEGER,
ADD COLUMN IF NOT EXISTS is_alumni BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS membership_expires_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS approved_by TEXT,
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE;

-- Step 2: Migrate any missing data from profiles to members
UPDATE public.members 
SET 
  full_name = COALESCE(members.full_name, profiles.full_name),
  avatar_url = COALESCE(members.avatar_url, profiles.avatar_url),
  bio = COALESCE(members.bio, profiles.bio),
  linkedin_url = COALESCE(members.linkedin_url, profiles.linkedin_url),
  github_url = COALESCE(members.github_url, profiles.github_url),
  portfolio_url = COALESCE(members.portfolio_url, profiles.portfolio_url),
  skills = COALESCE(members.skills, profiles.skills),
  interests = COALESCE(members.interests, profiles.interests),
  year_of_study = COALESCE(members.year_of_study, profiles.year_of_study)
FROM public.profiles 
WHERE members.user_id = profiles.user_id;

-- Step 3: Drop the old profiles table since we're consolidating everything into members
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Step 4: Create a new robust trigger function for member registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

CREATE OR REPLACE FUNCTION public.handle_new_member_registration()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert directly into members table with all registration data
  INSERT INTO public.members (
    user_id,
    email,
    name,
    full_name,
    phone,
    course,
    department,
    registration_status
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'fullName', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'fullName', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'course', ''),
    COALESCE(NEW.raw_user_meta_data->>'department', 'School of Computing and Information Technology'),
    'pending'
  );

  -- Assign default member role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'member')
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't prevent registration
    RAISE LOG 'Error in handle_new_member_registration: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Create the new trigger
CREATE TRIGGER on_auth_member_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_member_registration();

-- Step 5: Update RLS policies to work with the consolidated member table
DROP POLICY IF EXISTS "Enable insert for registration" ON public.members;
DROP POLICY IF EXISTS "Users can view own member record" ON public.members;
DROP POLICY IF EXISTS "Users can update own member record" ON public.members;
DROP POLICY IF EXISTS "Admins can view all members" ON public.members;
DROP POLICY IF EXISTS "Admins can manage all members" ON public.members;

-- Create comprehensive RLS policies for members
CREATE POLICY "Enable member registration" ON public.members
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Members can view own record" ON public.members
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Members can update own record" ON public.members
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all members" ON public.members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'super_admin', 'general_admin')
    ) OR auth.uid() = user_id
  );

CREATE POLICY "Admin member management" ON public.members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'super_admin', 'general_admin')
    )
  );

-- Step 6: Update indexes for better performance
CREATE INDEX IF NOT EXISTS idx_members_user_id ON public.members(user_id);
CREATE INDEX IF NOT EXISTS idx_members_email ON public.members(email);
CREATE INDEX IF NOT EXISTS idx_members_registration_status ON public.members(registration_status);
CREATE INDEX IF NOT EXISTS idx_members_course ON public.members(course);
CREATE INDEX IF NOT EXISTS idx_members_full_name ON public.members(full_name);

-- Step 7: Grant permissions
GRANT SELECT, INSERT, UPDATE ON public.members TO anon, authenticated;

-- Step 8: Add helpful comments
COMMENT ON TABLE public.members IS 'Consolidated member table containing all member information and registration data';
COMMENT ON FUNCTION public.handle_new_member_registration() IS 'Handles new member registration directly into members table';

-- Commit the transaction
COMMIT;
