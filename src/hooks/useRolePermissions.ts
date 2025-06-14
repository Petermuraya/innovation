
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

type ComprehensiveRole = 'member' | 'super_admin' | 'general_admin' | 'community_admin' | 'events_admin' | 'projects_admin' | 'finance_admin' | 'content_admin' | 'technical_admin' | 'marketing_admin';

interface UserRoleInfo {
  assignedRole: ComprehensiveRole;
  inheritedRoles: ComprehensiveRole[];
  permissions: string[];
}

export const useRolePermissions = () => {
  const { user } = useAuth();
  const [roleInfo, setRoleInfo] = useState<UserRoleInfo | null>(null);
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
          .from('user_roles_with_hierarchy')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching role info:', error);
          setRoleInfo(null);
        } else {
          setRoleInfo({
            assignedRole: data.assigned_role,
            inheritedRoles: data.inherited_roles || [],
            permissions: data.permissions || []
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

  const hasRole = async (role: ComprehensiveRole): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const { data, error } = await supabase.rpc('has_role_or_higher', {
        _user_id: user.id,
        _required_role: role
      });
      
      return error ? false : data;
    } catch {
      return false;
    }
  };

  const hasPermission = async (permission: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const { data, error } = await supabase.rpc('has_permission', {
        _user_id: user.id,
        _permission_key: permission
      });
      
      return error ? false : data;
    } catch {
      return false;
    }
  };

  const isAdmin = roleInfo?.assignedRole !== 'member';
  const isSuperAdmin = roleInfo?.assignedRole === 'super_admin';

  return {
    roleInfo,
    loading,
    hasRole,
    hasPermission,
    isAdmin,
    isSuperAdmin
  };
};
