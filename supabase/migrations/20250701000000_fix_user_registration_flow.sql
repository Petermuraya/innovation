-- Fix user registration flow by creating proper tables and triggers

-- Create profiles table to store auth.users metadata
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  display_name TEXT,
  full_name TEXT,
  phone TEXT,
  department TEXT,
  course TEXT,
  year_of_study TEXT,
  communities TEXT, -- JSON string of selected communities
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" 
  ON public.profiles 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'super_admin', 'patron')
    )
  );

CREATE POLICY "Admins can manage all profiles" 
  ON public.profiles 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'super_admin', 'patron')
    )
  );

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_communities TEXT[];
BEGIN
  -- Create profile record
  INSERT INTO public.profiles (
    user_id,
    display_name,
    full_name,
    phone,
    department,
    course,
    year_of_study,
    communities
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'department', ''),
    COALESCE(NEW.raw_user_meta_data->>'course', ''),
    COALESCE(NEW.raw_user_meta_data->>'year_of_study', ''),
    COALESCE(NEW.raw_user_meta_data->>'communities', '[]')
  );

  -- Parse communities from JSON string
  IF NEW.raw_user_meta_data->>'communities' IS NOT NULL THEN
    BEGIN
      user_communities := ARRAY(SELECT json_array_elements_text((NEW.raw_user_meta_data->>'communities')::json));
    EXCEPTION
      WHEN OTHERS THEN
        user_communities := '{}';
    END;
  ELSE
    user_communities := '{}';
  END IF;

  -- Create member record with pending status
  INSERT INTO public.members (
    user_id,
    name,
    email,
    phone,
    course,
    year_of_study,
    registration_status,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'course', ''),
    COALESCE(NEW.raw_user_meta_data->>'year_of_study', ''),
    'pending',
    now(),
    now()
  );

  -- Assign default member role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'member')
  ON CONFLICT (user_id) DO NOTHING;

  -- Create community memberships for selected communities
  IF array_length(user_communities, 1) > 0 THEN
    INSERT INTO public.community_memberships (
      user_id,
      community_id,
      join_date,
      is_active
    )
    SELECT 
      NEW.id,
      c.id,
      now(),
      true
    FROM public.communities c
    WHERE c.id = ANY(user_communities)
    ON CONFLICT (user_id, community_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create function to update profiles updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_profiles_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create trigger for updating profiles timestamp
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_profiles_updated_at();

-- Ensure communities table exists with basic communities
INSERT INTO public.communities (id, name, description, created_at) VALUES
  ('web-dev', 'Web Development', 'Frontend and backend web development community', now()),
  ('mobile-dev', 'Mobile Development', 'Mobile app development for iOS and Android', now()),
  ('data-science', 'Data Science & AI', 'Data analysis, machine learning, and artificial intelligence', now()),
  ('cybersecurity', 'Cybersecurity', 'Information security and ethical hacking', now()),
  ('iot', 'Internet of Things (IoT)', 'Connected devices and IoT development', now()),
  ('blockchain', 'Blockchain & Crypto', 'Blockchain technology and cryptocurrency', now()),
  ('game-dev', 'Game Development', 'Video game development and design', now()),
  ('ui-ux', 'UI/UX Design', 'User interface and user experience design', now())
ON CONFLICT (id) DO NOTHING;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_display_name ON public.profiles(display_name);