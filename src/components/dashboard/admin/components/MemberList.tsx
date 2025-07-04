
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Plus, Minus } from 'lucide-react';
import { AppRole, ROLE_LABELS, ROLE_COLORS } from '@/types/roles';

interface Member {
  id: string;
  email: string;
  name: string;
  roles?: AppRole[];
  registration_status: string;
  phone?: string;
  course?: string;
  created_at: string;
}

interface MemberActionsDropdownProps {
  member: Member;
  onEditMember: (member: Member) => void;
  onDeleteMember: (member: Member) => void;
}

const MemberActionsDropdown = ({ member, onEditMember, onDeleteMember }: MemberActionsDropdownProps) => {
  return (
    <div className="flex gap-2">
      <Button size="sm" variant="outline" onClick={() => onEditMember(member)}>
        Edit
      </Button>
      <Button size="sm" variant="destructive" onClick={() => onDeleteMember(member)}>
        Delete
      </Button>
    </div>
  );
};

interface MemberListProps {
  members: Member[];
  loading: boolean;
  canManageMembers: boolean;
  selectedRole: AppRole;
  searchEmail: string;
  onGrantRole: (email: string, role: AppRole) => Promise<void>;
  onRemoveRole: (memberId: string, role: AppRole) => Promise<void>;
  onEditMember: (member: Member) => void;
  onDeleteMember: (member: Member) => void;
}

const MemberList = ({ 
  members, 
  loading, 
  canManageMembers, 
  selectedRole, 
  searchEmail,
  onGrantRole, 
  onRemoveRole, 
  onEditMember, 
  onDeleteMember 
}: MemberListProps) => {
  const filteredMembers = members.filter(member => 
    searchEmail === '' || member.email.toLowerCase().includes(searchEmail.toLowerCase())
  );

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-kic-green-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading members...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Members ({filteredMembers.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredMembers.map((member) => (
            <div key={member.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium text-gray-900">{member.name}</h4>
                    <Badge variant={member.registration_status === 'approved' ? 'default' : 'secondary'}>
                      {member.registration_status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{member.email}</p>
                  <p className="text-sm text-gray-500 mb-2">
                    Course: {member.course || 'Not specified'} | Phone: {member.phone || 'Not provided'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {member.roles && member.roles.length > 0 ? (
                      member.roles.map((role) => (
                        <div key={role} className="flex items-center gap-1">
                          <Badge variant={ROLE_COLORS[role]}>
                            {ROLE_LABELS[role]}
                          </Badge>
                          {canManageMembers && role !== 'member' && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0 hover:bg-red-100"
                              onClick={() => onRemoveRole(member.id, role)}
                            >
                              <Minus className="h-3 w-3 text-red-600" />
                            </Button>
                          )}
                        </div>
                      ))
                    ) : (
                      <Badge variant="outline">Member</Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  {canManageMembers && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onGrantRole(member.email, selectedRole)}
                        className="flex items-center gap-1"
                      >
                        <Plus className="h-3 w-3" />
                        Add {ROLE_LABELS[selectedRole]}
                      </Button>
                      <MemberActionsDropdown
                        member={member}
                        onEditMember={onEditMember}
                        onDeleteMember={onDeleteMember}
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {filteredMembers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {searchEmail ? 'No members found matching your search.' : 'No members found.'}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MemberList;
