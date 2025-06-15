
-- First, drop the existing default
ALTER TABLE public.admin_requests 
ALTER COLUMN admin_type DROP DEFAULT;

-- Update any existing records that might have 'general' to 'general_admin'
UPDATE public.admin_requests 
SET admin_type = 'general_admin' 
WHERE admin_type = 'general';

-- Update any existing records that might have 'community' to 'community_admin'
UPDATE public.admin_requests 
SET admin_type = 'community_admin' 
WHERE admin_type = 'community';

-- Now alter the column type to use the enum
ALTER TABLE public.admin_requests 
ALTER COLUMN admin_type TYPE comprehensive_role 
USING admin_type::comprehensive_role;

-- Set the new default value
ALTER TABLE public.admin_requests 
ALTER COLUMN admin_type SET DEFAULT 'general_admin';
