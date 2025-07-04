
import { useAuth } from '@/contexts/AuthContext';
import { useMemberStatus } from '@/hooks/useMemberStatus';
import { useRolePermissions } from '@/hooks/useRolePermissions';

export const useDashboardPermissions = () => {
  const { user, loading: authLoading, isAdmin, userRole } = useAuth();
  const { isApproved, loading: statusLoading } = useMemberStatus();
  const { roleInfo, loading: roleLoading, hasRolePermission } = useRolePermissions();

  const memberData = user ? {
    name: user.email?.split('@')[0] || 'User',
    email: user.email || '',
    user_id: user.id,
    avatar_url: null
  } : null;

  const adminCommunities = []; // This would come from a separate hook in a real implementation

  // Admin access is determined by having any admin role
  const hasAdminAccess = isAdmin || hasRolePermission('manage_users');

  const isLoading = authLoading || statusLoading || roleLoading;

  console.log('Dashboard permissions - isAdmin:', isAdmin, 'userRole:', userRole, 'hasAdminAccess:', hasAdminAccess);

  return {
    user,
    memberData,
    isApproved,
    adminCommunities,
    roleInfo: roleInfo || { assignedRole: userRole, inheritedRoles: [userRole || 'member'], permissions: [] },
    hasAdminAccess,
    isLoading,
    authLoading,
    roleLoading
  };
};
