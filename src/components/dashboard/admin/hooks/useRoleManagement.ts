
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type ComprehensiveRole = 'member' | 'super_admin' | 'general_admin' | 'community_admin' | 'events_admin' | 'projects_admin' | 'finance_admin' | 'content_admin' | 'technical_admin' | 'marketing_admin' | 'chairman' | 'vice_chairman';

interface UserWithRole {
  user_id: string;
  name: string;
  email: string;
  roles: ComprehensiveRole[];
}

export const useRoleManagement = (canManageRoles: boolean) => {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);

  const fetchUsers = useCallback(async (force = false) => {
    if (!canManageRoles) return;
    
    // Debounce rapid fetches unless forced
    const now = Date.now();
    if (!force && now - lastFetchTime < 1000) {
      console.log('Skipping role management fetch due to debounce');
      return;
    }
    
    try {
      setLoading(true);
      console.log('Fetching users for role management with optimized query...');
      
      // Use direct queries instead of view to avoid caching
      const { data: memberData, error: memberError } = await supabase
        .from('members')
        .select('user_id, name, email')
        .not('user_id', 'is', null)
        .order('name');

      if (memberError) {
        console.error('Error fetching members for role management:', memberError);
        throw memberError;
      }

      if (!memberData || memberData.length === 0) {
        console.log('No members found for role management');
        setUsers([]);
        setLastFetchTime(now);
        return;
      }

      // Get roles separately
      const userIds = memberData.map(m => m.user_id).filter(Boolean);
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role')
        .in('user_id', userIds);

      if (rolesError) {
        console.error('Error fetching roles for role management:', rolesError);
        // Continue without roles
      }

      // Create roles map
      const rolesMap = new Map<string, ComprehensiveRole[]>();
      if (rolesData) {
        rolesData.forEach(roleRecord => {
          if (!rolesMap.has(roleRecord.user_id)) {
            rolesMap.set(roleRecord.user_id, []);
          }
          rolesMap.get(roleRecord.user_id)?.push(roleRecord.role as ComprehensiveRole);
        });
      }

      // Format users with roles
      const validUsers = memberData
        .filter(user => user.user_id)
        .map(user => ({
          user_id: user.user_id!,
          name: user.name,
          email: user.email,
          roles: rolesMap.get(user.user_id!) || ['member']
        }));
      
      console.log('Fetched users for role management:', validUsers.length);
      setUsers(validUsers);
      setLastFetchTime(now);
    } catch (error) {
      console.error('Error fetching users for role management:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [canManageRoles, toast, lastFetchTime]);

  const assignRole = async (userId: string, role: ComprehensiveRole) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('user_roles')
        .upsert({
          user_id: userId,
          role: role
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Role assigned successfully",
      });

      // Force immediate refresh
      await fetchUsers(true);
    } catch (error) {
      console.error('Error assigning role:', error);
      toast({
        title: "Error",
        description: "Failed to assign role",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeRole = async (userId: string, role: ComprehensiveRole) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', role);

      if (error) {
        console.error('Error removing role:', error);
        throw error;
      }

      toast({
        title: "Success",
        description: "Role removed successfully",
      });

      // Force immediate refresh
      await fetchUsers(true);
    } catch (error) {
      console.error('Error removing role:', error);
      toast({
        title: "Error",
        description: "Failed to remove role",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (canManageRoles) {
      fetchUsers(true);

      // Set up real-time subscription with optimized handling
      const channel = supabase
        .channel('role-mgmt-realtime-optimized')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'members'
          },
          (payload) => {
            console.log('Members table changed (role management):', payload.eventType);
            // Delay refresh to allow database to settle
            setTimeout(() => fetchUsers(true), 500);
          }
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'user_roles'
          },
          (payload) => {
            console.log('User roles changed (role management):', payload.eventType);
            // Delay refresh to allow database to settle
            setTimeout(() => fetchUsers(true), 500);
          }
        )
        .subscribe((status) => {
          console.log('Role management subscription status:', status);
        });

      return () => {
        console.log('Cleaning up role management subscriptions');
        supabase.removeChannel(channel);
      };
    }
  }, [canManageRoles, fetchUsers]);

  return {
    users,
    loading,
    assignRole,
    removeRole,
    fetchUsers: () => fetchUsers(true)
  };
};
