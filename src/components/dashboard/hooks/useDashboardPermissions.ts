
import { useAuth } from '@/contexts/AuthContext';
import { useMemberStatus } from '@/hooks/useMemberStatus';
import { useRolePermissions } from '@/hooks/useRolePermissions';

export const useDashboardPermissions = () => {
  const { user, loading: authLoading } = useAuth();
  const { isApproved, loading: statusLoading } = useMemberStatus();
  const { roleInfo, loading: roleLoading, isAdmin, hasRolePermission } = useRolePermissions();

  const memberData = user ? {
    name: user.email?.split('@')[0] || 'User',
    email: user.email || '',
    user_id: user.id,
    avatar_url: null
  } : null;

  const adminCommunities = []; // This would come from a separate hook in a real implementation

  const hasAdminAccess = isAdmin || hasRolePermission('manage_users');

  const isLoading = authLoading || statusLoading || roleLoading;

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
