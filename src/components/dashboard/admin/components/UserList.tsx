
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserX } from 'lucide-react';
import UserCard from './UserCard';
import UserActionsDropdown from './UserActionsDropdown';

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

interface UserListProps {
  users: User[];
  loading: boolean;
  canManageUsers: boolean;
  selectedRole: ComprehensiveRole;
  searchEmail: string;
  onGrantRole: (email: string, role: ComprehensiveRole) => void;
  onRemoveRole: (userId: string, role: ComprehensiveRole) => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
}

const UserList = ({ 
  users, 
  loading, 
  canManageUsers, 
  selectedRole, 
  searchEmail,
  onGrantRole, 
  onRemoveRole, 
  onEditUser, 
  onDeleteUser 
}: UserListProps) => {
  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchEmail.toLowerCase()) ||
    user.name.toLowerCase().includes(searchEmail.toLowerCase())
  );

  return (
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
                  <UserCard
                    user={user}
                    canManageUsers={canManageUsers}
                    selectedRole={selectedRole}
                    onGrantRole={onGrantRole}
                    onRemoveRole={onRemoveRole}
                    onEditUser={onEditUser}
                    onDeleteUser={onDeleteUser}
                    loading={loading}
                  />
                  
                  {canManageUsers && (
                    <div className="ml-4">
                      <UserActionsDropdown
                        user={user}
                        onEditUser={onEditUser}
                        onDeleteUser={onDeleteUser}
                      />
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
  );
};

export default UserList;
