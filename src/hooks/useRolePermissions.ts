
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

type SimpleRole = 'member' | 'admin' | 'super_admin' | 'general_admin' | 'community_admin';

interface MemberRoleInfo {
  assignedRole: SimpleRole;
  inheritedRoles: SimpleRole[];
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
          // Get the highest priority role
          const roles = data.map(r => r.role as SimpleRole);
          const adminRoles = ['super_admin', 'general_admin', 'community_admin', 'admin'];
          const highestRole = roles.find(role => adminRoles.includes(role)) || roles[0] || 'member';
          
          setRoleInfo({
            assignedRole: highestRole,
            inheritedRoles: roles,
            permissions: ['read', 'write'] // Basic permissions
          });
        } else {
          setRoleInfo({
            assignedRole: 'member',
            inheritedRoles: ['member'],
            permissions: ['read']
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

  const hasRole = async (role: SimpleRole): Promise<boolean> => {
    if (!user) return false;
    
    // Super admin always has access to everything
    if (roleInfo?.assignedRole === 'super_admin') return true;
    
    return roleInfo?.inheritedRoles.includes(role) || false;
  };

  const hasPermission = async (permission: string): Promise<boolean> => {
    if (!user) return false;
    
    // Super admin always has all permissions
    if (roleInfo?.assignedRole === 'super_admin') return true;
    
    return roleInfo?.permissions.includes(permission) || false;
  };

  const isAdmin = roleInfo?.assignedRole !== 'member' && roleInfo?.assignedRole !== null;
  const isSuperAdmin = roleInfo?.assignedRole === 'super_admin';
  const isChairman = roleInfo?.assignedRole === 'chairman';
  const isViceChairman = roleInfo?.assignedRole === 'vice_chairman';

  return {
    roleInfo,
    loading,
    hasRole,
    hasPermission,
    isAdmin,
    isSuperAdmin,
    isChairman,
    isViceChairman
  };
};
