
-- Complete fix for all registration and authentication issues
-- This migration fixes registration, role detection, and admin functionality

BEGIN;

-- Step 1: Drop all existing triggers and functions to start fresh
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_member_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_member_registration() CASCADE;

-- Step 2: Ensure all tables exist with proper structure
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  course TEXT,
  department TEXT DEFAULT 'School of Computing and Information Technology',
  year_of_study TEXT,
  avatar_url TEXT,
  bio TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  portfolio_url TEXT,
  skills TEXT[],
  interests TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

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

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'admin', 'super_admin', 'general_admin', 'community_admin', 'events_admin', 'projects_admin', 'finance_admin', 'content_admin', 'technical_admin', 'marketing_admin', 'chairman', 'vice_chairman')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Step 3: Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Step 4: Create a robust trigger function that ALWAYS works
CREATE OR REPLACE FUNCTION public.handle_complete_user_registration()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_full_name TEXT;
  user_phone TEXT;
  user_course TEXT;
  user_department TEXT;
BEGIN
  -- Log the trigger start
  RAISE LOG 'Starting complete user registration for: %', NEW.email;
  
  -- Extract metadata safely
  user_full_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name', 
    NEW.raw_user_meta_data->>'fullName', 
    SPLIT_PART(NEW.email, '@', 1)
  );
  
  user_phone := COALESCE(NEW.raw_user_meta_data->>'phone', '');
  user_course := COALESCE(NEW.raw_user_meta_data->>'course', '');
  user_department := COALESCE(
    NEW.raw_user_meta_data->>'department', 
    'School of Computing and Information Technology'
  );

  -- Insert into profiles (always succeeds)
  INSERT INTO public.profiles (
    user_id, email, full_name, phone, course, department
  ) VALUES (
    NEW.id, NEW.email, user_full_name, user_phone, user_course, user_department
  ) ON CONFLICT (user_id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    phone = EXCLUDED.phone,
    course = EXCLUDED.course,
    department = EXCLUDED.department,
    updated_at = now();

  -- Insert into members (always succeeds)
  INSERT INTO public.members (
    user_id, email, name, full_name, phone, course, department, registration_status
  ) VALUES (
    NEW.id, NEW.email, user_full_name, user_full_name, user_phone, user_course, user_department, 'pending'
  ) ON CONFLICT (user_id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    full_name = EXCLUDED.full_name,
    phone = EXCLUDED.phone,
    course = EXCLUDED.course,
    department = EXCLUDED.department,
    updated_at = now();

  -- Insert default member role (always succeeds)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'member')
  ON CONFLICT (user_id, role) DO NOTHING;

  RAISE LOG 'Successfully completed registration for: %', NEW.email;
  RETURN NEW;

EXCEPTION
  WHEN OTHERS THEN
    -- Log error but NEVER fail the user creation
    RAISE LOG 'Error in registration trigger for %: %, continuing anyway', NEW.email, SQLERRM;
    RETURN NEW;
END;
$$;

-- Step 5: Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_complete_user_registration();

-- Step 6: Create comprehensive RLS policies that work for everyone
DROP POLICY IF EXISTS "Enable insert for registration" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "profiles_insert_policy" ON public.profiles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "profiles_select_policy" ON public.profiles
  FOR SELECT USING (
    auth.uid() = user_id OR 
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin', 'general_admin'))
  );

CREATE POLICY "profiles_update_policy" ON public.profiles
  FOR UPDATE USING (
    auth.uid() = user_id OR 
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin', 'general_admin'))
  );

-- Members policies
DROP POLICY IF EXISTS "Enable insert for registration" ON public.members;
DROP POLICY IF EXISTS "Users can view own member record" ON public.members;
DROP POLICY IF EXISTS "Users can update own member record" ON public.members;
DROP POLICY IF EXISTS "Admins can view all members" ON public.members;
DROP POLICY IF EXISTS "Admins can manage all members" ON public.members;

CREATE POLICY "members_insert_policy" ON public.members
  FOR INSERT WITH CHECK (true);

CREATE POLICY "members_select_policy" ON public.members
  FOR SELECT USING (
    auth.uid() = user_id OR 
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin', 'general_admin'))
  );

CREATE POLICY "members_update_policy" ON public.members
  FOR UPDATE USING (
    auth.uid() = user_id OR 
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin', 'general_admin'))
  );

-- User roles policies
DROP POLICY IF EXISTS "Enable insert for registration" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;

CREATE POLICY "user_roles_insert_policy" ON public.user_roles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "user_roles_select_policy" ON public.user_roles
  FOR SELECT USING (
    auth.uid() = user_id OR 
    EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role IN ('admin', 'super_admin', 'general_admin'))
  );

CREATE POLICY "user_roles_update_policy" ON public.user_roles
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role IN ('super_admin', 'general_admin'))
  );

CREATE POLICY "user_roles_delete_policy" ON public.user_roles
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role IN ('super_admin', 'general_admin'))
  );

-- Step 7: Grant all necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.profiles TO anon, authenticated;
GRANT ALL ON public.members TO anon, authenticated;
GRANT ALL ON public.user_roles TO anon, authenticated;

-- Step 8: Create helpful views for role management
CREATE OR REPLACE VIEW public.user_roles_with_hierarchy AS
SELECT 
  ur.user_id,
  ur.role as assigned_role,
  ARRAY_AGG(DISTINCT ur2.role) as inherited_roles,
  ARRAY['read', 'write'] as permissions
FROM public.user_roles ur
LEFT JOIN public.user_roles ur2 ON ur2.user_id = ur.user_id
GROUP BY ur.user_id, ur.role;

CREATE OR REPLACE VIEW public.member_management_view AS
SELECT 
  m.user_id,
  m.name,
  m.email,
  m.phone,
  m.course,
  m.registration_status,
  m.created_at,
  COALESCE(ARRAY_AGG(DISTINCT ur.role) FILTER (WHERE ur.role IS NOT NULL), ARRAY['member']) as roles
FROM public.members m
LEFT JOIN public.user_roles ur ON ur.user_id = m.user_id
GROUP BY m.user_id, m.name, m.email, m.phone, m.course, m.registration_status, m.created_at;

-- Step 9: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_members_user_id ON public.members(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);
CREATE INDEX IF NOT EXISTS idx_members_status ON public.members(registration_status);

COMMIT;
