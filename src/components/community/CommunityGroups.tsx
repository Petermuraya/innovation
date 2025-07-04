import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Users, Calendar, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface CommunityGroup {
  id: string;
  name: string;
  description: string;
  meeting_days: string[];
  meeting_time: string;
  meeting_location: string;
  focus_areas: string[];
  activities: string[];
  next_meeting_date: string;
  is_active: boolean;
}

const CommunityGroups = () => {
  const { member } = useAuth();
  const { toast } = useToast();
  const [groups, setGroups] = useState<CommunityGroup[]>([]);
  const [userMemberships, setUserMemberships] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGroups();
    if (member) {
      fetchUserMemberships();
    }
  }, [member]);

  const fetchGroups = async () => {
    try {
      const { data, error } = await supabase
        .from('community_groups')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setGroups(data || []);
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

  const fetchUserMemberships = async () => {
    if (!member) return;

    try {
      const { data, error } = await supabase
        .from('community_memberships')
        .select('community_id')
        .eq('user_id', member.id)
        .eq('status', 'active');

      if (error) throw error;
      setUserMemberships(data?.map(m => m.community_id) || []);
    } catch (error) {
      console.error('Error fetching user memberships:', error);
    }
  };

  const handleJoinGroup = async (groupId: string) => {
    if (!member) {
      toast({
        title: "Authentication required",
        description: "Please log in to join a community",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('community_memberships')
        .insert({
          user_id: member.id,
          community_id: groupId,
          status: 'active'
        });

      if (error) throw error;

      setUserMemberships([...userMemberships, groupId]);
      toast({
        title: "Success",
        description: "You've successfully joined the community!",
      });
    } catch (error) {
      console.error('Error joining community:', error);
      toast({
        title: "Error",
        description: "Failed to join community",
        variant: "destructive",
      });
    }
  };

  const handleLeaveGroup = async (groupId: string) => {
    if (!member) return;

    try {
      const { error } = await supabase
        .from('community_memberships')
        .delete()
        .eq('user_id', member.id)
        .eq('community_id', groupId);

      if (error) throw error;

      setUserMemberships(userMemberships.filter(id => id !== groupId));
      toast({
        title: "Success",
        description: "You've left the community",
      });
    } catch (error) {
      console.error('Error leaving community:', error);
      toast({
        title: "Error",
        description: "Failed to leave community",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-kic-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-kic-gray mb-4">Join Our Innovation Communities</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Connect with like-minded innovators, participate in specialized workshops, and contribute to cutting-edge projects.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => {
          const isMember = userMemberships.includes(group.id);
          
          return (
            <Card key={group.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl text-kic-green-600">{group.name}</CardTitle>
                  {isMember && (
                    <Badge variant="secondary" className="bg-kic-green-100 text-kic-green-800">
                      <Check className="w-3 h-3 mr-1" />
                      Joined
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-gray-600">
                  {group.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Meeting Schedule */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{group.meeting_days.join(', ')}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{group.meeting_time}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{group.meeting_location}</span>
                </div>

                {/* Focus Areas */}
                <div>
                  <h4 className="font-semibold text-sm text-gray-700 mb-2">Focus Areas</h4>
                  <div className="flex flex-wrap gap-1">
                    {group.focus_areas.map((area, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Activities */}
                <div>
                  <h4 className="font-semibold text-sm text-gray-700 mb-2">Activities</h4>
                  <div className="flex flex-wrap gap-1">
                    {group.activities.map((activity, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {activity}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Next Meeting */}
                {group.next_meeting_date && (
                  <div className="bg-kic-green-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-kic-green-700">
                      <Users className="w-4 h-4" />
                      <span>Next meeting: {new Date(group.next_meeting_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                )}

                {/* Join/Leave Button */}
                <Button
                  onClick={() => isMember ? handleLeaveGroup(group.id) : handleJoinGroup(group.id)}
                  variant={isMember ? "outline" : "default"}
                  className="w-full"
                >
                  {isMember ? 'Leave Community' : 'Join Community'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CommunityGroups;
