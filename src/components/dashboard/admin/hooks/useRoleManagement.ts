
import { useState, useEffect, useCallback, useRef } from 'react';
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
  const fetchingRef = useRef(false);
  const channelRef = useRef<any>(null);

  const fetchUsers = useCallback(async (force = false) => {
    if (!canManageRoles) return;
    
    // Prevent concurrent fetches
    if (fetchingRef.current && !force) {
      console.log('Skipping role management fetch - already in progress');
      return;
    }
    
    // Debounce rapid fetches unless forced
    const now = Date.now();
    if (!force && now - lastFetchTime < 2000) {
      console.log('Skipping role management fetch due to debounce');
      return;
    }
    
    try {
      fetchingRef.current = true;
      setLoading(true);
      console.log('Fetching users for role management with optimized query...');
      
      // Use the optimized view
      const { data: userData, error } = await supabase
        .from('member_management_view')
        .select('user_id, name, email, roles')
        .not('user_id', 'is', null)
        .order('name');

      if (error) {
        console.error('Error fetching users for role management:', error);
        throw error;
      }

      if (!userData || userData.length === 0) {
        console.log('No users found for role management');
        setUsers([]);
        setLastFetchTime(now);
        return;
      }

      // Format users with roles
      const validUsers = userData
        .filter(user => user.user_id)
        .map(user => ({
          user_id: user.user_id!,
          name: user.name,
          email: user.email,
          roles: user.roles || ['member']
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
      fetchingRef.current = false;
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

      // Clean up any existing channel
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }

      // Set up real-time subscription with optimized handling
      const channel = supabase
        .channel('role-mgmt-realtime-optimized')
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
            setTimeout(() => {
              if (!fetchingRef.current) {
                fetchUsers(true);
              }
            }, 1000);
          }
        )
        .subscribe((status) => {
          console.log('Role management subscription status:', status);
        });

      channelRef.current = channel;

      return () => {
        console.log('Cleaning up role management subscriptions');
        if (channelRef.current) {
          supabase.removeChannel(channelRef.current);
          channelRef.current = null;
        }
      };
    }
  }, [canManageRoles]);

  return {
    users,
    loading,
    assignRole,
    removeRole,
    fetchUsers: () => fetchUsers(true)
  };
};
