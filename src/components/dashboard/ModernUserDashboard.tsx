
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  Calendar, 
  FileText, 
  Briefcase, 
  Award, 
  Users, 
  BookOpen, 
  CreditCard,
  TrendingUp,
  Target,
  Clock,
  Star
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';

interface DashboardStats {
  totalPoints: number;
  eventsAttended: number;
  blogPosts: number;
  certificates: number;
  communities: number;
  rank: number;
}

interface RecentActivity {
  id: string;
  title: string;
  time: string;
  type: string;
  points: number;
}

interface UpcomingEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  status: string;
}

const ModernUserDashboard = () => {
  const { member } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalPoints: 0,
    eventsAttended: 0,
    blogPosts: 0,
    certificates: 0,
    communities: 0,
    rank: 0
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (member) {
      fetchDashboardData();
    }
  }, [member]);

  const fetchDashboardData = async () => {
    if (!member) return;

    try {
      setLoading(true);

      // Fetch member points and calculate total
      const { data: pointsData } = await supabase
        .from('member_points')
        .select('points')
        .eq('user_id', member.id);

      const totalPoints = pointsData?.reduce((sum, point) => sum + (point.points || 0), 0) || 0;

      // Fetch events attended count
      const { count: eventsCount } = await supabase
        .from('event_attendance')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', member.id);

      // Fetch blog posts count
      const { count: blogsCount } = await supabase
        .from('blogs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', member.id)
        .eq('status', 'published');

      // Fetch certificates count
      const { count: certificatesCount } = await supabase
        .from('certificates')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', member.id);

      // Fetch communities count
      const { count: communitiesCount } = await supabase
        .from('community_memberships')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', member.id)
        .eq('status', 'active');

      // Fetch user ranking
      const { data: rankingData } = await supabase
        .rpc('calculate_member_ranking');

      const userRank = rankingData?.find((r: any) => r.user_id === member.id)?.rank || 0;

      // Fetch recent activities (from member_points with descriptions)
      const { data: activitiesData } = await supabase
        .from('member_points')
        .select('*')
        .eq('user_id', member.id)
        .order('earned_at', { ascending: false })
        .limit(4);

      const activities = activitiesData?.map(activity => ({
        id: activity.id,
        title: activity.description || 'Activity completed',
        time: new Date(activity.earned_at).toLocaleString(),
        type: activity.activity_type || 'general',
        points: activity.points
      })) || [];

      // Fetch upcoming events
      const { data: eventsData } = await supabase
        .from('events')
        .select('*')
        .gte('date', new Date().toISOString())
        .order('date', { ascending: true })
        .limit(3);

      const events = eventsData?.map(event => ({
        id: event.id,
        title: event.title,
        date: new Date(event.date).toLocaleDateString(),
        time: new Date(event.date).toLocaleTimeString(),
        status: 'available'
      })) || [];

      setStats({
        totalPoints,
        eventsAttended: eventsCount || 0,
        blogPosts: blogsCount || 0,
        certificates: certificatesCount || 0,
        communities: communitiesCount || 0,
        rank: userRank
      });

      setRecentActivities(activities);
      setUpcomingEvents(events);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading dashboard...</div>;
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Welcome Header */}
      <motion.div variants={item} className="bg-gradient-to-r from-kic-green-500 to-kic-green-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {member?.email?.split('@')[0] || 'Member'}!
            </h1>
            <p className="text-kic-green-100 text-lg">
              Ready to continue your innovation journey today?
            </p>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.totalPoints.toLocaleString()}</div>
              <div className="text-sm text-kic-green-100">Total Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">#{stats.rank || 'N/A'}</div>
              <div className="text-sm text-kic-green-100">Leaderboard</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Events Attended",
            value: stats.eventsAttended.toString(),
            change: "Active participation",
            icon: Calendar,
            color: "text-blue-600",
            bgColor: "bg-blue-50"
          },
          {
            title: "Blog Posts",
            value: stats.blogPosts.toString(),
            change: "Published content",
            icon: FileText,
            color: "text-green-600",
            bgColor: "bg-green-50"
          },
          {
            title: "Certificates",
            value: stats.certificates.toString(),
            change: "Achievements earned",
            icon: Award,
            color: "text-yellow-600",
            bgColor: "bg-yellow-50"
          },
          {
            title: "Communities",
            value: stats.communities.toString(),
            change: "Active member",
            icon: Users,
            color: "text-purple-600",
            bgColor: "bg-purple-50"
          }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
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
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <motion.div variants={item} className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>Your latest achievements and participation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={activity.id || index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{activity.title}</h4>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                    <Badge variant="secondary" className="bg-kic-green-100 text-kic-green-700">
                      +{activity.points} points
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Upcoming Events */}
        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Events
              </CardTitle>
              <CardDescription>Don't miss these opportunities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <div key={event.id || index} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{event.title}</h4>
                      <Badge 
                        variant={event.status === 'registered' ? 'default' : 'outline'}
                        className="text-xs"
                      >
                        {event.status === 'registered' ? 'Registered' : 
                         event.status === 'deadline-soon' ? 'Deadline Soon' : 'Available'}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500">{event.date} • {event.time}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Progress Overview */}
      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Monthly Progress
            </CardTitle>
            <CardDescription>Track your journey and achievements this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Events Goal</span>
                  <span>8/10</span>
                </div>
                <Progress value={80} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Blog Posts</span>
                  <span>3/5</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Learning Hours</span>
                  <span>12/20</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default ModernUserDashboard;
