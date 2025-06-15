
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, Medal, Award, TrendingUp, Star, Zap, Flame, Calendar, Code, FileText, Monitor, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface EnhancedMemberRank {
  user_id: string;
  name: string;
  email: string;
  avatar_url?: string;
  total_points: number;
  event_points: number;
  project_points: number;
  blog_points: number;
  visit_points: number;
  subscription_points: number;
  events_attended: number;
  projects_created: number;
  blogs_written: number;
  visit_days: number;
  subscriptions_made: number;
  rank: number;
}

interface MemberRankingProps {
  searchTerm?: string;
  filter?: string;
  timeFilter?: string;
}

const EnhancedMemberRanking = ({ searchTerm = '', filter = 'all', timeFilter = 'all' }: MemberRankingProps) => {
  const [rankings, setRankings] = useState<EnhancedMemberRank[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedMember, setExpandedMember] = useState<string | null>(null);
  const [displayCount, setDisplayCount] = useState(10);

  useEffect(() => {
    fetchRankings();
  }, [timeFilter]);

  const fetchRankings = async () => {
    try {
      const { data, error } = await supabase
        .from('enhanced_member_leaderboard')
        .select('*')
        .order('rank')
        .limit(50);

      if (error) throw error;
      setRankings(data || []);
    } catch (error) {
      console.error('Error fetching enhanced rankings:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRankings = rankings.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || 
                         (filter === 'active' && member.total_points > 100) ||
                         (filter === 'new' && member.rank > 30);
    
    return matchesSearch && matchesFilter;
  }).slice(0, displayCount);

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

  const getActivityBreakdown = (member: EnhancedMemberRank) => {
    return [
      { label: 'Events', points: member.event_points, count: member.events_attended, icon: Calendar, color: 'text-blue-600' },
      { label: 'Projects', points: member.project_points, count: member.projects_created, icon: Code, color: 'text-purple-600' },
      { label: 'Blogs', points: member.blog_points, count: member.blogs_written, icon: FileText, color: 'text-orange-600' },
      { label: 'Visits', points: member.visit_points, count: member.visit_days, icon: Monitor, color: 'text-green-600' },
    ].filter(item => item.points > 0);
  };

  if (loading) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            <span>Enhanced Member Leaderboard</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-100 rounded-lg"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-xl overflow-hidden bg-white/95 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-blue-50 via-purple-50 to-green-50 border-b-2 border-gray-200">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            <span className="text-xl font-bold">Enhanced Member Leaderboard</span>
            <Badge className="bg-green-100 text-green-800 border border-green-300">Points System</Badge>
          </div>
          <Badge variant="outline" className="bg-white">
            {filteredRankings.length} Members
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-1">
          {filteredRankings.map((member) => {
            const activityBreakdown = getActivityBreakdown(member);
            const isExpanded = expandedMember === member.user_id;
            
            return (
              <div
                key={member.user_id}
                className={`transition-all duration-200 border-b border-gray-100 hover:bg-gray-50/50 ${
                  member.rank === 1 
                    ? 'bg-gradient-to-r from-yellow-50 to-amber-50'
                    : member.rank === 2 
                      ? 'bg-gradient-to-r from-gray-50 to-blue-50'
                      : member.rank === 3
                        ? 'bg-gradient-to-r from-orange-50 to-amber-50'
                        : 'bg-white'
                }`}
              >
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex items-center space-x-3">
                      {getRankIcon(member.rank)}
                      <Badge 
                        className={`${getRankBadgeColor(member.rank)} border font-bold min-w-[50px] flex justify-center text-sm px-3 py-1`}
                      >
                        #{member.rank}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-4 flex-1">
                      {member.avatar_url ? (
                        <img 
                          src={member.avatar_url} 
                          alt={member.name}
                          className="w-12 h-12 rounded-full border-2 border-white shadow-md"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-gray-900 text-lg truncate">{member.name}</h3>
                        <div className="flex items-center space-x-3 mt-1">
                          {activityBreakdown.slice(0, 4).map((item) => {
                            const Icon = item.icon;
                            return (
                              <Badge 
                                key={item.label}
                                className="text-xs px-2 py-1 bg-white/90 text-gray-700 border border-gray-300 shadow-sm"
                              >
                                <Icon className="w-3 h-3 mr-1" />
                                {item.points}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className="font-bold text-green-600 text-2xl">{member.total_points}</div>
                      <div className="text-gray-500 text-xs">Total Points</div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedMember(isExpanded ? null : member.user_id)}
                      className="p-2"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 pb-4 bg-gray-50/50 border-t border-gray-200">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      {activityBreakdown.map((item) => {
                        const Icon = item.icon;
                        return (
                          <div key={item.label} className="text-center p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                            <Icon className={`w-5 h-5 ${item.color} mx-auto mb-2`} />
                            <div className="font-bold text-lg">{item.points}</div>
                            <div className="text-xs text-gray-500 mb-1">{item.label} Points</div>
                            <div className="text-xs font-medium text-gray-700">{item.count} activities</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Load More Button */}
        {filteredRankings.length < rankings.length && (
          <div className="p-4 text-center border-t border-gray-200 bg-gray-50">
            <Button 
              variant="outline" 
              onClick={() => setDisplayCount(prev => prev + 10)}
              className="bg-white hover:bg-gray-100"
            >
              Load More Members
            </Button>
          </div>
        )}
        
        {filteredRankings.length === 0 && !loading && (
          <div className="text-center py-12 text-gray-500">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium text-gray-700">No members found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedMemberRanking;
