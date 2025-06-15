
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type ComprehensiveRole = 'member' | 'super_admin' | 'general_admin' | 'community_admin' | 'events_admin' | 'projects_admin' | 'finance_admin' | 'content_admin' | 'technical_admin' | 'marketing_admin' | 'chairman' | 'vice_chairman';

interface User {
  id: string;
  email: string;
  name: string;
  roles: ComprehensiveRole[];
  registration_status: string;
  phone?: string;
  course?: string;
  created_at: string;
}

export const useOptimizedUserManagement = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);

  const fetchUsers = useCallback(async (force = false) => {
    // Debounce rapid fetches unless forced
    const now = Date.now();
    if (!force && now - lastFetchTime < 1000) {
      console.log('Skipping fetch due to debounce');
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching users with optimized query...');
      
      // Use a direct query instead of the view to avoid caching issues
      const { data: memberData, error: memberError } = await supabase
        .from('members')
        .select(`
          id,
          user_id,
          name,
          email,
          phone,
          course,
          registration_status,
          created_at
        `)
        .order('created_at', { ascending: false });

      if (memberError) {
        console.error('Error fetching members:', memberError);
        throw memberError;
      }

      if (!memberData || memberData.length === 0) {
        console.log('No members found');
        setUsers([]);
        setLastFetchTime(now);
        return;
      }

      // Get user IDs for role lookup
      const userIds = memberData.map(m => m.user_id).filter(Boolean);
      
      // Fetch roles separately to avoid view caching
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role')
        .in('user_id', userIds);

      if (rolesError) {
        console.error('Error fetching roles:', rolesError);
        // Continue without roles rather than failing completely
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

      // Format the data
      const formattedUsers: User[] = memberData
        .filter(member => member.user_id) // Only include members with valid user_id
        .map(member => ({
          id: member.user_id!,
          email: member.email,
          name: member.name,
          roles: rolesMap.get(member.user_id!) || ['member'],
          registration_status: member.registration_status,
          phone: member.phone,
          course: member.course,
          created_at: member.created_at,
        }));

      console.log('Successfully fetched and formatted users:', formattedUsers.length);
      setUsers(formattedUsers);
      setLastFetchTime(now);

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
  }, [toast, lastFetchTime]);

  const removeUserFromState = useCallback((userId: string) => {
    console.log('Removing user from local state:', userId);
    setUsers(prevUsers => {
      const newUsers = prevUsers.filter(u => u.id !== userId);
      console.log('Updated local state, new count:', newUsers.length);
      return newUsers;
    });
  }, []);

  const addUserToState = useCallback((user: User) => {
    console.log('Adding user to local state:', user.name);
    setUsers(prevUsers => {
      const userExists = prevUsers.some(u => u.id === user.id);
      if (userExists) {
        console.log('User already exists, updating:', user.name);
        return prevUsers.map(u => u.id === user.id ? user : u);
      } else {
        console.log('Adding new user:', user.name);
        return [...prevUsers, user];
      }
    });
  }, []);

  const updateUserInState = useCallback((updatedUser: User) => {
    console.log('Updating user in local state:', updatedUser.name);
    setUsers(prevUsers => 
      prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u)
    );
  }, []);

  // Set up real-time subscriptions with better conflict resolution
  useEffect(() => {
    fetchUsers(true);

    // Subscribe to members table changes
    const membersChannel = supabase
      .channel('optimized-members-changes')
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'members'
        },
        (payload) => {
          console.log('Member deleted via real-time:', payload.old);
          if (payload.old?.user_id) {
            removeUserFromState(payload.old.user_id);
          }
          // Force refresh after a short delay to ensure consistency
          setTimeout(() => fetchUsers(true), 500);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'members'
        },
        (payload) => {
          console.log('Member added via real-time:', payload.new);
          setTimeout(() => fetchUsers(true), 500);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'members'
        },
        (payload) => {
          console.log('Member updated via real-time:', payload.new);
          setTimeout(() => fetchUsers(true), 500);
        }
      )
      .subscribe((status) => {
        console.log('Optimized members subscription status:', status);
      });

    // Subscribe to user roles changes
    const rolesChannel = supabase
      .channel('optimized-roles-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_roles'
        },
        (payload) => {
          console.log('User roles changed via real-time:', payload);
          setTimeout(() => fetchUsers(true), 500);
        }
      )
      .subscribe((status) => {
        console.log('Optimized roles subscription status:', status);
      });

    return () => {
      console.log('Cleaning up optimized subscriptions');
      supabase.removeChannel(membersChannel);
      supabase.removeChannel(rolesChannel);
    };
  }, [fetchUsers, removeUserFromState]);

  return {
    users,
    loading,
    fetchUsers,
    removeUserFromState,
    addUserToState,
    updateUserInState
  };
};
