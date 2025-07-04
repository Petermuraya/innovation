
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Award, Calendar, Code, TrendingUp } from 'lucide-react';

interface Stats {
  totalPoints: number;
  projectsSubmitted: number;
  eventsAttended: number;
  certificatesEarned: number;
  dailyVisits: number;
}

const DashboardStats: React.FC = () => {
  const { member } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalPoints: 0,
    projectsSubmitted: 0,
    eventsAttended: 0,
    certificatesEarned: 0,
    dailyVisits: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (member) {
      fetchStats();
    }
  }, [member]);

  const fetchStats = async () => {
    if (!member) return;

    try {
      // Fetch total points
      const { data: pointsData } = await supabase
        .from('member_points')
        .select('points')
        .eq('user_id', member.id);

      const totalPoints = pointsData?.reduce((sum, point) => sum + (point.points || 0), 0) || 0;

      // Fetch project submissions count
      const { count: projectsCount } = await supabase
        .from('project_submissions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', member.id);

      // Fetch events attended count
      const { count: eventsCount } = await supabase
        .from('event_attendance')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', member.id);

      // Fetch certificates count
      const { count: certificatesCount } = await supabase
        .from('certificates')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', member.id);

      // Fetch website visits count
      const { count: visitsCount } = await supabase
        .from('member_website_visits')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', member.id);

      setStats({
        totalPoints,
        projectsSubmitted: projectsCount || 0,
        eventsAttended: eventsCount || 0,
        certificatesEarned: certificatesCount || 0,
        dailyVisits: visitsCount || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading statistics...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Your Statistics</h3>
        <p className="text-muted-foreground">Track your progress and achievements</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Points</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-kic-green-600">{stats.totalPoints}</div>
            <p className="text-xs text-muted-foreground">
              Earned through activities
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projects Submitted</CardTitle>
            <Code className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-kic-green-600">{stats.projectsSubmitted}</div>
            <p className="text-xs text-muted-foreground">
              Showcase your work
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Events Attended</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-kic-green-600">{stats.eventsAttended}</div>
            <p className="text-xs text-muted-foreground">
              Active participation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certificates Earned</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-kic-green-600">{stats.certificatesEarned}</div>
            <p className="text-xs text-muted-foreground">
              Skills and achievements
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Visits</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-kic-green-600">{stats.dailyVisits}</div>
            <p className="text-xs text-muted-foreground">
              Platform engagement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-kic-green-600">+12%</div>
            <p className="text-xs text-muted-foreground">
              This month vs last month
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardStats;
