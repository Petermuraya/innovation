
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Award } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const MemberRanking = () => {
  const [rankings, setRankings] = useState<any[]>([]);
  const [badges, setBadges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRankings();
    fetchBadges();
  }, []);

  const fetchRankings = async () => {
    try {
      const { data, error } = await supabase.rpc('calculate_member_ranking');
      if (error) throw error;

      // Get member names
      const userIds = data?.map((r: any) => r.user_id) || [];
      const { data: members } = await supabase
        .from('members')
        .select('user_id, name')
        .in('user_id', userIds);

      const rankingsWithNames = data?.map((ranking: any) => ({
        ...ranking,
        name: members?.find(m => m.user_id === ranking.user_id)?.name || 'Anonymous'
      })) || [];

      setRankings(rankingsWithNames.slice(0, 10));
    } catch (error) {
      console.error('Error fetching rankings:', error);
    }
  };

  const fetchBadges = async () => {
    try {
      const { data, error } = await supabase
        .from('member_badges')
        .select(`
          *,
          members!inner(name)
        `)
        .order('earned_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setBadges(data || []);
    } catch (error) {
      console.error('Error fetching badges:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBadgeColor = (badgeType: string) => {
    const colors = {
      top_contributor: 'bg-yellow-500',
      event_speaker: 'bg-blue-500',
      project_star: 'bg-purple-500',
      community_leader: 'bg-green-500',
      innovator: 'bg-orange-500',
      mentor: 'bg-pink-500'
    };
    return colors[badgeType as keyof typeof colors] || 'bg-gray-500';
  };

  const getBadgeIcon = (badgeType: string) => {
    switch (badgeType) {
      case 'top_contributor':
        return <Star className="h-3 w-3" />;
      case 'event_speaker':
        return <Award className="h-3 w-3" />;
      default:
        return <Award className="h-3 w-3" />;
    }
  };

  if (loading) {
    return <div>Loading rankings...</div>;
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Member Rankings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Top Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {rankings.map((member, index) => (
              <div key={member.user_id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    index === 0 ? 'bg-yellow-500' : 
                    index === 1 ? 'bg-gray-400' : 
                    index === 2 ? 'bg-orange-600' : 'bg-primary'
                  } text-white font-bold text-sm`}>
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{member.name}</div>
                    <div className="text-sm text-gray-600">{member.badges_count} badges</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{member.total_points} points</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Badges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Recent Badges
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {badges.map((badge) => (
              <div key={badge.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${getBadgeColor(badge.badge_type)} text-white`}>
                    {getBadgeIcon(badge.badge_type)}
                  </div>
                  <div>
                    <div className="font-medium">{badge.members?.name || 'Anonymous'}</div>
                    <div className="text-sm text-gray-600">
                      {badge.badge_type.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">
                    {new Date(badge.earned_at).toLocaleDateString()}
                  </div>
                  <div className="font-medium">{badge.points} pts</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MemberRanking;
