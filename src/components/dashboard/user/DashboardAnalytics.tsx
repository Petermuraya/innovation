import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Award, 
  Activity, 
  TrendingUp, 
  Calendar, 
  Users, 
  FileText,
  Target,
  Star,
  Trophy,
  BarChart3
} from 'lucide-react';

interface UserAnalytics {
  totalPoints: number;
  rank: number;
  totalMembers: number;
  activitiesThisMonth: number;
  eventsAttended: number;
  blogsPublished: number;
  communitiesJoined: number;
  certificatesEarned: number;
  recentAchievements: Array<{
    id: string;
    title: string;
    points: number;
    date: string;
    type: string;
  }>;
}

const DashboardAnalytics = () => {
  const { member } = useAuth();
  const [analytics, setAnalytics] = useState<UserAnalytics>({
    totalPoints: 0,
    rank: 0,
    totalMembers: 0,
    activitiesThisMonth: 0,
    eventsAttended: 0,
    blogsPublished: 0,
    communitiesJoined: 0,
    certificatesEarned: 0,
    recentAchievements: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (member) {
      fetchAnalytics();
    }
  }, [member]);

  const fetchAnalytics = async () => {
    if (!member) return;

    try {
      setLoading(true);

      // Fetch total points
      const { data: pointsData } = await supabase
        .from('member_points')
        .select('points, earned_at, activity_type, description')
        .eq('user_id', member.id);

      const totalPoints = pointsData?.reduce((sum, point) => sum + (point.points || 0), 0) || 0;

      // Get recent achievements
      const recentAchievements = pointsData?.slice(-5).map(point => ({
        id: crypto.randomUUID(),
        title: point.description || 'Achievement earned',
        points: point.points,
        date: point.earned_at,
        type: point.activity_type || 'general'
      })) || [];

      // Calculate monthly activity
      const now = new Date();
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const activitiesThisMonth = pointsData?.filter(point => 
        new Date(point.earned_at) >= thisMonth
      ).length || 0;

      // Fetch ranking
      const { data: rankingData } = await supabase
        .rpc('calculate_member_ranking');

      const userRank = rankingData?.find((r: any) => r.user_id === member.id)?.rank || 0;
      const totalMembers = rankingData?.length || 0;

      // Fetch other stats
      const { count: eventsCount } = await supabase
        .from('event_attendance')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', member.id);

      const { count: blogsCount } = await supabase
        .from('blogs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', member.id)
        .eq('status', 'published');

      const { count: communitiesCount } = await supabase
        .from('community_memberships')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', member.id)
        .eq('status', 'active');

      const { count: certificatesCount } = await supabase
        .from('certificates')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', member.id);

      setAnalytics({
        totalPoints,
        rank: userRank,
        totalMembers,
        activitiesThisMonth,
        eventsAttended: eventsCount || 0,
        blogsPublished: blogsCount || 0,
        communitiesJoined: communitiesCount || 0,
        certificatesEarned: certificatesCount || 0,
        recentAchievements
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading analytics...</div>;
  }

  const stats = [
    {
      title: "Total Points",
      value: analytics.totalPoints.toLocaleString(),
      change: `+${analytics.activitiesThisMonth} this month`,
      icon: Award,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      trend: "up"
    },
    {
      title: "Rank Position",
      value: analytics.rank ? `#${analytics.rank}` : 'N/A',
      change: `Out of ${analytics.totalMembers}`,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
      trend: "up"
    },
    {
      title: "Activities",
      value: analytics.activitiesThisMonth.toString(),
      change: "This month",
      icon: Activity,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      trend: "stable"
    },
    {
      title: "Events Attended",
      value: analytics.eventsAttended.toString(),
      change: "Total events",
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      trend: "up"
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h3>
        <p className="text-gray-600 mt-2">Track your progress, achievements, and growth over time</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    <p className="text-sm text-gray-500 mt-1">{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Activity Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Activity Overview
            </CardTitle>
            <CardDescription>Your engagement across different areas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Blog Posts Published</span>
                  <span>{analytics.blogsPublished}</span>
                </div>
                <Progress value={analytics.blogsPublished * 10} className="h-2" />
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Communities Joined</span>
                  <span>{analytics.communitiesJoined}/3</span>
                </div>
                <Progress value={(analytics.communitiesJoined / 3) * 100} className="h-2" />
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Certificates Earned</span>
                  <span>{analytics.certificatesEarned}</span>
                </div>
                <Progress value={analytics.certificatesEarned * 20} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Recent Achievements
            </CardTitle>
            <CardDescription>Your latest accomplishments and earned points</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.recentAchievements.length > 0 ? (
                analytics.recentAchievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">{achievement.title}</h4>
                      <p className="text-xs text-gray-500">
                        {new Date(achievement.date).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="secondary" className="bg-kic-green-100 text-kic-green-700">
                      +{achievement.points}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm text-center py-4">
                  No achievements yet. Start participating to earn points!
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Performance Summary
          </CardTitle>
          <CardDescription>Your overall engagement and growth metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-kic-green-50 rounded-lg">
              <div className="text-2xl font-bold text-kic-green-700">{analytics.totalPoints}</div>
              <div className="text-sm text-kic-green-600">Total Points</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-700">
                {analytics.rank ? `#${analytics.rank}` : 'N/A'}
              </div>
              <div className="text-sm text-blue-600">Current Rank</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-700">{analytics.activitiesThisMonth}</div>
              <div className="text-sm text-purple-600">Monthly Activity</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-700">
                {analytics.totalMembers > 0 && analytics.rank ? 
                  Math.round(((analytics.totalMembers - analytics.rank + 1) / analytics.totalMembers) * 100) : 0}%
              </div>
              <div className="text-sm text-yellow-600">Percentile</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardAnalytics;