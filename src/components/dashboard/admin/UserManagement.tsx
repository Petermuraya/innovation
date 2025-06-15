
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useRolePermissions } from '@/hooks/useRolePermissions';
import { Shield, UserPlus, Search, Crown, Trash2, UserX, Edit, MoreVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

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

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      const { data: members, error } = await supabase
        .from('member_management_view')
        .select('user_id, email, name, registration_status, roles, phone, course, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;

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

      fetchUsers();
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

      fetchUsers();
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

      // Delete user roles first
      const { error: rolesError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', user.id);

      if (rolesError) throw rolesError;

      // Delete member record
      const { error: memberError } = await supabase
        .from('members')
        .delete()
        .eq('user_id', user.id);

      if (memberError) throw memberError;

      // Note: We can't delete from auth.users table directly via client
      // This would need to be done via Admin API or RPC function

      toast({
        title: "Success",
        description: `User ${user.name} has been removed from the system`,
      });

      fetchUsers();
      setUserToDelete(null);
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

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchEmail.toLowerCase()) ||
    user.name.toLowerCase().includes(searchEmail.toLowerCase())
  );

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

            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="search">Search Users</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search by email or name..."
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Role Assignment */}
      {canManageUsers && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Quick Role Assignment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Select Role</Label>
                <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as ComprehensiveRole)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(ROLE_LABELS).filter(([key]) => key !== 'member').map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label>Grant Role to Users</Label>
                <p className="text-sm text-gray-500 mt-1">
                  Select a role above, then click "Grant" on any user below to assign it instantly.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <span className="ml-2">Loading users...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div key={user.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-lg">{user.name}</h4>
                        <Badge variant={user.registration_status === 'approved' ? 'default' : 'secondary'}>
                          {user.registration_status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{user.email}</p>
                      {user.phone && (
                        <p className="text-sm text-gray-500">Phone: {user.phone}</p>
                      )}
                      {user.course && (
                        <p className="text-sm text-gray-500">Course: {user.course}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        Joined: {new Date(user.created_at).toLocaleDateString()}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mt-3">
                        {user.roles && user.roles.length > 0 ? (
                          user.roles.map((role) => (
                            <div key={role} className="flex items-center gap-1">
                              <Badge variant={ROLE_COLORS[role]}>
                                {ROLE_LABELS[role]}
                              </Badge>
                              {canManageUsers && role !== 'member' && (
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-5 w-5 p-0 text-red-500 hover:text-red-700">
                                      <UserX className="h-3 w-3" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Remove Role</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to remove the {ROLE_LABELS[role]} role from {user.name}?
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => removeRole(user.id, role)}
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        Remove Role
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              )}
                            </div>
                          ))
                        ) : (
                          <Badge variant="outline">Member</Badge>
                        )}
                      </div>
                    </div>
                    
                    {canManageUsers && (
                      <div className="flex gap-2 ml-4">
                        <Button
                          size="sm"
                          onClick={() => grantRole(user.email, selectedRole)}
                          disabled={loading}
                        >
                          Grant {ROLE_LABELS[selectedRole]}
                        </Button>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setUserToEdit(user)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => setUserToDelete(user)}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {filteredUsers.length === 0 && (
                <div className="text-center py-8">
                  <UserX className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchEmail ? 'Try adjusting your search criteria' : 'No users registered yet'}
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete User Dialog */}
      <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete <strong>{userToDelete?.name}</strong>? 
              This action cannot be undone and will remove all user data including:
              <ul className="mt-2 list-disc list-inside text-sm">
                <li>All assigned roles</li>
                <li>Member registration data</li>
                <li>User profile information</li>
              </ul>
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
