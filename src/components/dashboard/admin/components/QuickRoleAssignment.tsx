
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus } from 'lucide-react';

type ComprehensiveRole = 'member' | 'super_admin' | 'general_admin' | 'community_admin' | 'events_admin' | 'projects_admin' | 'finance_admin' | 'content_admin' | 'technical_admin' | 'marketing_admin' | 'chairman' | 'vice_chairman';

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

interface QuickRoleAssignmentProps {
  selectedRole: ComprehensiveRole;
  onRoleChange: (role: ComprehensiveRole) => void;
}

const QuickRoleAssignment = ({ selectedRole, onRoleChange }: QuickRoleAssignmentProps) => {
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
            <Select value={selectedRole} onValueChange={(value) => onRoleChange(value as ComprehensiveRole)}>
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
  );
};

export default QuickRoleAssignment;
