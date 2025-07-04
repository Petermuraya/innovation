
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus } from 'lucide-react';
import { AppRole, ROLE_LABELS } from '@/types/roles';

interface QuickRoleAssignmentProps {
  selectedRole: AppRole;
  onRoleChange: (role: AppRole) => void;
}

const QuickRoleAssignment = ({ selectedRole, onRoleChange }: QuickRoleAssignmentProps) => {
  // Only show roles that actually exist in the database
  const availableRoles: AppRole[] = ['super_admin', 'general_admin', 'community_admin', 'admin'];

  return (
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
            <Select value={selectedRole} onValueChange={(value) => onRoleChange(value as AppRole)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableRoles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {ROLE_LABELS[role]}
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
  );
};

export default QuickRoleAssignment;
