
import { useState, useEffect, useCallback, useRef } from 'react';
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
      
      // Use a single optimized query with joins
      const { data: userData, error } = await supabase
        .from('member_management_view')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }

      if (!userData || userData.length === 0) {
        console.log('No users found');
        setUsers([]);
        setLastFetchTime(now);
        return;
      }

      // Format the data
      const formattedUsers: User[] = userData
        .filter(user => user.user_id) // Only include users with valid user_id
        .map(user => ({
          id: user.user_id!,
          email: user.email,
          name: user.name,
          roles: user.roles || ['member'],
          registration_status: user.registration_status,
          phone: user.phone,
          course: user.course,
          created_at: user.created_at,
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

  return {
    users,
    loading,
    fetchUsers,
    removeUserFromState,
    addUserToState,
    updateUserInState
  };
};
