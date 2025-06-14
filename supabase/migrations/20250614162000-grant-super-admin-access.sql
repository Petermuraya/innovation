
-- Grant super admin role to the existing admin user
-- This assumes sammypeter1944@gmail.com is the admin that needs super admin access

-- First, get the user ID for sammypeter1944@gmail.com from members table
-- and update their role to super_admin
DO $$
DECLARE
    admin_user_id uuid;
BEGIN
    -- Get the user_id for the admin email
    SELECT user_id INTO admin_user_id
    FROM public.members 
    WHERE email = 'sammypeter1944@gmail.com'
    LIMIT 1;
    
    -- If user exists, grant super_admin role
    IF admin_user_id IS NOT NULL THEN
        -- Insert or update the user role to super_admin
        INSERT INTO public.user_roles (user_id, role)
        VALUES (admin_user_id, 'super_admin')
        ON CONFLICT (user_id) 
        DO UPDATE SET role = 'super_admin';
        
        -- Also ensure they have approved member status
        UPDATE public.members 
        SET registration_status = 'approved'
        WHERE user_id = admin_user_id;
        
        RAISE NOTICE 'Super admin role granted to user: %', admin_user_id;
    ELSE
        RAISE NOTICE 'No user found with email: sammypeter1944@gmail.com';
    END IF;
END $$;

-- Ensure super_admin role has all necessary permissions by adding any missing ones
INSERT INTO public.role_permissions (role, permission_key, permission_name, description) VALUES
('super_admin', 'full_system_access', 'Full System Access', 'Complete access to all system features and data'),
('super_admin', 'member_management', 'Member Management', 'Full member account management'),
('super_admin', 'admin_role_assignment', 'Admin Role Assignment', 'Assign and revoke admin roles'),
('super_admin', 'certificate_management', 'Certificate Management', 'Upload and manage all certificates'),
('super_admin', 'election_management', 'Election Management', 'Manage elections and voting'),
('super_admin', 'project_management', 'Project Management', 'Full project oversight and management')
ON CONFLICT (role, permission_key) DO NOTHING;
