
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, Medal, Award, TrendingUp, Star, Zap, Flame, Calendar, Code, FileText, Monitor, ChevronDown, ChevronUp, Users } from 'lucide-react';
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
        return <Trophy className="w-5 h-5 text-amber-600" />;
      case 2:
        return <Medal className="w-5 h-5 text-slate-600" />;
      case 3:
        return <Award className="w-5 h-5 text-orange-600" />;
      default:
        return <TrendingUp className="w-4 h-4 text-blue-600" />;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-white shadow-lg shadow-amber-200 border-0 hover:shadow-xl transition-all duration-300 animate-pulse-soft';
      case 2:
        return 'bg-gradient-to-r from-slate-300 via-gray-400 to-slate-500 text-white shadow-lg shadow-slate-200 border-0 hover:shadow-xl transition-all duration-300';
      case 3:
        return 'bg-gradient-to-r from-orange-400 via-amber-500 to-orange-600 text-white shadow-lg shadow-orange-200 border-0 hover:shadow-xl transition-all duration-300';
      default:
        return rank <= 10 
          ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md shadow-blue-200 border-0 hover:shadow-lg transition-all duration-200'
          : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-sm border-0 hover:shadow-md transition-all duration-200';
    }
  };

  const getActivityBreakdown = (member: EnhancedMemberRank) => {
    return [
      { label: 'Events', points: member.event_points, count: member.events_attended, icon: Calendar, color: 'from-blue-500 to-blue-600', textColor: 'text-blue-700' },
      { label: 'Projects', points: member.project_points, count: member.projects_created, icon: Code, color: 'from-purple-500 to-purple-600', textColor: 'text-purple-700' },
      { label: 'Blogs', points: member.blog_points, count: member.blogs_written, icon: FileText, color: 'from-orange-500 to-orange-600', textColor: 'text-orange-700' },
      { label: 'Visits', points: member.visit_points, count: member.visit_days, icon: Monitor, color: 'from-green-500 to-green-600', textColor: 'text-green-700' },
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
            <Badge className="bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 px-3 py-1">
              <Zap className="w-3 h-3 mr-1" />
              Points System
            </Badge>
          </div>
          <Badge variant="outline" className="bg-white/90 backdrop-blur-sm border-gray-300 hover:bg-gray-50 transition-colors duration-200 px-3 py-1">
            <Users className="w-3 h-3 mr-1" />
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
                className={`transition-all duration-300 border-b border-gray-100 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50/30 ${
                  member.rank === 1 
                    ? 'bg-gradient-to-r from-amber-50/50 to-yellow-50/50'
                    : member.rank === 2 
                      ? 'bg-gradient-to-r from-slate-50/50 to-gray-50/50'
                      : member.rank === 3
                        ? 'bg-gradient-to-r from-orange-50/50 to-amber-50/50'
                        : 'bg-white'
                }`}
              >
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex items-center space-x-3">
                      {getRankIcon(member.rank)}
                      <Badge 
                        className={`${getRankBadgeColor(member.rank)} font-bold min-w-[60px] flex justify-center text-sm px-4 py-2 transform hover:scale-105`}
                      >
                        #{member.rank}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-4 flex-1">
                      {member.avatar_url ? (
                        <img 
                          src={member.avatar_url} 
                          alt={member.name}
                          className="w-12 h-12 rounded-full border-2 border-white shadow-lg ring-2 ring-blue-100 hover:ring-blue-200 transition-all duration-200"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg ring-2 ring-blue-100 hover:ring-blue-200 transition-all duration-200">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-gray-900 text-lg truncate">{member.name}</h3>
                        <div className="flex items-center space-x-2 mt-2">
                          {activityBreakdown.slice(0, 4).map((item) => {
                            const Icon = item.icon;
                            return (
                              <Badge 
                                key={item.label}
                                className={`text-xs px-3 py-1 bg-gradient-to-r ${item.color} text-white border-0 shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105`}
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
                      <div className="font-bold text-transparent bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-2xl">{member.total_points}</div>
                      <div className="text-gray-500 text-xs font-medium">Total Points</div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedMember(isExpanded ? null : member.user_id)}
                      className="p-2 hover:bg-blue-50 rounded-full transition-colors duration-200"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 pb-4 bg-gradient-to-r from-gray-50/50 to-blue-50/30 border-t border-gray-200/50">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      {activityBreakdown.map((item) => {
                        const Icon = item.icon;
                        return (
                          <div key={item.label} className="text-center p-4 bg-white rounded-xl border border-gray-200/50 shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-102 backdrop-blur-sm">
                            <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center mx-auto mb-3 shadow-md`}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div className="font-bold text-xl text-gray-800">{item.points}</div>
                            <div className="text-xs text-gray-500 mb-1 font-medium">{item.label} Points</div>
                            <Badge className={`text-xs ${item.textColor} bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors duration-200`}>
                              {item.count} activities
                            </Badge>
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
          <div className="p-4 text-center border-t border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50/30">
            <Button 
              variant="outline" 
              onClick={() => setDisplayCount(prev => prev + 10)}
              className="bg-white/90 backdrop-blur-sm hover:bg-blue-50 border-gray-300 hover:border-blue-400 transition-all duration-200 px-6 py-2"
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
