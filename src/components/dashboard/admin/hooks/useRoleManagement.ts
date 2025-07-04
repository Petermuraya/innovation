
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { AppRole, UserWithRole } from '@/types/roles';

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
      
      // Use the members table directly since member_management_view might not be available
      const { data: memberData, error: memberError } = await supabase
        .from('members')
        .select(`
          user_id,
          name,
          email
        `)
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

      // Get user roles for all members
      const userIds = memberData.map(m => m.user_id).filter(Boolean);
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('user_id, role')
        .in('user_id', userIds);

      if (roleError) {
        console.error('Error fetching roles for role management:', roleError);
      }

      // Format users with roles
      const validUsers = memberData
        .filter(member => member.user_id)
        .map(member => {
          const userRoles = roleData?.filter(r => r.user_id === member.user_id).map(r => r.role as AppRole) || [];
          
          return {
            user_id: member.user_id!,
            name: member.name,
            email: member.email,
            roles: userRoles.length > 0 ? userRoles : ['member' as AppRole]
          };
        });
      
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

  const assignRole = async (userId: string, role: AppRole) => {
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

  const removeRole = async (userId: string, role: AppRole) => {
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
