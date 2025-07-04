
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserX } from 'lucide-react';
import { AppRole, User } from '@/types/roles';

interface UserListProps {
  users: User[];
  loading: boolean;
  canManageUsers: boolean;
  selectedRole: AppRole;
  searchEmail: string;
  onGrantRole: (email: string, role: AppRole) => void;
  onRemoveRole: (userId: string, role: AppRole) => void;
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
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-lg">{user.name}</h4>
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
                  </div>
                  
                  {canManageUsers && (
                    <div className="flex gap-2 ml-4">
                      <button
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                        onClick={() => onGrantRole(user.email, selectedRole)}
                        disabled={loading}
                      >
                        Grant Role
                      </button>
                      <button
                        className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                        onClick={() => onEditUser(user)}
                      >
                        Edit
                      </button>
                      <button
                        className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                        onClick={() => onDeleteUser(user)}
                      >
                        Delete
                      </button>
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
