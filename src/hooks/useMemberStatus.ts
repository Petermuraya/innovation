
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import type { AppRole } from '@/types/roles';

interface MemberStatus {
  isApproved: boolean;
  registration_status: string;
  roles: AppRole[];
  loading: boolean;
}

export const useMemberStatus = () => {
  const { user } = useAuth();
  const [status, setStatus] = useState<MemberStatus>({
    isApproved: false,
    registration_status: 'pending',
    roles: [],
    loading: true
  });

  useEffect(() => {
    const fetchMemberStatus = async () => {
      if (!user) {
        setStatus({
          isApproved: false,
          registration_status: 'pending',
          roles: [],
          loading: false
        });
        return;
      }

      try {
        // Get member status
        const { data: memberData, error: memberError } = await supabase
          .from('members')
          .select('registration_status')
          .eq('user_id', user.id)
          .single();

        // Get user roles
        const { data: rolesData, error: rolesError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);

        if (memberError && memberError.code !== 'PGRST116') {
          console.error('Error fetching member status:', memberError);
        }

        if (rolesError) {
          console.error('Error fetching user roles:', rolesError);
        }

        const roles = rolesData?.map(r => r.role as AppRole) || [];
        const registrationStatus = memberData?.registration_status || 'pending';
        
        // User is approved if their registration is approved OR they have admin roles
        const isApproved = registrationStatus === 'approved' || 
          roles.some(role => ['super_admin', 'general_admin', 'community_admin', 'admin', 'chairman', 'vice_chairman'].includes(role));

        setStatus({
          isApproved,
          registration_status: registrationStatus,
          roles,
          loading: false
        });

      } catch (error) {
        console.error('Error in useMemberStatus:', error);
        setStatus({
          isApproved: false,
          registration_status: 'pending',
          roles: [],
          loading: false
        });
      }
    };

    fetchMemberStatus();
  }, [user]);

  return status;
};
