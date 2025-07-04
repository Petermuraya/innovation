
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { AppRole } from '@/types/roles';

interface MemberData {
  id: string;
  name: string;
  email: string;
  registration_status: string;
  roles: AppRole[];
}

interface AdminCommunity {
  id: string;
  name: string;
}

interface RoleInfo {
  roles: AppRole[];
  hasAdminAccess: boolean;
}

export const useMemberDashboard = () => {
  const { member, loading: authLoading } = useAuth();
  const [memberData, setMemberData] = useState<MemberData | null>(null);
  const [adminCommunities, setAdminCommunities] = useState<AdminCommunity[]>([]);
  const [roleInfo, setRoleInfo] = useState<RoleInfo>({ roles: ['member'], hasAdminAccess: false });
  const [isLoading, setIsLoading] = useState(true);
  const [roleLoading, setRoleLoading] = useState(true);

  const isApproved = memberData?.registration_status === 'approved';
  const hasAdminAccess = roleInfo.hasAdminAccess;

  useEffect(() => {
    if (!member || authLoading) return;

    const fetchMemberData = async () => {
      try {
        setIsLoading(true);
        
        // Get member data
        const { data: memberInfo, error: memberError } = await supabase
          .from('members')
          .select('*')
          .eq('user_id', member.id)
          .single();

        if (memberError && memberError.code !== 'PGRST116') {
          throw memberError;
        }

        // Get user roles
        const { data: rolesData, error: rolesError } = await supabase
          .from('user_roles' as any)
          .select('role')
          .eq('user_id', member.id);

        if (rolesError) {
          console.error('Error fetching roles:', rolesError);
        }

        const userRoles = rolesData?.map((r: any) => r.role as AppRole) || ['member'];
        const hasAdmin = userRoles.some(role => 
          ['super_admin', 'general_admin', 'community_admin', 'admin', 'chairman', 'vice_chairman'].includes(role)
        );

        setMemberData({
          id: memberInfo?.id || member.id,
          name: memberInfo?.name || member.email || '',
          email: memberInfo?.email || member.email || '',
          registration_status: memberInfo?.registration_status || 'pending',
          roles: userRoles,
        });

        setRoleInfo({
          roles: userRoles,
          hasAdminAccess: hasAdmin,
        });

        // Get admin communities if user is community admin
        if (userRoles.includes('community_admin')) {
          const { data: adminCommunitiesData, error: communitiesError } = await supabase
            .from('community_admin_roles')
            .select('community_id, community_groups(id, name)')
            .eq('user_id', member.id)
            .eq('is_active', true);

          if (!communitiesError && adminCommunitiesData) {
            setAdminCommunities(
              adminCommunitiesData.map((item: any) => ({
                id: item.community_groups.id,
                name: item.community_groups.name,
              }))
            );
          }
        }
      } catch (error) {
        console.error('Error fetching member dashboard data:', error);
      } finally {
        setIsLoading(false);
        setRoleLoading(false);
      }
    };

    fetchMemberData();
  }, [member, authLoading]);

  return {
    memberData,
    isApproved,
    adminCommunities,
    roleInfo,
    hasAdminAccess,
    isLoading,
    authLoading,
    roleLoading,
  };
};
