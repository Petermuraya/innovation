import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, TrendingUp, Star, Zap, Flame, Shield, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface MemberRank {
  user_id: string;
  name: string;
  avatar_url?: string;
  email: string;
  total_points: number;
  events_attended: number;
  badges_earned: number;
  projects_created: number;
  avg_project_rating: number;
  rank: number;
  streak_days?: number;
  is_premium?: boolean;
  top_badges?: string[];
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
        return <Trophy className="w-6 h-6 text-yellow-500 fill-yellow-200" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400 fill-gray-200" />;
      case 3:
        return <Award className="w-6 h-6 text-orange-500 fill-orange-200" />;
      default:
        return <TrendingUp className="w-6 h-6 text-blue-500" />;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-br from-yellow-200 to-yellow-400 text-yellow-900 border-yellow-500 shadow-md shadow-yellow-200';
      case 2:
        return 'bg-gradient-to-br from-gray-200 to-gray-300 text-gray-800 border-gray-400 shadow-md shadow-gray-200';
      case 3:
        return 'bg-gradient-to-br from-orange-200 to-orange-300 text-orange-900 border-orange-400 shadow-md shadow-orange-200';
      default:
        return rank <= 10 
          ? 'bg-gradient-to-br from-blue-100 to-blue-200 text-blue-800 border-blue-300 shadow-sm shadow-blue-100'
          : 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const renderBadge = (badgeName: string) => {
    const badgeStyles: Record<string, string> = {
      'Top Contributor': 'bg-purple-100 text-purple-800 border-purple-300',
      'Event Champion': 'bg-green-100 text-green-800 border-green-300',
      'Project Master': 'bg-blue-100 text-blue-800 border-blue-300',
      'Quality Expert': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'Innovator': 'bg-pink-100 text-pink-800 border-pink-300',
      'Early Adopter': 'bg-indigo-100 text-indigo-800 border-indigo-300',
      'Streak Master': 'bg-red-100 text-red-800 border-red-300',
      'Premium Member': 'bg-gradient-to-r from-amber-200 to-amber-400 text-amber-900 border-amber-500'
    };

    const badgeIcons: Record<string, JSX.Element> = {
      'Top Contributor': <Star className="w-3 h-3 mr-1" />,
      'Event Champion': <Zap className="w-3 h-3 mr-1" />,
      'Project Master': <Flame className="w-3 h-3 mr-1" />,
      'Quality Expert': <Shield className="w-3 h-3 mr-1" />,
      'Innovator': <Sparkles className="w-3 h-3 mr-1" />,
      'Premium Member': <Sparkles className="w-3 h-3 mr-1" />
    };

    return (
      <Badge 
        key={badgeName}
        className={`text-xs font-semibold px-2 py-1 border ${badgeStyles[badgeName] || 'bg-gray-100 text-gray-800'}`}
      >
        {badgeIcons[badgeName] || null}
        {badgeName}
      </Badge>
    );
  };

  if (loading) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            <span>Member Leaderboard</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-pulse flex flex-col space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-100 rounded-lg"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
        <CardTitle className="flex items-center space-x-2">
          <Trophy className="h-6 w-6 text-yellow-500" />
          <span>Member Leaderboard</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-2">
          {rankings.map((member) => (
            <div
              key={member.user_id}
              className={`flex items-center justify-between p-4 transition-all ${
                member.rank === 1 
                  ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border-b border-yellow-200'
                  : member.rank === 2 
                    ? 'bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200'
                    : member.rank === 3
                      ? 'bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-200'
                      : 'bg-white hover:bg-gray-50 border-b border-gray-100'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {getRankIcon(member.rank)}
                  <Badge 
                    className={`${getRankBadgeColor(member.rank)} border font-bold min-w-[40px] flex justify-center`}
                  >
                    #{member.rank}
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-3">
                  {member.avatar_url ? (
                    <img 
                      src={member.avatar_url} 
                      alt={member.name}
                      className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900">{member.name}</h3>
                      {member.is_premium && (
                        <Badge className="bg-gradient-to-r from-amber-200 to-amber-400 text-amber-900 border-amber-500 text-xs px-2 py-0.5">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Premium
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{member.email}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                {/* Badges Section */}
                <div className="flex space-x-2 max-w-[200px] flex-wrap">
                  {member.top_badges?.slice(0, 3).map(badge => renderBadge(badge))}
                  {member.badges_earned > 3 && (
                    <Badge className="bg-gray-100 text-gray-500 text-xs px-2 py-1">
                      +{member.badges_earned - 3} more
                    </Badge>
                  )}
                </div>
                
                {/* Stats Section */}
                <div className="flex items-center space-x-6 text-sm">
                  <div className="text-center min-w-[60px]">
                    <div className="font-bold text-green-600 text-lg">{member.total_points}</div>
                    <div className="text-gray-500 text-xs">Points</div>
                  </div>
                  <div className="text-center min-w-[60px]">
                    <div className="font-bold text-blue-600">{member.events_attended}</div>
                    <div className="text-gray-500 text-xs">Events</div>
                  </div>
                  <div className="text-center min-w-[60px]">
                    <div className="font-bold text-purple-600">{member.projects_created}</div>
                    <div className="text-gray-500 text-xs">Projects</div>
                  </div>
                  {member.streak_days && member.streak_days > 0 && (
                    <div className="text-center min-w-[60px]">
                      <div className="font-bold text-red-500 flex items-center justify-center">
                        <Flame className="w-4 h-4 mr-1" />
                        {member.streak_days}
                      </div>
                      <div className="text-gray-500 text-xs">Day Streak</div>
                    </div>
                  )}
                  {member.avg_project_rating > 0 && (
                    <div className="text-center min-w-[60px]">
                      <div className="font-bold text-yellow-600 flex items-center justify-center">
                        <Star className="w-4 h-4 mr-1" />
                        {member.avg_project_rating.toFixed(1)}
                      </div>
                      <div className="text-gray-500 text-xs">Rating</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {rankings.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium text-gray-700">No rankings available yet</p>
            <p className="text-sm">Start participating to see your ranking!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MemberRanking;