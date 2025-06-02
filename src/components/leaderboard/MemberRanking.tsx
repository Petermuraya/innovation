
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface MemberRank {
  user_id: string;
  name: string;
  email: string;
  total_points: number;
  events_attended: number;
  badges_earned: number;
  projects_created: number;
  avg_project_rating: number;
  rank: number;
}

const MemberRanking = () => {
  const [rankings, setRankings] = useState<MemberRank[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRankings();
  }, []);

  const fetchRankings = async () => {
    try {
      const { data, error } = await supabase
        .rpc('calculate_detailed_member_ranking');

      if (error) throw error;
      setRankings(data || []);
    } catch (error) {
      console.error('Error fetching rankings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-orange-500" />;
      default:
        return <TrendingUp className="w-6 h-6 text-blue-500" />;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 2:
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 3:
        return 'bg-orange-100 text-orange-800 border-orange-300';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            <span>Member Leaderboard</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading rankings...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Trophy className="h-6 w-6 text-yellow-500" />
          <span>Member Leaderboard</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {rankings.map((member) => (
            <div
              key={member.user_id}
              className={`flex items-center justify-between p-4 rounded-lg border-2 transition-colors ${
                member.rank <= 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50' : 'bg-white hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {getRankIcon(member.rank)}
                  <Badge className={`${getRankBadgeColor(member.rank)} border`}>
                    #{member.rank}
                  </Badge>
                </div>
                <div>
                  <h3 className="font-semibold text-kic-gray">{member.name}</h3>
                  <p className="text-sm text-kic-gray/70">{member.email}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6 text-sm">
                <div className="text-center">
                  <div className="font-bold text-kic-green-600">{member.total_points}</div>
                  <div className="text-kic-gray/70">Points</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-blue-600">{member.events_attended}</div>
                  <div className="text-kic-gray/70">Events</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-purple-600">{member.badges_earned}</div>
                  <div className="text-kic-gray/70">Badges</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-orange-600">{member.projects_created}</div>
                  <div className="text-kic-gray/70">Projects</div>
                </div>
                {member.avg_project_rating > 0 && (
                  <div className="text-center">
                    <div className="font-bold text-yellow-600">{member.avg_project_rating.toFixed(1)}★</div>
                    <div className="text-kic-gray/70">Rating</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {rankings.length === 0 && (
          <div className="text-center py-8 text-kic-gray/70">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>No rankings available yet</p>
            <p className="text-sm">Start participating to see your ranking!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MemberRanking;
