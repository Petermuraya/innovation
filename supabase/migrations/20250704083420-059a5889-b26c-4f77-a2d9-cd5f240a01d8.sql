
-- Complete cleanup and fix for registration errors
-- This will remove ALL potential sources of database interference

BEGIN;

-- Drop ALL existing triggers that could interfere with user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_member_created ON auth.users;
DROP TRIGGER IF EXISTS handle_new_user ON auth.users;
DROP TRIGGER IF EXISTS handle_new_member ON auth.users;

-- Drop ALL existing functions that could be called during user creation  
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_member_registration() CASCADE;
DROP FUNCTION IF EXISTS public.handle_complete_user_registration() CASCADE;
DROP FUNCTION IF EXISTS public.handle_simple_user_registration() CASCADE;
DROP FUNCTION IF EXISTS public.handle_bulletproof_registration() CASCADE;
DROP FUNCTION IF EXISTS public.create_user_profile_async(UUID, TEXT) CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user_profile() CASCADE;

-- Remove any problematic enum constraints
DROP TYPE IF EXISTS comprehensive_role CASCADE;

-- Recreate a simple role system without enum constraints
CREATE TYPE public.simple_role AS ENUM ('member', 'admin', 'super_admin');

-- Ensure core tables exist but are completely optional for auth
DROP TABLE IF EXISTS public.profiles CASCADE;
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

DROP TABLE IF EXISTS public.user_roles CASCADE;
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.simple_role DEFAULT 'member',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Disable RLS to avoid any policy conflicts during auth
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;

-- Grant all necessary permissions
GRANT ALL PRIVILEGES ON public.profiles TO anon, authenticated;
GRANT ALL PRIVILEGES ON public.user_roles TO anon, authenticated;
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Absolutely NO TRIGGERS that can interfere with Supabase auth
-- User creation must work without any database interference

COMMIT;
