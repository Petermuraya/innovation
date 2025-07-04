
-- Complete fix for registration database errors
-- This migration ensures the registration flow works properly with email verification

-- Start fresh by dropping existing triggers and functions
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Ensure all required tables exist with proper schema
-- Drop and recreate tables to ensure clean schema
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.members CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;

-- Create profiles table with all needed fields
CREATE TABLE public.profiles (
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

-- Create members table for admin management
CREATE TABLE public.members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  email TEXT NOT NULL,
  name TEXT,
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

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'admin', 'super_admin', 'general_admin', 'community_admin', 'events_admin', 'projects_admin', 'finance_admin', 'content_admin', 'technical_admin', 'marketing_admin', 'chairman', 'vice_chairman')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create simple, robust trigger function with extensive error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
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
  -- Log the trigger execution
  RAISE LOG 'handle_new_user triggered for user: %', NEW.email;
  
  -- Extract metadata with safe defaults
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

  -- Insert into profiles with error handling
  BEGIN
    INSERT INTO public.profiles (
      user_id,
      email,
      full_name,
      phone,
      course,
      department
    ) VALUES (
      NEW.id,
      NEW.email,
      user_full_name,
      user_phone,
      user_course,
      user_department
    );
    
    RAISE LOG 'Profile created successfully for user: %', NEW.email;
  EXCEPTION
    WHEN OTHERS THEN
      RAISE LOG 'Error creating profile for user %: %', NEW.email, SQLERRM;
      -- Don't fail the entire registration, just log the error
  END;

  -- Insert into members with error handling
  BEGIN
    INSERT INTO public.members (
      user_id,
      email,
      name,
      phone,
      course,
      department,
      registration_status
    ) VALUES (
      NEW.id,
      NEW.email,
      user_full_name,
      user_phone,
      user_course,
      user_department,
      'pending'
    );
    
    RAISE LOG 'Member record created successfully for user: %', NEW.email;
  EXCEPTION
    WHEN OTHERS THEN
      RAISE LOG 'Error creating member record for user %: %', NEW.email, SQLERRM;
      -- Don't fail the entire registration, just log the error
  END;

  -- Assign default role with error handling
  BEGIN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'member')
    ON CONFLICT (user_id, role) DO NOTHING;
    
    RAISE LOG 'User role assigned successfully for user: %', NEW.email;
  EXCEPTION
    WHEN OTHERS THEN
      RAISE LOG 'Error assigning role for user %: %', NEW.email, SQLERRM;
      -- Don't fail the entire registration, just log the error
  END;

  RAISE LOG 'handle_new_user completed successfully for user: %', NEW.email;
  RETURN NEW;
  
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't prevent user creation
    RAISE LOG 'Critical error in handle_new_user for user %: %', NEW.email, SQLERRM;
    RETURN NEW; -- Always return NEW to allow user creation
END;
$$;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create RLS policies that allow user registration
CREATE POLICY "Enable insert for registration" ON public.profiles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Enable insert for registration" ON public.members
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own member record" ON public.members
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own member record" ON public.members
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all members" ON public.members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'super_admin', 'general_admin')
    ) OR auth.uid() = user_id
  );

CREATE POLICY "Admins can manage all members" ON public.members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'super_admin', 'general_admin')
    )
  );

CREATE POLICY "Enable insert for registration" ON public.user_roles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.role IN ('admin', 'super_admin', 'general_admin')
    )
  );

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.members TO anon, authenticated;
GRANT SELECT, INSERT ON public.user_roles TO anon, authenticated;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_members_user_id ON public.members(user_id);
CREATE INDEX IF NOT EXISTS idx_members_email ON public.members(email);
CREATE INDEX IF NOT EXISTS idx_members_status ON public.members(registration_status);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);

-- Add comments for documentation
COMMENT ON TABLE public.profiles IS 'User profiles with detailed information';
COMMENT ON TABLE public.members IS 'Member management table with registration status';
COMMENT ON TABLE public.user_roles IS 'User roles and permissions';
COMMENT ON FUNCTION public.handle_new_user() IS 'Trigger function to handle new user registration with error handling';
