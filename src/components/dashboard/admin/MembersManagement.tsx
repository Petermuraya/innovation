
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Member {
  id: string;
  name: string;
  email: string;
  phone?: string;
  course?: string;
  created_at: string;
  registration_status: string;
}

interface MembersManagementProps {
  members: Member[];
  updateMemberStatus: (memberId: string, status: string) => void;
}

const MembersManagement = ({ members, updateMemberStatus }: MembersManagementProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Member Management</CardTitle>
        <CardDescription>Approve or reject member registrations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {members.map((member) => (
            <div key={member.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-kic-gray">{member.name}</h4>
                  <p className="text-sm text-kic-gray/70">{member.email}</p>
                  <p className="text-sm text-kic-gray/70">Phone: {member.phone || 'Not provided'}</p>
                  <p className="text-sm text-kic-gray/70">Course: {member.course || 'Not provided'}</p>
                  <p className="text-sm text-kic-gray/70">Registered: {new Date(member.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={
                    member.registration_status === 'approved' ? 'default' : 
                    member.registration_status === 'rejected' ? 'destructive' : 'secondary'
                  }>
                    {member.registration_status}
                  </Badge>
                  {member.registration_status === 'pending' && (
                    <div className="space-x-2">
                      <Button 
                        size="sm" 
                        className="bg-kic-green-500 hover:bg-kic-green-600"
                        onClick={() => updateMemberStatus(member.id, 'approved')}
                      >
                        Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => updateMemberStatus(member.id, 'rejected')}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {members.length === 0 && (
            <p className="text-kic-gray/70">No members found</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MembersManagement;
