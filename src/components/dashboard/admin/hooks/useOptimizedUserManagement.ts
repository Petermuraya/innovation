
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AppRole, DatabaseRole, mapAppRoleToDatabase } from '@/types/roles';

interface User {
  id: string;
  email: string;
  name: string;
  roles: AppRole[];
  registration_status: string;
  phone?: string;
  course?: string;
  created_at: string;
}

export const useOptimizedUserManagement = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);
  const fetchingRef = useRef(false);
  const channelRef = useRef<any>(null);

  const fetchUsers = useCallback(async (force = false) => {
    // Prevent concurrent fetches
    if (fetchingRef.current && !force) {
      console.log('Skipping fetch - already in progress');
      return;
    }

    // Debounce rapid fetches unless forced
    const now = Date.now();
    if (!force && now - lastFetchTime < 2000) {
      console.log('Skipping fetch due to debounce');
      return;
    }

    try {
      fetchingRef.current = true;
      setLoading(true);
      console.log('Fetching users with optimized query...');
      
      // Use the members table directly with all required fields
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

      // Get user roles for all members
      const userIds = memberData.map(m => m.user_id).filter(Boolean);
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('user_id, role')
        .in('user_id', userIds);

      if (roleError) {
        console.error('Error fetching roles:', roleError);
      }

      // Format the data using user_id as the primary key
      const formattedUsers: User[] = memberData
        .filter(member => member.user_id) // Only include members with valid user_id
        .map(member => {
          const userRoles = roleData?.filter(r => r.user_id === member.user_id).map(r => r.role as AppRole) || [];
          
          return {
            id: member.user_id!, // Use user_id as the primary identifier
            email: member.email,
            name: member.name,
            roles: userRoles.length > 0 ? userRoles : ['member'],
            registration_status: member.registration_status,
            phone: member.phone,
            course: member.course,
            created_at: member.created_at,
          };
        });

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
      fetchingRef.current = false;
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

  // Set up real-time subscriptions with better optimization
  useEffect(() => {
    fetchUsers(true);

    // Clean up any existing channel
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    // Create a single channel for all changes
    const channel = supabase
      .channel('user-management-optimized')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'members'
        },
        (payload) => {
          console.log('Members table changed:', payload.eventType);
          // Delay refresh to allow database to settle
          setTimeout(() => {
            if (!fetchingRef.current) {
              fetchUsers(true);
            }
          }, 1000);
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
          console.log('User roles changed:', payload.eventType);
          // Delay refresh to allow database to settle
          setTimeout(() => {
            if (!fetchingRef.current) {
              fetchUsers(true);
            }
          }, 1000);
        }
      )
      .subscribe((status) => {
        console.log('User management subscription status:', status);
      });

    channelRef.current = channel;

    return () => {
      console.log('Cleaning up user management subscriptions');
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, []);

  const assignRole = useCallback(async (userId: string, role: AppRole) => {
    try {
      // Map AppRole to DatabaseRole for database storage
      const dbRole = mapAppRoleToDatabase(role);
      
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role: dbRole })
        .select();

      if (error) {
        console.error('Error assigning role:', error);
        throw error;
      }

      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId 
            ? { ...user, roles: [...user.roles, role] }
            : user
        )
      );

      toast({
        title: "Role Assigned",
        description: `Successfully assigned ${role} role`,
      });

    } catch (error: any) {
      console.error('Error assigning role:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to assign role",
        variant: "destructive",
      });
    }
  }, [toast]);

  const removeRole = useCallback(async (userId: string, role: AppRole) => {
    try {
      // Map AppRole to DatabaseRole for database operations
      const dbRole = mapAppRoleToDatabase(role);
      
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', dbRole);

      if (error) {
        console.error('Error removing role:', error);
        throw error;
      }

      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId 
            ? { ...user, roles: user.roles.filter(r => r !== role) }
            : user
        )
      );

      toast({
        title: "Role Removed",
        description: `Successfully removed ${role} role`,
      });

    } catch (error: any) {
      console.error('Error removing role:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to remove role",
        variant: "destructive",
      });
    }
  }, [toast]);

  return {
    users,
    loading,
    fetchUsers,
    assignRole,
    removeRole,
    removeUserFromState,
    addUserToState,
    updateUserInState,
  };
};
