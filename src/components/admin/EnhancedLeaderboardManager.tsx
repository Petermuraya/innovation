
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Trophy, Award, Users, TrendingUp, Star, Zap, Activity } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

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

const EnhancedLeaderboardManager = () => {
  const [leaderboard, setLeaderboard] = useState<EnhancedMemberRank[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchEnhancedLeaderboard();
    const memberPointsChannel = supabase
      .channel('leaderboard-member-points-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'member_points'
        },
        (payload) => {
          console.log('Member points changed:', payload);
          fetchEnhancedLeaderboard();
        }
      )
      .subscribe();

    const membersChannel = supabase
      .channel('leaderboard-members-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'members'
        },
        (payload) => {
          console.log('Members table changed (leaderboard):', payload);
          fetchEnhancedLeaderboard();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(memberPointsChannel);
      supabase.removeChannel(membersChannel);
    };
  }, []);

  const fetchEnhancedLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from('enhanced_member_leaderboard')
        .select('*')
        .order('rank');

      if (error) throw error;
      setLeaderboard(data || []);
    } catch (error) {
      console.error('Error fetching enhanced leaderboard:', error);
      toast({
        title: "Error",
        description: "Failed to fetch leaderboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const awardBonusPoints = async (userId: string, points: number, description: string) => {
    try {
      const { error } = await supabase.rpc('award_activity_points', {
        user_id_param: userId,
        activity_type_param: 'admin_bonus',
        source_id_param: null,
        description_param: description
      });

      if (error) throw error;
      
      // Don't manually refresh - real-time subscription will handle it
      toast({
        title: "Success",
        description: `Awarded ${points} bonus points successfully`,
      });
    } catch (error) {
      console.error('Error awarding bonus points:', error);
      toast({
        title: "Error",
        description: "Failed to award bonus points",
        variant: "destructive",
      });
    }
  };

  const filteredLeaderboard = leaderboard.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Award className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Star className="w-5 h-5 text-orange-500" />;
      default:
        return <TrendingUp className="w-5 h-5 text-blue-500" />;
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
        return rank <= 10 ? 'bg-blue-100 text-blue-800 border-blue-300' : 'bg-gray-50 text-gray-600';
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading enhanced leaderboard...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Enhanced Member Leaderboard
          </CardTitle>
          <div className="flex items-center gap-4">
            <Input
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Button onClick={fetchEnhancedLeaderboard}>
              <TrendingUp className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Rank</TableHead>
                  <TableHead>Member</TableHead>
                  <TableHead className="text-center">Total Points</TableHead>
                  <TableHead className="text-center">Event Points</TableHead>
                  <TableHead className="text-center">Project Points</TableHead>
                  <TableHead className="text-center">Blog Points</TableHead>
                  <TableHead className="text-center">Visit Points</TableHead>
                  <TableHead className="text-center">Activities</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeaderboard.map((member) => (
                  <TableRow key={member.user_id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getRankIcon(member.rank)}
                        <Badge className={getRankBadgeColor(member.rank)}>
                          #{member.rank}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {member.avatar_url ? (
                          <img 
                            src={member.avatar_url} 
                            alt={member.name}
                            className="w-8 h-8 rounded-full"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-medium">
                            {member.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-gray-500">{member.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="font-bold text-green-600">{member.total_points}</div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="text-blue-600">{member.event_points}</div>
                      <div className="text-xs text-gray-500">{member.events_attended} events</div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="text-purple-600">{member.project_points}</div>
                      <div className="text-xs text-gray-500">{member.projects_created} projects</div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="text-orange-600">{member.blog_points}</div>
                      <div className="text-xs text-gray-500">{member.blogs_written} blogs</div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="text-green-600">{member.visit_points}</div>
                      <div className="text-xs text-gray-500">{member.visit_days} days</div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col space-y-1">
                        <Badge variant="outline" className="text-xs">
                          <Zap className="w-3 h-3 mr-1" />
                          {member.subscriptions_made} subs
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => awardBonusPoints(member.user_id, 50, 'Admin bonus points')}
                      >
                        +50 Bonus
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedLeaderboardManager;
