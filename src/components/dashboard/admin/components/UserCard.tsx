
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { UserX } from 'lucide-react';

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

interface UserCardProps {
  user: User;
  canManageUsers: boolean;
  selectedRole: ComprehensiveRole;
  onGrantRole: (email: string, role: ComprehensiveRole) => void;
  onRemoveRole: (userId: string, role: ComprehensiveRole) => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
  loading: boolean;
}

const UserCard = ({ 
  user, 
  canManageUsers, 
  selectedRole, 
  onGrantRole, 
  onRemoveRole, 
  onEditUser, 
  onDeleteUser,
  loading 
}: UserCardProps) => {
  return (
    <div className="border rounded-lg p-4 hover:bg-gray-50">
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
                            onClick={() => onRemoveRole(user.id, role)}
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
              onClick={() => onGrantRole(user.email, selectedRole)}
              disabled={loading}
            >
              Grant {ROLE_LABELS[selectedRole]}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;
