
-- Fix password policies and ensure schema matches registration form
-- This migration ensures proper password handling and field matching

-- Update auth.users password policies (Supabase handles password storage automatically)
-- We just need to ensure our trigger handles the user data correctly

-- Drop existing trigger to recreate it
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Verify profiles table has correct fields matching registration form
-- The registration form sends: fullName, phone, course, password, confirmPassword
-- Let's ensure our tables match this structure

-- Update profiles table to ensure it matches registration form exactly
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS course TEXT;

-- Update members table to match as well
ALTER TABLE public.members 
ADD COLUMN IF NOT EXISTS name TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS course TEXT;

-- Create improved trigger function that properly handles the registration data
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
  -- Extract data from user metadata with proper fallbacks
  user_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'fullName', 'Unknown User');
  user_phone := COALESCE(NEW.raw_user_meta_data->>'phone', '');
  user_course := COALESCE(NEW.raw_user_meta_data->>'course', '');
  user_department := COALESCE(NEW.raw_user_meta_data->>'department', 'School of Computing and Information Technology');

  -- Insert into profiles table
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

  -- Insert into members table for admin management
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

  -- Assign default member role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'member');

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the user creation
    RAISE WARNING 'Error in handle_new_user for user %: %', NEW.email, SQLERRM;
    RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Ensure proper RLS policies for password-related operations
-- Users should be able to update their own profiles after registration
CREATE POLICY IF NOT EXISTS "Users can insert their own profile during registration"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert their own member record during registration"
  ON public.members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Grant necessary permissions for the registration process
GRANT INSERT ON public.profiles TO authenticated;
GRANT INSERT ON public.members TO authenticated;
GRANT INSERT ON public.user_roles TO authenticated;

-- Create indexes for better performance on frequently queried fields
CREATE INDEX IF NOT EXISTS idx_profiles_course ON public.profiles(course);
CREATE INDEX IF NOT EXISTS idx_members_course ON public.members(course);
CREATE INDEX IF NOT EXISTS idx_profiles_full_name ON public.profiles(full_name);
CREATE INDEX IF NOT EXISTS idx_members_name ON public.members(name);

-- Ensure the course field can handle all the course options from the registration form
-- The form sends values like: computer_science, information_technology, etc.
-- These are stored as text, which is correct

COMMENT ON COLUMN public.profiles.course IS 'Course field matching registration form options: computer_science, information_technology, software_engineering, business_it, data_science, cybersecurity, other';
COMMENT ON COLUMN public.members.course IS 'Course field matching registration form options: computer_science, information_technology, software_engineering, business_it, data_science, cybersecurity, other';
