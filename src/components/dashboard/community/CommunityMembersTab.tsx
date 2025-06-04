
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Users, UserPlus, Mail, Phone, GraduationCap } from 'lucide-react';

interface CommunityMembersTabProps {
  communityId: string;
}

const CommunityMembersTab = ({ communityId }: CommunityMembersTabProps) => {
  const { toast } = useToast();
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');

  const fetchCommunityMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('community_memberships')
        .select(`
          id,
          user_id,
          status,
          joined_at,
          members (
            name,
            email,
            phone,
            course
          )
        `)
        .eq('community_id', communityId)
        .eq('status', 'active');

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Error fetching community members:', error);
      toast({
        title: "Error",
        description: "Failed to load community members",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableUsers = async () => {
    try {
      // Fetch all approved members who are not in this community
      const { data: existingMemberIds } = await supabase
        .from('community_memberships')
        .select('user_id')
        .eq('community_id', communityId)
        .eq('status', 'active');

      const existingIds = existingMemberIds?.map(m => m.user_id) || [];

      const { data, error } = await supabase
        .from('members')
        .select('user_id, name, email')
        .eq('registration_status', 'approved')
        .not('user_id', 'in', `(${existingIds.join(',')})`);

      if (error) throw error;
      setAvailableUsers(data || []);
    } catch (error) {
      console.error('Error fetching available users:', error);
    }
  };

  const addMemberToCommunity = async () => {
    if (!selectedUserId) return;

    try {
      const { error } = await supabase
        .from('community_memberships')
        .insert({
          community_id: communityId,
          user_id: selectedUserId,
          status: 'active'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Member added to community successfully",
      });

      setShowAddDialog(false);
      setSelectedUserId('');
      fetchCommunityMembers();
      fetchAvailableUsers();
    } catch (error) {
      console.error('Error adding member:', error);
      toast({
        title: "Error",
        description: "Failed to add member to community",
        variant: "destructive",
      });
    }
  };

  const removeMemberFromCommunity = async (membershipId: string) => {
    try {
      const { error } = await supabase
        .from('community_memberships')
        .delete()
        .eq('id', membershipId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Member removed from community",
      });

      fetchCommunityMembers();
    } catch (error) {
      console.error('Error removing member:', error);
      toast({
        title: "Error",
        description: "Failed to remove member",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchCommunityMembers();
  }, [communityId]);

  useEffect(() => {
    if (showAddDialog) {
      fetchAvailableUsers();
    }
  }, [showAddDialog, communityId]);

  if (loading) {
    return <div className="text-center py-8">Loading members...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Community Members ({members.length})
        </CardTitle>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              Add Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Member to Community</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="user-select">Select User</Label>
                <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a user to add" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableUsers.map((user) => (
                      <SelectItem key={user.user_id} value={user.user_id}>
                        {user.name} ({user.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={addMemberToCommunity} disabled={!selectedUserId}>
                  Add Member
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {members.map((membership) => (
            <div key={membership.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h4 className="font-medium text-kic-gray">{membership.members?.name}</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {membership.members?.email}
                    </div>
                    {membership.members?.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {membership.members.phone}
                      </div>
                    )}
                    {membership.members?.course && (
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" />
                        {membership.members.course}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    Joined: {new Date(membership.joined_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="default">Active</Badge>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => removeMemberFromCommunity(membership.id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {members.length === 0 && (
            <div className="text-center py-8">
              <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Members</h3>
              <p className="text-gray-500">This community doesn't have any members yet.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CommunityMembersTab;
