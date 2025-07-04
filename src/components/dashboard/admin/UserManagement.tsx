
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, User, Mail, Phone, BookOpen } from 'lucide-react';

interface Member {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  course?: string;
  registration_status: string;
  created_at: string;
  roles?: string[];
}

const UserManagement = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const { data: membersData, error } = await supabase
        .from('members')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch roles for each member separately
      const membersWithRoles = await Promise.all(
        (membersData || []).map(async (member) => {
          const { data: rolesData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', member.user_id);

          return {
            ...member,
            roles: rolesData?.map((r: any) => r.role) || []
          };
        })
      );

      setMembers(membersWithRoles);
    } catch (error) {
      console.error('Error fetching members:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch members',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateMemberStatus = async (memberId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('members')
        .update({ registration_status: status })
        .eq('id', memberId);

      if (error) throw error;

      const updatedMembers = members.map(member =>
        member.id === memberId ? { ...member, registration_status: status } : member
      );
      setMembers(updatedMembers);

      toast({
        title: 'Success',
        description: `Member ${status} successfully`,
      });
    } catch (error) {
      console.error('Error updating member status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update member status',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return <div>Loading members...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Member Management</h2>
        <p className="text-muted-foreground">Review and manage member registrations</p>
      </div>

      <div className="grid gap-6">
        {members.map((member) => (
          <Card key={member.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    {member.name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {member.email}
                  </CardDescription>
                </div>
                <Badge variant={
                  member.registration_status === 'approved' ? 'default' :
                  member.registration_status === 'rejected' ? 'destructive' : 'secondary'
                }>
                  {member.registration_status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                {member.phone && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    {member.phone}
                  </div>
                )}
                {member.course && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BookOpen className="w-4 h-4" />
                    {member.course}
                  </div>
                )}
                {member.roles && member.roles.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Roles:</span>
                    <div className="flex gap-1">
                      {member.roles.map((role, index) => (
                        <Badge key={index} variant="outline">{role}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {member.registration_status === 'pending' && (
                <div className="flex gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => updateMemberStatus(member.id, 'approved')}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => updateMemberStatus(member.id, 'rejected')}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UserManagement;
