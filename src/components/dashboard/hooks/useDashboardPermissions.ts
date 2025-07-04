
import { useAuth } from '@/contexts/AuthContext';
import { useMemberStatus } from '@/hooks/useMemberStatus';
import { useRolePermissions } from '@/hooks/useRolePermissions';

export const useDashboardPermissions = () => {
  const { member, loading: authLoading, isAdmin, memberRole } = useAuth();
  const { isApproved, loading: statusLoading } = useMemberStatus();
  const { roleInfo, loading: roleLoading, hasRolePermission } = useRolePermissions();

  const memberData = member ? {
    name: member.email?.split('@')[0] || 'Member',
    email: member.email || '',
    user_id: member.id,
    avatar_url: null
  } : null;

  const adminCommunities = []; // This would come from a separate hook in a real implementation

  // Admin access is determined by having any admin role
  const hasAdminAccess = isAdmin || (memberRole ? hasRolePermission('manage_members') : false);

  const isLoading = authLoading || statusLoading || roleLoading;

  console.log('Dashboard permissions - isAdmin:', isAdmin, 'memberRole:', memberRole, 'hasAdminAccess:', hasAdminAccess);

  return {
    member,
    memberData,
    isApproved,
    adminCommunities,
    roleInfo: roleInfo || { assignedRole: memberRole || 'member', inheritedRoles: [memberRole || 'member'], permissions: [] },
    hasAdminAccess,
    isLoading,
    authLoading,
    roleLoading
  };
};
