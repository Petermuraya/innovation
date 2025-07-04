
import { useState } from 'react';
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
import AdminRegistrationShare from './components/AdminRegistrationShare';
import { useUserDeletion } from './hooks/useUserDeletion';
import { useOptimizedUserManagement } from './hooks/useOptimizedUserManagement';

type SimpleRole = 'member' | 'admin' | 'super_admin' | 'general_admin' | 'community_admin';

interface User {
  id: string;
  email: string;
  name: string;
  roles: SimpleRole[];
  registration_status: string;
  phone?: string;
  course?: string;
  created_at: string;
}

const ROLE_LABELS: Record<SimpleRole, string> = {
  member: 'Member',
  super_admin: 'Super Admin',
  general_admin: 'General Admin',
  community_admin: 'Community Admin',
  admin: 'Admin'
};

const ROLE_COLORS: Record<SimpleRole, 'default' | 'destructive' | 'secondary' | 'outline'> = {
  member: 'default',
  super_admin: 'destructive',
  general_admin: 'secondary',
  community_admin: 'outline',
  admin: 'secondary'
};

const UserManagement = () => {
  const { toast } = useToast();
  const { isSuperAdmin, roleInfo } = useRolePermissions();
  const { users, loading, fetchUsers, removeUserFromState } = useOptimizedUserManagement();
  const { deleteUserCompletely, loading: deletionLoading } = useUserDeletion();
  
  const [searchEmail, setSearchEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState<SimpleRole>('general_admin');
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);

  const grantRole = async (email: string, role: SimpleRole) => {
    try {
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

      // Force refresh to get latest data
      await fetchUsers(true);
    } catch (error) {
      console.error('Error granting role:', error);
      toast({
        title: "Error",
        description: "Failed to grant role",
        variant: "destructive",
      });
    }
  };

  const removeRole = async (userId: string, roleToRemove: SimpleRole) => {
    try {
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

      // Force refresh to get latest data
      await fetchUsers(true);
    } catch (error) {
      console.error('Error removing role:', error);
      toast({
        title: "Error",
        description: "Failed to remove role",
        variant: "destructive",
      });
    }
  };

  const deleteUser = async (user: User) => {
    const success = await deleteUserCompletely(user);
    
    if (success) {
      // Immediately remove from local state
      removeUserFromState(user.id);
      setUserToDelete(null);
      
      // Force refresh after a short delay to ensure database consistency
      setTimeout(() => {
        fetchUsers(true);
      }, 1000);
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

      {isSuperAdmin && <AdminRegistrationShare />}

      {canManageUsers && (
        <QuickRoleAssignment
          selectedRole={selectedRole}
          onRoleChange={setSelectedRole}
        />
      )}

      <UserList
        users={users}
        loading={loading || deletionLoading}
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
                <div>• All activity history and points</div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletionLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => userToDelete && deleteUser(userToDelete)}
              className="bg-red-600 hover:bg-red-700"
              disabled={deletionLoading}
            >
              {deletionLoading ? 'Deleting...' : 'Delete User'}
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
