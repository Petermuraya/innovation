
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AppRole } from '@/types/roles';

interface User {
  id: string;
  email: string;
  name: string;
  roles: AppRole[];
  registration_status: string;
}

export const useRoleManagement = (canManageRoles: boolean) => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    if (!canManageRoles) {
      setLoading(false);
      return;
    }

    try {
      // Fetch members data
      const { data: membersData, error: membersError } = await supabase
        .from('members')
        .select('user_id, name, email, registration_status')
        .eq('registration_status', 'approved');

      if (membersError) throw membersError;

      if (!membersData || membersData.length === 0) {
        setUsers([]);
        setLoading(false);
        return;
      }

      // Fetch roles for all users
      const userIds = membersData.map(m => m.user_id).filter(Boolean);
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role')
        .in('user_id', userIds);

      if (rolesError) throw rolesError;

      // Combine data
      const usersWithRoles: User[] = membersData
        .filter(member => member.user_id)
        .map(member => {
          const userRoles = rolesData?.filter(r => r.user_id === member.user_id).map(r => r.role as AppRole) || [];
          return {
            id: member.user_id!,
            email: member.email,
            name: member.name,
            roles: userRoles.length > 0 ? userRoles : ['member'],
            registration_status: member.registration_status,
          };
        });

      setUsers(usersWithRoles);
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
  };

  const assignRole = async (userId: string, role: AppRole) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role });

      if (error) throw error;

      // Refresh users list
      await fetchUsers();

      toast({
        title: "Success",
        description: `Role ${role} assigned successfully`,
      });
    } catch (error: any) {
      console.error('Error assigning role:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to assign role",
        variant: "destructive",
      });
    }
  };

  const removeRole = async (userId: string, role: AppRole) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', role);

      if (error) throw error;

      // Refresh users list
      await fetchUsers();

      toast({
        title: "Success",
        description: `Role ${role} removed successfully`,
      });
    } catch (error: any) {
      console.error('Error removing role:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to remove role",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [canManageRoles]);

  return {
    users,
    loading,
    assignRole,
    removeRole,
  };
};
