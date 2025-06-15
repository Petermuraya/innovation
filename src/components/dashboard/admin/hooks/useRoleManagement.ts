
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

  const fetchUsers = useCallback(async () => {
    if (!canManageRoles) return;
    
    try {
      setLoading(true);
      console.log('Fetching users for role management...');
      
      const { data, error } = await supabase
        .from('member_management_view')
        .select('user_id, name, email, roles')
        .order('name');

      if (error) {
        console.error('Error fetching users for role management:', error);
        throw error;
      }
      
      console.log('Fetched users for role management:', data?.length || 0);
      
      // Filter out any users with null user_id (which might indicate deleted users)
      const validUsers = (data || []).filter(user => user.user_id);
      setUsers(validUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [canManageRoles, toast]);

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
      await fetchUsers();
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
      await fetchUsers();
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
      fetchUsers();

      // Set up real-time subscription with more robust event handling
      const channel = supabase
        .channel('role-mgmt-realtime')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'members'
          },
          (payload) => {
            console.log('Members table changed (role management):', payload);
            // Immediately refresh when members table changes
            fetchUsers();
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
            console.log('User roles changed (role management):', payload);
            // Immediately refresh when user roles change
            fetchUsers();
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
    fetchUsers
  };
};
