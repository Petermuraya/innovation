
-- Grant super admin role to sammypeter1944@gmail.com
-- This will find the user by email and assign them super_admin role

DO $$
DECLARE
    target_user_id uuid;
    existing_role_count integer;
BEGIN
    -- Get the user_id for the email from members table
    SELECT user_id INTO target_user_id
    FROM public.members 
    WHERE email = 'sammypeter1944@gmail.com'
    LIMIT 1;
    
    -- If user exists, grant super_admin role
    IF target_user_id IS NOT NULL THEN
        -- Check if user already has a role
        SELECT COUNT(*) INTO existing_role_count
        FROM public.user_roles 
        WHERE user_id = target_user_id;
        
        IF existing_role_count > 0 THEN
            -- Update existing role to super_admin
            UPDATE public.user_roles 
            SET role = 'super_admin'
            WHERE user_id = target_user_id;
        ELSE
            -- Insert new role
            INSERT INTO public.user_roles (user_id, role)
            VALUES (target_user_id, 'super_admin');
        END IF;
        
        -- Also ensure they have approved member status
        UPDATE public.members 
        SET registration_status = 'approved'
        WHERE user_id = target_user_id;
        
        RAISE NOTICE 'Super admin role granted to user: %', target_user_id;
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
