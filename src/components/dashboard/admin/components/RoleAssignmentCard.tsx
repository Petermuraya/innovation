
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings } from 'lucide-react';
import { AppRole, UserWithRole, ROLE_LABELS } from '@/types/roles';

interface RoleAssignmentCardProps {
  users: UserWithRole[];
  loading: boolean;
  onAssignRole: (userId: string, role: AppRole) => Promise<void>;
}

const RoleAssignmentCard = ({ users, loading, onAssignRole }: RoleAssignmentCardProps) => {
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<AppRole>('member');

  const handleAssignRole = async () => {
    if (!selectedUser || !selectedRole) return;
    
    await onAssignRole(selectedUser, selectedRole);
    setSelectedUser('');
    setSelectedRole('member');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Role Assignment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Select User</label>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a user" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.user_id} value={user.user_id}>
                      {user.name} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Select Role</label>
              <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as AppRole)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ROLE_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button 
                onClick={handleAssignRole} 
                disabled={loading || !selectedUser || !selectedRole}
                className="w-full"
              >
                Assign Role
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoleAssignmentCard;
