
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import type { AppRole, ROLE_PERMISSIONS, hasPermission } from '@/types/roles';

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
      'patron',
      'chairperson', 
      'vice-chairperson',
      'treasurer',
      'auditor',
      'secretary',
      'vice-secretary',
      'organizing-secretary',
      'community-lead-web',
      'community-lead-cybersecurity',
      'community-lead-mobile',
      'community-lead-iot',
      'community-lead-ml-ai',
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

  const isPatron = roleInfo?.assignedRole === 'patron';
  const isChairperson = roleInfo?.assignedRole === 'chairperson';
  const isViceChairperson = roleInfo?.assignedRole === 'vice-chairperson';
  const isTreasurer = roleInfo?.assignedRole === 'treasurer';
  const isAuditor = roleInfo?.assignedRole === 'auditor';
  const isSecretary = ['secretary', 'vice-secretary', 'organizing-secretary'].includes(roleInfo?.assignedRole || '');
  const isCommunityLead = roleInfo?.assignedRole?.startsWith('community-lead-') || false;
  const isAdmin = isPatron || isChairperson || isViceChairperson;
  const isSuperAdmin = isPatron;
  
  // Add missing properties
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
