
-- Remove course requirement from authentication flow
-- This migration updates the member registration trigger to not require course data

BEGIN;

-- Update the member registration trigger to not expect course data
CREATE OR REPLACE FUNCTION public.handle_member_registration()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  member_full_name TEXT;
  member_phone TEXT;
  member_department TEXT;
  new_member_id UUID;
BEGIN
  -- Extract metadata safely without course
  member_full_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name', 
    NEW.raw_user_meta_data->>'fullName', 
    SPLIT_PART(NEW.email, '@', 1)
  );
  
  member_phone := COALESCE(NEW.raw_user_meta_data->>'phone', '');
  member_department := COALESCE(
    NEW.raw_user_meta_data->>'department', 
    'School of Computing and Information Technology'
  );

  -- Insert into members table without course field
  INSERT INTO public.members (
    user_id, email, name, full_name, phone, department, registration_status
  ) VALUES (
    NEW.id, NEW.email, member_full_name, member_full_name, member_phone, member_department, 'pending'
  ) RETURNING id INTO new_member_id;

  -- Insert default member role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'member')
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;

EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't prevent user creation
    RAISE LOG 'Error in member registration trigger for %: %', NEW.email, SQLERRM;
    RETURN NEW;
END;
$$;

-- Update the password policies migration trigger as well
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_full_name TEXT;
  user_phone TEXT;
  user_department TEXT;
BEGIN
  -- Extract data from user metadata with proper fallbacks (no course)
  user_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'fullName', 'Unknown User');
  user_phone := COALESCE(NEW.raw_user_meta_data->>'phone', '');
  user_department := COALESCE(NEW.raw_user_meta_data->>'department', 'School of Computing and Information Technology');

  -- Insert into profiles table (if it exists)
  INSERT INTO public.profiles (
    user_id,
    email,
    full_name,
    phone,
    department
  ) VALUES (
    NEW.id,
    NEW.email,
    user_full_name,
    user_phone,
    user_department
  ) ON CONFLICT (user_id) DO NOTHING;

  -- Insert into members table for admin management
  INSERT INTO public.members (
    user_id,
    email,
    name,
    phone,
    department,
    registration_status
  ) VALUES (
    NEW.id,
    NEW.email,
    user_full_name,
    user_phone,
    user_department,
    'pending'
  ) ON CONFLICT (user_id) DO NOTHING;

  -- Assign default member role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'member')
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the user creation
    RAISE WARNING 'Error in handle_new_user for user %: %', NEW.email, SQLERRM;
    RETURN NEW;
END;
$$;

COMMIT;
