
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface CommunityGroup {
  id: string;
  name: string;
  description: string;
  meeting_schedule: string;
  member_count: number;
  is_member: boolean;
}

const CommunityGroups = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [groups, setGroups] = useState<CommunityGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGroups();
  }, [user]);

  const fetchGroups = async () => {
    try {
      const { data: groupsData, error } = await supabase
        .from('community_groups')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // For each group, get member count and check if user is a member
      const enrichedGroups = await Promise.all(
        (groupsData || []).map(async (group) => {
          // Get member count
          const { count: memberCount } = await supabase
            .from('community_memberships')
            .select('*', { count: 'exact', head: true })
            .eq('community_id', group.id)
            .eq('status', 'active');

          // Check if current user is a member
          let isMember = false;
          if (user) {
            const { data: membership } = await supabase
              .from('community_memberships')
              .select('id')
              .eq('community_id', group.id)
              .eq('user_id', user.id)
              .eq('status', 'active')
              .single();
            isMember = !!membership;
          }

          return {
            ...group,
            member_count: memberCount || 0,
            is_member: isMember,
          };
        })
      );

      setGroups(enrichedGroups);
    } catch (error) {
      console.error('Error fetching community groups:', error);
      toast({
        title: "Error",
        description: "Failed to load community groups",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleMembership = async (groupId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to join community groups",
        variant: "destructive",
      });
      return;
    }

    try {
      const group = groups.find(g => g.id === groupId);
      if (!group) return;

      if (group.is_member) {
        // Leave group
        await supabase
          .from('community_memberships')
          .delete()
          .eq('community_id', groupId)
          .eq('user_id', user.id);

        toast({
          title: "Left group",
          description: `You have left ${group.name}`,
        });
      } else {
        // Join group
        await supabase
          .from('community_memberships')
          .insert({
            community_id: groupId,
            user_id: user.id,
            status: 'active'
          });

        toast({
          title: "Joined group",
          description: `Welcome to ${group.name}!`,
        });
      }

      // Refresh groups
      await fetchGroups();
    } catch (error) {
      console.error('Error toggling membership:', error);
      toast({
        title: "Error",
        description: "Failed to update membership",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading community groups...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-kic-gray mb-4">Community Groups</h2>
        <p className="text-kic-gray/70 max-w-2xl mx-auto">
          Join specialized groups based on your interests and connect with like-minded innovators.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => (
          <Card key={group.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{group.name}</span>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {group.member_count}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">{group.description}</p>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>{group.meeting_schedule}</span>
              </div>

              <Button
                onClick={() => toggleMembership(group.id)}
                variant={group.is_member ? "outline" : "default"}
                className="w-full"
              >
                {group.is_member ? "Leave Group" : "Join Group"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CommunityGroups;
