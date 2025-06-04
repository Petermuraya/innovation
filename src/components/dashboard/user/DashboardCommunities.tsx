
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, Calendar, MapPin, Award, Settings, Info } from 'lucide-react';
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

const DashboardCommunities = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [communities, setCommunities] = useState<CommunityGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [userMembershipCount, setUserMembershipCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchCommunities();
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

  const fetchCommunities = async () => {
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

      setCommunities(enrichedGroups);
    } catch (error) {
      console.error('Error fetching communities:', error);
      toast({
        title: "Error",
        description: "Failed to load communities",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleMembership = async (groupId: string) => {
    if (!user) return;

    try {
      const group = communities.find(g => g.id === groupId);
      if (!group) return;

      if (group.is_member) {
        // Check if user would have less than 1 community after leaving
        if (userMembershipCount <= 1) {
          toast({
            title: "Cannot leave community",
            description: "You must be a member of at least one community",
            variant: "destructive",
          });
          return;
        }

        // Leave group
        await supabase
          .from('community_memberships')
          .delete()
          .eq('community_id', groupId)
          .eq('user_id', user.id);

        toast({
          title: "Left community",
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
          title: "Joined community",
          description: `Welcome to ${group.name}!`,
        });
      }

      // Refresh communities and membership count
      await fetchCommunities();
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
    return <div className="text-center py-8">Loading communities...</div>;
  }

  const myCommunities = communities.filter(c => c.is_member);
  const availableCommunities = communities.filter(c => !c.is_member);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-kic-gray">My Communities</h3>
        <Badge variant="secondary" className="flex items-center gap-1">
          <Users className="w-3 h-3" />
          {userMembershipCount}/3
        </Badge>
      </div>

      {userMembershipCount === 0 && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            You must join at least one community to participate in club activities.
          </AlertDescription>
        </Alert>
      )}

      {/* My Communities */}
      {myCommunities.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Joined Communities</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myCommunities.map((community) => (
              <Card key={community.id} className="border-green-200 bg-green-50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-sm">
                    <span>{community.name}</span>
                    <div className="flex items-center gap-2">
                      {community.is_admin && (
                        <Badge variant="default" className="flex items-center gap-1 text-xs">
                          <Award className="w-3 h-3" />
                          Admin
                        </Badge>
                      )}
                      <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                        <Users className="w-3 h-3" />
                        {community.member_count}
                      </Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-700">{community.description}</p>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Calendar className="w-3 h-3" />
                    <span>{community.meeting_schedule}</span>
                  </div>

                  {community.focus_areas && community.focus_areas.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {community.focus_areas.slice(0, 3).map((area) => (
                        <Badge key={area} variant="outline" className="text-xs">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={() => toggleMembership(community.id)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      disabled={userMembershipCount <= 1}
                    >
                      Leave Community
                    </Button>
                    {community.is_admin && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="shrink-0"
                      >
                        <Settings className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Available Communities */}
      {availableCommunities.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Available Communities</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableCommunities.map((community) => (
              <Card key={community.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-sm">
                    <span>{community.name}</span>
                    <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                      <Users className="w-3 h-3" />
                      {community.member_count}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-700">{community.description}</p>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Calendar className="w-3 h-3" />
                    <span>{community.meeting_schedule}</span>
                  </div>

                  {community.focus_areas && community.focus_areas.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {community.focus_areas.slice(0, 3).map((area) => (
                        <Badge key={area} variant="outline" className="text-xs">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <Button
                    onClick={() => toggleMembership(community.id)}
                    variant="default"
                    size="sm"
                    className="w-full mt-3"
                    disabled={userMembershipCount >= 3}
                  >
                    {userMembershipCount >= 3 ? "Limit Reached" : "Join Community"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {communities.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No communities available</h3>
          <p className="text-gray-500">Communities will be available soon.</p>
        </div>
      )}
    </div>
  );
};

export default DashboardCommunities;
