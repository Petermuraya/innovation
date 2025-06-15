import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useRolePermissions } from '@/hooks/useRolePermissions';
import { Shield, Crown } from 'lucide-react';
import QuickRoleAssignment from './components/QuickRoleAssignment';
import UserSearchAndFilters from './components/UserSearchAndFilters';
import UserList from './components/UserList';

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

const ROLE_LABELS: Record<ComprehensiveRole, string> = {
  member: 'Member',
  super_admin: 'Super Admin',
  general_admin: 'General Admin',
  community_admin: 'Community Admin',
  events_admin: 'Events Admin',
  projects_admin: 'Projects Admin',
  finance_admin: 'Finance Admin',
  content_admin: 'Content Admin',
  technical_admin: 'Technical Admin',
  marketing_admin: 'Marketing Admin',
  chairman: 'Chairman',
  vice_chairman: 'Vice Chairman'
};

const ROLE_COLORS: Record<ComprehensiveRole, 'default' | 'destructive' | 'secondary' | 'outline'> = {
  member: 'default',
  super_admin: 'destructive',
  general_admin: 'secondary',
  community_admin: 'outline',
  events_admin: 'outline',
  projects_admin: 'outline',
  finance_admin: 'outline',
  content_admin: 'outline',
  technical_admin: 'outline',
  marketing_admin: 'outline',
  chairman: 'destructive',
  vice_chairman: 'secondary'
};

const UserManagement = () => {
  const { toast } = useToast();
  const { isSuperAdmin, roleInfo } = useRolePermissions();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchEmail, setSearchEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState<ComprehensiveRole>('general_admin');
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      console.log('Fetching users...');
      
      const { data: members, error } = await supabase
        .from('member_management_view')
        .select('user_id, email, name, registration_status, roles, phone, course, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }

      console.log('Fetched users:', members?.length || 0);

      const formattedUsers = (members || []).map(member => ({
        id: member.user_id || '',
        email: member.email,
        name: member.name,
        roles: member.roles || [],
        registration_status: member.registration_status,
        phone: member.phone,
        course: member.course,
        created_at: member.created_at,
      }));

      console.log('Formatted users:', formattedUsers.length);
      setUsers(formattedUsers);
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
  };

  useEffect(() => {
    fetchUsers();
    
    // Set up real-time subscription with more specific event handling
    const channel = supabase
      .channel('user-management-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'members'
        },
        (payload) => {
          console.log('Members table change detected:', payload);
          // Immediately refresh data when any change occurs
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
          console.log('User roles change detected:', payload);
          // Immediately refresh data when roles change
          fetchUsers();
        }
      )
      .subscribe((status) => {
        console.log('Real-time subscription status:', status);
      });

    return () => {
      console.log('Cleaning up user management real-time subscription');
      supabase.removeChannel(channel);
    };
  }, []);

  const grantRole = async (email: string, role: ComprehensiveRole) => {
    try {
      setLoading(true);

      const user = users.find(u => u.email === email);
      if (!user) {
        toast({
          title: "Error",
          description: "User not found",
          variant: "destructive",
        });
        return;
      }

      // Assign the role
      const { error: roleError } = await supabase
        .from('user_roles')
        .upsert({
          user_id: user.id,
          role: role
        });

      if (roleError) throw roleError;

      // Update member registration status to approved if not already
      if (user.registration_status !== 'approved') {
        const { error: memberError } = await supabase
          .from('members')
          .update({ 
            registration_status: 'approved',
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);

        if (memberError) throw memberError;
      }

      toast({
        title: "Success",
        description: `${ROLE_LABELS[role]} role granted to ${email}`,
      });

      // Force immediate refresh
      await fetchUsers();
    } catch (error) {
      console.error('Error granting role:', error);
      toast({
        title: "Error",
        description: "Failed to grant role",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeRole = async (userId: string, roleToRemove: ComprehensiveRole) => {
    try {
      setLoading(true);

      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', roleToRemove);

      if (error) throw error;

      toast({
        title: "Success",
        description: `${ROLE_LABELS[roleToRemove]} role removed successfully`,
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

  const deleteUser = async (user: User) => {
    try {
      setLoading(true);
      console.log('Deleting user:', user.name, user.id);

      // Delete member record - the trigger will handle cleanup of related data
      const { error: memberError } = await supabase
        .from('members')
        .delete()
        .eq('user_id', user.id);

      if (memberError) {
        console.error('Error deleting member record:', memberError);
        throw memberError;
      }

      console.log('User deleted successfully from database');

      toast({
        title: "Success",
        description: `User ${user.name} has been removed from the system`,
      });

      // Close the dialog immediately
      setUserToDelete(null);
      
      // Immediately update the local state to remove the user
      setUsers(prevUsers => {
        const updatedUsers = prevUsers.filter(u => u.id !== user.id);
        console.log('Updated users list after deletion:', updatedUsers.length);
        return updatedUsers;
      });

      // Also force a fresh fetch to ensure consistency
      setTimeout(() => {
        fetchUsers();
      }, 1000);

    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const canManageUsers = isSuperAdmin || roleInfo?.assignedRole === 'chairman';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Enhanced User Management
            {isSuperAdmin && <Crown className="w-4 h-4 text-yellow-500" />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isSuperAdmin && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="w-4 h-4 text-yellow-600" />
                  <span className="font-medium text-yellow-800">Super Admin Mode</span>
                </div>
                <p className="text-sm text-yellow-700">
                  Full system access - manage all users, roles, and perform administrative actions.
                </p>
              </div>
            )}

            <UserSearchAndFilters
              searchEmail={searchEmail}
              onSearchChange={setSearchEmail}
            />
          </div>
        </CardContent>
      </Card>

      {canManageUsers && (
        <QuickRoleAssignment
          selectedRole={selectedRole}
          onRoleChange={setSelectedRole}
        />
      )}

      <UserList
        users={users}
        loading={loading}
        canManageUsers={canManageUsers}
        selectedRole={selectedRole}
        searchEmail={searchEmail}
        onGrantRole={grantRole}
        onRemoveRole={removeRole}
        onEditUser={setUserToEdit}
        onDeleteUser={setUserToDelete}
      />

      {/* Delete User Dialog */}
      <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete <strong>{userToDelete?.name}</strong>? 
              This action cannot be undone and will remove all user data including:
              <div className="mt-2 space-y-1 text-sm">
                <div>• All assigned roles</div>
                <div>• Member registration data</div>
                <div>• User profile information</div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => userToDelete && deleteUser(userToDelete)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit User Dialog */}
      <Dialog open={!!userToEdit} onOpenChange={(open) => !open && setUserToEdit(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User: {userToEdit?.name}</DialogTitle>
            <DialogDescription>
              View and manage user information and roles.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Name</Label>
                <p className="text-sm">{userToEdit?.name}</p>
              </div>
              <div>
                <Label>Email</Label>
                <p className="text-sm">{userToEdit?.email}</p>
              </div>
              <div>
                <Label>Phone</Label>
                <p className="text-sm">{userToEdit?.phone || 'Not provided'}</p>
              </div>
              <div>
                <Label>Course</Label>
                <p className="text-sm">{userToEdit?.course || 'Not specified'}</p>
              </div>
            </div>
            <div>
              <Label>Current Roles</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {userToEdit?.roles && userToEdit.roles.length > 0 ? (
                  userToEdit.roles.map((role) => (
                    <Badge key={role} variant={ROLE_COLORS[role]}>
                      {ROLE_LABELS[role]}
                    </Badge>
                  ))
                ) : (
                  <Badge variant="outline">Member</Badge>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
