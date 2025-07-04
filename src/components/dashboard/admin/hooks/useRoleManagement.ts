
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AppRole, DatabaseRole, mapAppRoleToDatabase } from '@/types/roles';

interface Member {
  id: string;
  email: string;
  name: string;
  roles: AppRole[];
  registration_status: string;
}

export const useRoleManagement = (canManageRoles: boolean) => {
  const { toast } = useToast();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = async () => {
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
        setMembers([]);
        setLoading(false);
        return;
      }

      // Fetch roles for all members
      const memberIds = membersData.map(m => m.user_id).filter(Boolean);
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role')
        .in('user_id', memberIds);

      if (rolesError) throw rolesError;

      // Combine data
      const membersWithRoles: Member[] = membersData
        .filter(member => member.user_id)
        .map(member => {
          const memberRoles = rolesData?.filter(r => r.user_id === member.user_id).map(r => r.role as AppRole) || [];
          return {
            id: member.user_id!,
            email: member.email,
            name: member.name,
            roles: memberRoles.length > 0 ? memberRoles : ['member'],
            registration_status: member.registration_status,
          };
        });

      setMembers(membersWithRoles);
    } catch (error) {
      console.error('Error fetching members for role management:', error);
      toast({
        title: "Error",
        description: "Failed to fetch members",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const assignRole = async (memberId: string, role: AppRole) => {
    try {
      // Map AppRole to DatabaseRole for database storage
      const dbRole = mapAppRoleToDatabase(role);
      
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: memberId, role: dbRole });

      if (error) throw error;

      // Refresh members list
      await fetchMembers();

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

  const removeRole = async (memberId: string, role: AppRole) => {
    try {
      // Map AppRole to DatabaseRole for database operations
      const dbRole = mapAppRoleToDatabase(role);
      
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', memberId)
        .eq('role', dbRole);

      if (error) throw error;

      // Refresh members list
      await fetchMembers();

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
    fetchMembers();
  }, [canManageRoles]);

  return {
    members,
    loading,
    assignRole,
    removeRole,
  };
};
