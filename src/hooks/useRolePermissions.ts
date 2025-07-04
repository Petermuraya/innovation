
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { AppRole, ROLE_PERMISSIONS, hasPermission } from '@/types/roles';

interface MemberRoleInfo {
  assignedRole: AppRole;
  inheritedRoles: AppRole[];
  permissions: string[];
}

export const useRolePermissions = () => {
  const { user } = useAuth();
  const [roleInfo, setRoleInfo] = useState<MemberRoleInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoleInfo = async () => {
      if (!user) {
        setRoleInfo(null);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error fetching role info:', error);
          setRoleInfo(null);
        } else if (data && data.length > 0) {
          const roles = data.map(r => r.role as AppRole);
          const highestRole = getHighestRole(roles);
          
          setRoleInfo({
            assignedRole: highestRole,
            inheritedRoles: roles,
            permissions: getAllPermissions(roles)
          });
        } else {
          setRoleInfo({
            assignedRole: 'member',
            inheritedRoles: ['member'],
            permissions: ROLE_PERMISSIONS.member
          });
        }
      } catch (error) {
        console.error('Failed to fetch role info:', error);
        setRoleInfo(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRoleInfo();
  }, [user]);

  const getHighestRole = (roles: AppRole[]): AppRole => {
    const hierarchy: AppRole[] = [
      'super_admin',
      'chairman', 
      'vice_chairman',
      'general_admin',
      'admin',
      'finance_admin',
      'community_admin',
      'events_admin',
      'projects_admin',
      'content_admin',
      'technical_admin',
      'marketing_admin',
      'member'
    ];
    
    for (const role of hierarchy) {
      if (roles.includes(role)) {
        return role;
      }
    }
    return 'member';
  };

  const getAllPermissions = (roles: AppRole[]): string[] => {
    const allPermissions = new Set<string>();
    roles.forEach(role => {
      ROLE_PERMISSIONS[role]?.forEach(permission => allPermissions.add(permission));
    });
    return Array.from(allPermissions);
  };

  const hasRolePermission = (permission: string): boolean => {
    if (!roleInfo) return false;
    return hasPermission(roleInfo.inheritedRoles, permission);
  };

  const hasRole = async (role: AppRole): Promise<boolean> => {
    if (!user) return false;
    return roleInfo?.inheritedRoles.includes(role) || false;
  };

  const hasPermissionCheck = async (permission: string): Promise<boolean> => {
    if (!user) return false;
    return hasRolePermission(permission);
  };

  const isPatron = roleInfo?.assignedRole === 'super_admin';
  const isChairperson = roleInfo?.assignedRole === 'chairman';
  const isViceChairperson = roleInfo?.assignedRole === 'vice_chairman';
  const isTreasurer = roleInfo?.assignedRole === 'finance_admin';
  const isAuditor = roleInfo?.assignedRole === 'finance_admin';
  const isSecretary = ['content_admin', 'events_admin'].includes(roleInfo?.assignedRole || '');
  const isCommunityLead = roleInfo?.assignedRole === 'community_admin';
  const isAdmin = ['super_admin', 'chairman', 'vice_chairman', 'general_admin', 'admin'].includes(roleInfo?.assignedRole || '');
  const isSuperAdmin = isPatron;
  
  // Add missing properties for backwards compatibility
  const isChairman = isChairperson;
  const isViceChairman = isViceChairperson;

  return {
    roleInfo,
    loading,
    hasRole,
    hasPermission: hasPermissionCheck,
    hasRolePermission,
    isAdmin,
    isSuperAdmin,
    isPatron,
    isChairperson,
    isViceChairperson,
    isTreasurer,
    isAuditor,
    isSecretary,
    isCommunityLead,
    isChairman,
    isViceChairman
  };
};
