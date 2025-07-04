
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings } from 'lucide-react';
import { AppRole, MemberWithRole, ROLE_LABELS } from '@/types/roles';

interface RoleAssignmentCardProps {
  members: MemberWithRole[];
  loading: boolean;
  onAssignRole: (memberId: string, role: AppRole) => Promise<void>;
}

const RoleAssignmentCard = ({ members, loading, onAssignRole }: RoleAssignmentCardProps) => {
  const [selectedMember, setSelectedMember] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<AppRole>('member');

  const handleAssignRole = async () => {
    if (!selectedMember || !selectedRole) return;
    
    await onAssignRole(selectedMember, selectedRole);
    setSelectedMember('');
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
              <label className="block text-sm font-medium mb-2">Select Member</label>
              <Select value={selectedMember} onValueChange={setSelectedMember}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a member" />
                </SelectTrigger>
                <SelectContent>
                  {members.map((member) => (
                    <SelectItem key={member.member_id} value={member.member_id}>
                      {member.name} ({member.email})
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
                disabled={loading || !selectedMember || !selectedRole}
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
