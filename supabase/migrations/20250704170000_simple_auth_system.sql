
-- Simple authentication system with just email and password
-- Drop all complex triggers and recreate simple ones

BEGIN;

-- Drop existing triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_complete_user_registration() CASCADE;

-- Create a very simple trigger function that won't fail
CREATE OR REPLACE FUNCTION public.handle_simple_user_registration()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Just log that a user was created, don't insert into other tables
  RAISE LOG 'New user created: %', NEW.email;
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Always succeed, never fail user creation
    RAISE LOG 'Error in registration trigger (ignored): %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Create the simple trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_simple_user_registration();

-- Make sure basic tables exist but don't require them for user creation
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Simple RLS policies
DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
DROP POLICY IF EXISTS "user_roles_insert_policy" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles_select_policy" ON public.user_roles;

CREATE POLICY "profiles_insert_policy" ON public.profiles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "profiles_select_policy" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "user_roles_insert_policy" ON public.user_roles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "user_roles_select_policy" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.profiles TO anon, authenticated;
GRANT ALL ON public.user_roles TO anon, authenticated;

COMMIT;
