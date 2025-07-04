
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Users, UserX } from 'lucide-react';
import { AppRole, UserWithRole, ROLE_LABELS, ROLE_COLORS } from '@/types/roles';

interface UserRolesListProps {
  users: UserWithRole[];
  loading: boolean;
  onRemoveRole: (userId: string, role: AppRole) => Promise<void>;
}

const UserRolesList = ({ users, loading, onRemoveRole }: UserRolesListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Current User Roles
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading users...</p>
        ) : (
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.user_id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium">{user.name}</h4>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {user.roles && user.roles.length > 0 ? (
                      user.roles.map((role) => (
                        <div key={role} className="flex items-center gap-1">
                          <Badge variant={ROLE_COLORS[role]}>
                            {ROLE_LABELS[role]}
                          </Badge>
                          {role !== 'member' && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                  disabled={loading}
                                >
                                  <UserX className="h-3 w-3" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Remove Role</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to remove the {ROLE_LABELS[role]} role from {user.name}? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => onRemoveRole(user.user_id, role)}
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
                      <Badge variant="default">Member</Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {users.length === 0 && (
              <p className="text-gray-500">No users found</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserRolesList;
