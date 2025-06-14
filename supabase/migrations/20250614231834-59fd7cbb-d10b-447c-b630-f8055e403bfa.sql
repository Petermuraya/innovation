
-- First, let's add the missing community dashboards table for community projects
CREATE TABLE IF NOT EXISTS public.community_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  community_id UUID NOT NULL REFERENCES public.community_groups(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  github_url TEXT,
  status TEXT DEFAULT 'active',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on community_projects
ALTER TABLE public.community_projects ENABLE ROW LEVEL SECURITY;

-- Create policies for community_projects
CREATE POLICY "Anyone can view community projects" 
  ON public.community_projects 
  FOR SELECT 
  USING (true);

CREATE POLICY "Community admins can manage projects" 
  ON public.community_projects 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.community_admin_roles car
      WHERE car.user_id = auth.uid() 
      AND car.community_id = community_projects.community_id 
      AND car.is_active = true
    )
    OR 
    public.has_role_or_higher(auth.uid(), 'general_admin')
  );

-- Update the user_roles table to use comprehensive_role enum if not already done
-- First check if we need to add the chairman and vice_chairman values
DO $$
BEGIN
    -- Add chairman if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'chairman' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'comprehensive_role')) THEN
        ALTER TYPE comprehensive_role ADD VALUE 'chairman';
    END IF;
    
    -- Add vice_chairman if it doesn't exist  
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'vice_chairman' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'comprehensive_role')) THEN
        ALTER TYPE comprehensive_role ADD VALUE 'vice_chairman';
    END IF;
END$$;

-- Update user_roles table to use comprehensive_role if it's not already
DO $$
BEGIN
    -- Check if the role column is using user_role type and needs to be updated
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_roles' 
        AND column_name = 'role' 
        AND udt_name = 'user_role'
    ) THEN
        -- Drop existing policies on user_roles if any
        DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
        DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
        
        -- Temporarily disable RLS
        ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;
        
        -- Change the column type
        ALTER TABLE public.user_roles ALTER COLUMN role TYPE comprehensive_role USING role::text::comprehensive_role;
        
        -- Re-enable RLS
        ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
        
        -- Recreate policies
        CREATE POLICY "Users can view their own roles" 
          ON public.user_roles 
          FOR SELECT 
          USING (auth.uid() = user_id);
          
        CREATE POLICY "Admins can manage all roles" 
          ON public.user_roles 
          FOR ALL 
          USING (public.has_role_or_higher(auth.uid(), 'general_admin'));
    END IF;
END$$;

-- Create a function to check if user can assign community admins
CREATE OR REPLACE FUNCTION public.can_assign_community_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id 
    AND role IN ('super_admin', 'chairman', 'vice_chairman')
  )
$$;

-- Create a validation function for community admin assignments
CREATE OR REPLACE FUNCTION public.validate_community_admin_assignment()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Check if the user being assigned is an approved member
  IF NOT EXISTS (
    SELECT 1 FROM public.members m 
    WHERE m.user_id = NEW.user_id 
    AND m.registration_status = 'approved'
  ) THEN
    RAISE EXCEPTION 'User must be an approved member to be assigned as community admin';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to validate community admin assignments
DROP TRIGGER IF EXISTS validate_community_admin_trigger ON public.community_admin_roles;
CREATE TRIGGER validate_community_admin_trigger
  BEFORE INSERT OR UPDATE ON public.community_admin_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_community_admin_assignment();

-- Update the community_admin_roles table policies
DROP POLICY IF EXISTS "Community admins can view their roles" ON public.community_admin_roles;
DROP POLICY IF EXISTS "Authorized users can manage community admin roles" ON public.community_admin_roles;

CREATE POLICY "Community admins can view community admin roles" 
  ON public.community_admin_roles 
  FOR SELECT 
  USING (
    auth.uid() = user_id 
    OR public.has_role_or_higher(auth.uid(), 'general_admin')
    OR public.can_assign_community_admin(auth.uid())
  );

CREATE POLICY "Authorized users can manage community admin roles" 
  ON public.community_admin_roles 
  FOR ALL 
  USING (
    public.has_role_or_higher(auth.uid(), 'general_admin')
    OR public.can_assign_community_admin(auth.uid())
  );
