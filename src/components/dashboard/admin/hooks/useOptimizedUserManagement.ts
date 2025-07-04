
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AppRole, DatabaseRole, mapAppRoleToDatabase } from '@/types/roles';

interface Member {
  id: string;
  email: string;
  name: string;
  roles: AppRole[];
  registration_status: string;
  phone?: string;
  course?: string;
  created_at: string;
}

export const useOptimizedMemberManagement = () => {
  const { toast } = useToast();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);
  const fetchingRef = useRef(false);
  const channelRef = useRef<any>(null);

  const fetchMembers = useCallback(async (force = false) => {
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
      console.log('Fetching members with optimized query...');
      
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
        setMembers([]);
        setLastFetchTime(now);
        return;
      }

      // Get member roles for all members
      const memberIds = memberData.map(m => m.user_id).filter(Boolean);
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('user_id, role')
        .in('user_id', memberIds);

      if (roleError) {
        console.error('Error fetching roles:', roleError);
      }

      // Format the data using user_id as the primary key
      const formattedMembers: Member[] = memberData
        .filter(member => member.user_id) // Only include members with valid user_id
        .map(member => {
          const memberRoles = roleData?.filter(r => r.user_id === member.user_id).map(r => r.role as AppRole) || [];
          
          return {
            id: member.user_id!, // Use user_id as the primary identifier
            email: member.email,
            name: member.name,
            roles: memberRoles.length > 0 ? memberRoles : ['member'],
            registration_status: member.registration_status,
            phone: member.phone,
            course: member.course,
            created_at: member.created_at,
          };
        });

      console.log('Successfully fetched and formatted members:', formattedMembers.length);
      setMembers(formattedMembers);
      setLastFetchTime(now);

    } catch (error) {
      console.error('Error fetching members:', error);
      toast({
        title: "Error",
        description: "Failed to fetch members",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, [toast, lastFetchTime]);

  const removeMemberFromState = useCallback((memberId: string) => {
    console.log('Removing member from local state:', memberId);
    setMembers(prevMembers => {
      const newMembers = prevMembers.filter(m => m.id !== memberId);
      console.log('Updated local state, new count:', newMembers.length);
      return newMembers;
    });
  }, []);

  const addMemberToState = useCallback((member: Member) => {
    console.log('Adding member to local state:', member.name);
    setMembers(prevMembers => {
      const memberExists = prevMembers.some(m => m.id === member.id);
      if (memberExists) {
        console.log('Member already exists, updating:', member.name);
        return prevMembers.map(m => m.id === member.id ? member : m);
      } else {
        console.log('Adding new member:', member.name);
        return [...prevMembers, member];
      }
    });
  }, []);

  const updateMemberInState = useCallback((updatedMember: Member) => {
    console.log('Updating member in local state:', updatedMember.name);
    setMembers(prevMembers => 
      prevMembers.map(m => m.id === updatedMember.id ? updatedMember : m)
    );
  }, []);

  // Set up real-time subscriptions with better optimization
  useEffect(() => {
    fetchMembers(true);

    // Clean up any existing channel
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    // Create a single channel for all changes
    const channel = supabase
      .channel('member-management-optimized')
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
              fetchMembers(true);
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
          console.log('Member roles changed:', payload.eventType);
          // Delay refresh to allow database to settle
          setTimeout(() => {
            if (!fetchingRef.current) {
              fetchMembers(true);
            }
          }, 1000);
        }
      )
      .subscribe((status) => {
        console.log('Member management subscription status:', status);
      });

    channelRef.current = channel;

    return () => {
      console.log('Cleaning up member management subscriptions');
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, []);

  const assignRole = useCallback(async (memberId: string, role: AppRole) => {
    try {
      // Map AppRole to DatabaseRole for database storage
      const dbRole = mapAppRoleToDatabase(role);
      
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: memberId, role: dbRole })
        .select();

      if (error) {
        console.error('Error assigning role:', error);
        throw error;
      }

      // Update local state
      setMembers(prevMembers => 
        prevMembers.map(member => 
          member.id === memberId 
            ? { ...member, roles: [...member.roles, role] }
            : member
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

  const removeRole = useCallback(async (memberId: string, role: AppRole) => {
    try {
      // Map AppRole to DatabaseRole for database operations
      const dbRole = mapAppRoleToDatabase(role);
      
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', memberId)
        .eq('role', dbRole);

      if (error) {
        console.error('Error removing role:', error);
        throw error;
      }

      // Update local state
      setMembers(prevMembers => 
        prevMembers.map(member => 
          member.id === memberId 
            ? { ...member, roles: member.roles.filter(r => r !== role) }
            : member
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
    members,
    loading,
    fetchMembers,
    assignRole,
    removeRole,
    removeMemberFromState,
    addMemberToState,
    updateMemberInState,
  };
};
