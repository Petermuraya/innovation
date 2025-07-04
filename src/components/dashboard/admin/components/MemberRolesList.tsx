
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, X } from 'lucide-react';
import { AppRole, MemberWithRole, ROLE_LABELS, ROLE_COLORS } from '@/types/roles';

interface MemberRolesListProps {
  members: MemberWithRole[];
  loading: boolean;
  onRemoveRole: (memberId: string, role: AppRole) => Promise<void>;
}

const MemberRolesList = ({ members, loading, onRemoveRole }: MemberRolesListProps) => {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-kic-green-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading member roles...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const membersWithRoles = members.filter(member => 
    member.roles && member.roles.length > 0 && 
    member.roles.some(role => role !== 'member')
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Member Roles ({membersWithRoles.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {membersWithRoles.map((member) => (
            <div key={member.member_id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">{member.name}</h4>
                  <p className="text-sm text-gray-600 mb-3">{member.email}</p>
                  <div className="flex flex-wrap gap-2">
                    {member.roles.map((role) => (
                      <div key={role} className="flex items-center gap-1">
                        <Badge variant={ROLE_COLORS[role]}>
                          {ROLE_LABELS[role]}
                        </Badge>
                        {role !== 'member' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 hover:bg-red-100"
                            onClick={() => onRemoveRole(member.member_id, role)}
                          >
                            <X className="h-3 w-3 text-red-600" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {membersWithRoles.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No members with special roles found.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MemberRolesList;
