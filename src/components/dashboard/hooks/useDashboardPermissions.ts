
import { useAuth } from '@/contexts/AuthContext';
import { useMemberStatus } from '@/hooks/useMemberStatus';
import { useCommunityAdminData } from '@/hooks/useCommunityAdminData';
import { useRolePermissions } from '@/hooks/useRolePermissions';

export const useDashboardPermissions = () => {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const { loading: statusLoading, isApproved, memberData } = useMemberStatus();
  const { communities: adminCommunities, loading: communityLoading } = useCommunityAdminData();
  const { roleInfo, loading: roleLoading, isAdmin: roleBasedAdmin } = useRolePermissions();
  
  // Combined admin check - either from AuthContext or role permissions
  const hasAdminAccess = isAdmin || roleBasedAdmin;

  const isLoading = authLoading || statusLoading || communityLoading || roleLoading;

  return {
    user,
    memberData,
    isApproved,
    adminCommunities,
    roleInfo,
    hasAdminAccess,
    isLoading,
    authLoading,
    roleLoading
  };
};
