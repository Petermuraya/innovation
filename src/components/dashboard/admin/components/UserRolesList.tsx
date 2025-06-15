
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Users, UserX } from 'lucide-react';

type ComprehensiveRole = 'member' | 'super_admin' | 'general_admin' | 'community_admin' | 'events_admin' | 'projects_admin' | 'finance_admin' | 'content_admin' | 'technical_admin' | 'marketing_admin' | 'chairman' | 'vice_chairman';

interface UserWithRole {
  user_id: string;
  name: string;
  email: string;
  roles: ComprehensiveRole[];
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

const ROLE_COLORS: Record<ComprehensiveRole, string> = {
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

interface UserRolesListProps {
  users: UserWithRole[];
  loading: boolean;
  onRemoveRole: (userId: string, role: ComprehensiveRole) => Promise<void>;
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
                          <Badge variant={ROLE_COLORS[role] as any}>
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
