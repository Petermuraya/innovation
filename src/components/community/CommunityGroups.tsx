
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, MapPin, Award, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface CommunityGroup {
  id: string;
  name: string;
  description: string;
  meeting_schedule: string;
  activities: string[] | null;
  focus_areas: string[] | null;
  meeting_days: string[] | null;
  member_count: number;
  is_member: boolean;
  is_admin: boolean;
}

const CommunityGroups = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [groups, setGroups] = useState<CommunityGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [userMembershipCount, setUserMembershipCount] = useState(0);

  useEffect(() => {
    fetchGroups();
    if (user) {
      fetchUserMembershipCount();
    }
  }, [user]);

  const fetchUserMembershipCount = async () => {
    if (!user) return;

    try {
      const { count } = await supabase
        .from('community_memberships')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'active');

      setUserMembershipCount(count || 0);
    } catch (error) {
      console.error('Error fetching user membership count:', error);
    }
  };

  const fetchGroups = async () => {
    try {
      const { data: groupsData, error } = await supabase
        .from('community_groups')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // For each group, get member count, check if user is a member, and check if user is admin
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
          let isAdmin = false;
          if (user) {
            const { data: membership } = await supabase
              .from('community_memberships')
              .select('id')
              .eq('community_id', group.id)
              .eq('user_id', user.id)
              .eq('status', 'active')
              .single();
            isMember = !!membership;

            // Check if user is community admin
            const { data: adminRole } = await supabase
              .from('community_admins')
              .select('id')
              .eq('community_id', group.id)
              .eq('user_id', user.id)
              .eq('is_active', true)
              .single();
            isAdmin = !!adminRole;
          }

          return {
            ...group,
            member_count: memberCount || 0,
            is_member: isMember,
            is_admin: isAdmin,
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
        // Check membership limit before joining
        if (userMembershipCount >= 3) {
          toast({
            title: "Membership limit reached",
            description: "You can only join up to 3 communities",
            variant: "destructive",
          });
          return;
        }

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

      // Refresh groups and membership count
      await fetchGroups();
      await fetchUserMembershipCount();
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
        {user && (
          <p className="text-sm text-gray-600 mt-2">
            You are a member of {userMembershipCount}/3 communities
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => (
          <Card key={group.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{group.name}</span>
                <div className="flex items-center gap-2">
                  {group.is_admin && (
                    <Badge variant="default" className="flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      Admin
                    </Badge>
                  )}
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {group.member_count}
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">{group.description}</p>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>{group.meeting_schedule}</span>
              </div>

              {group.meeting_days && group.meeting_days.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {group.meeting_days.map((day) => (
                    <Badge key={day} variant="outline" className="text-xs">
                      {day}
                    </Badge>
                  ))}
                </div>
              )}

              {group.focus_areas && group.focus_areas.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Focus Areas:</p>
                  <div className="flex flex-wrap gap-1">
                    {group.focus_areas.map((area) => (
                      <Badge key={area} variant="secondary" className="text-xs">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {group.activities && group.activities.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Activities:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {group.activities.slice(0, 3).map((activity) => (
                      <li key={activity} className="flex items-center gap-1">
                        <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                        {activity}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button
                  onClick={() => toggleMembership(group.id)}
                  variant={group.is_member ? "outline" : "default"}
                  className="flex-1"
                  disabled={!group.is_member && userMembershipCount >= 3}
                >
                  {group.is_member ? "Leave Group" : "Join Group"}
                </Button>
                {group.is_admin && (
                  <Button
                    variant="outline"
                    size="icon"
                    className="shrink-0"
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {groups.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No communities available</h3>
          <p className="text-gray-500">Communities will be available soon.</p>
        </div>
      )}
    </div>
  );
};

export default CommunityGroups;
