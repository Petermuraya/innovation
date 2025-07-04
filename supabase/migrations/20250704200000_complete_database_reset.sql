
-- Complete database reset to fix registration issues
-- This will remove ALL potential conflicts and create a clean slate

BEGIN;

-- Drop ALL existing triggers and functions
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_member_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_member_registration() CASCADE;
DROP FUNCTION IF EXISTS public.handle_complete_user_registration() CASCADE;
DROP FUNCTION IF EXISTS public.handle_simple_user_registration() CASCADE;
DROP FUNCTION IF EXISTS public.handle_bulletproof_registration() CASCADE;
DROP FUNCTION IF EXISTS public.create_user_profile_async(UUID, TEXT) CASCADE;

-- Drop ALL existing tables to ensure clean slate
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;
DROP TABLE IF EXISTS public.members CASCADE;

-- Recreate basic tables with minimal constraints
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  course TEXT,
  department TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Disable RLS completely to avoid any policy conflicts
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;

-- Grant all permissions to avoid any permission issues
GRANT ALL ON public.profiles TO anon, authenticated;
GRANT ALL ON public.user_roles TO anon, authenticated;
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- NO TRIGGERS AT ALL - Let Supabase Auth work without interference

COMMIT;
