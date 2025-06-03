
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus, Shield, Users, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface CommunityAdmin {
  id: string;
  user_id: string;
  community_id: string;
  role: string;
  assigned_at: string;
  is_active: boolean;
  member_name?: string;
  community_name?: string;
}

interface Community {
  id: string;
  name: string;
}

interface Member {
  id: string;
  user_id: string;
  name: string;
  email: string;
}

const CommunityAdminManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [communityAdmins, setCommunityAdmins] = useState<CommunityAdmin[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAssignForm, setShowAssignForm] = useState(false);
  
  // Form state
  const [selectedMember, setSelectedMember] = useState('');
  const [selectedCommunity, setSelectedCommunity] = useState('');
  const [adminRole, setAdminRole] = useState('admin');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch community admins with manual joins
      const { data: adminsData, error: adminsError } = await supabase
        .from('community_admin_roles')
        .select('*')
        .eq('is_active', true)
        .order('assigned_at', { ascending: false });

      if (adminsError) throw adminsError;

      // Get member names and community names separately
      const adminIds = adminsData?.map(admin => admin.user_id) || [];
      const communityIds = adminsData?.map(admin => admin.community_id) || [];

      const { data: membersData } = await supabase
        .from('members')
        .select('user_id, name')
        .in('user_id', adminIds);

      const { data: communitiesData } = await supabase
        .from('community_groups')
        .select('id, name')
        .in('id', communityIds);

      // Combine the data
      const enrichedAdmins = adminsData?.map(admin => ({
        ...admin,
        member_name: membersData?.find(m => m.user_id === admin.user_id)?.name || 'Unknown',
        community_name: communitiesData?.find(c => c.id === admin.community_id)?.name || 'Unknown'
      })) || [];

      setCommunityAdmins(enrichedAdmins);

      // Fetch all communities
      const { data: allCommunities, error: communitiesError } = await supabase
        .from('community_groups')
        .select('id, name')
        .eq('is_active', true)
        .order('name');

      if (communitiesError) throw communitiesError;
      setCommunities(allCommunities || []);

      // Fetch approved members
      const { data: allMembers, error: membersError } = await supabase
        .from('members')
        .select('id, user_id, name, email')
        .eq('registration_status', 'approved')
        .order('name');

      if (membersError) throw membersError;
      setMembers(allMembers || []);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load community admin data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAssignAdmin = async () => {
    if (!selectedMember || !selectedCommunity) {
      toast({
        title: "Missing information",
        description: "Please select both a member and community",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      // Check if user is already an admin for this community
      const { data: existing, error: existingError } = await supabase
        .from('community_admin_roles')
        .select('id')
        .eq('user_id', selectedMember)
        .eq('community_id', selectedCommunity)
        .eq('is_active', true)
        .single();

      if (existingError && existingError.code !== 'PGRST116') throw existingError;
      if (existing) {
        toast({
          title: "Already assigned",
          description: "This user is already an admin for this community",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('community_admin_roles')
        .insert({
          user_id: selectedMember,
          community_id: selectedCommunity,
          role: adminRole,
          assigned_by: user?.id,
          is_active: true,
        });

      if (error) throw error;

      toast({
        title: "Admin assigned",
        description: "Community admin has been assigned successfully",
      });

      setSelectedMember('');
      setSelectedCommunity('');
      setAdminRole('admin');
      setShowAssignForm(false);
      await fetchData();
    } catch (error) {
      console.error('Error assigning admin:', error);
      toast({
        title: "Error",
        description: "Failed to assign community admin",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveAdmin = async (adminId: string) => {
    if (!confirm('Are you sure you want to remove this community admin?')) return;

    try {
      const { error } = await supabase
        .from('community_admin_roles')
        .update({ is_active: false })
        .eq('id', adminId);

      if (error) throw error;

      toast({
        title: "Admin removed",
        description: "Community admin has been removed successfully",
      });

      await fetchData();
    } catch (error) {
      console.error('Error removing admin:', error);
      toast({
        title: "Error",
        description: "Failed to remove community admin",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading community admins...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Community Admin Management
          <Dialog open={showAssignForm} onOpenChange={setShowAssignForm}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Assign Admin
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign Community Admin</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="member">Select Member</Label>
                  <Select value={selectedMember} onValueChange={setSelectedMember}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a member" />
                    </SelectTrigger>
                    <SelectContent>
                      {members.map((member) => (
                        <SelectItem key={member.user_id} value={member.user_id}>
                          {member.name} ({member.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="community">Select Community</Label>
                  <Select value={selectedCommunity} onValueChange={setSelectedCommunity}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a community" />
                    </SelectTrigger>
                    <SelectContent>
                      {communities.map((community) => (
                        <SelectItem key={community.id} value={community.id}>
                          {community.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="role">Admin Role</Label>
                  <Select value={adminRole} onValueChange={setAdminRole}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="moderator">Moderator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={handleAssignAdmin}
                    disabled={submitting}
                    className="flex-1"
                  >
                    {submitting ? 'Assigning...' : 'Assign Admin'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowAssignForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
        <CardDescription>Manage community administrators and their permissions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {communityAdmins.map((admin) => (
            <div key={admin.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-blue-500" />
                    <h4 className="font-medium text-kic-gray">{admin.member_name}</h4>
                    <Badge variant="secondary">{admin.role}</Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-kic-gray/70">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {admin.community_name}
                    </div>
                    <div>
                      Assigned: {new Date(admin.assigned_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveAdmin(admin.id)}
                  className="flex items-center gap-1 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </Button>
              </div>
            </div>
          ))}
          
          {communityAdmins.length === 0 && (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-kic-gray/70">No community admins assigned yet.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CommunityAdminManagement;
