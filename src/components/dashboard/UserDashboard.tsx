
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import DashboardHeader from './user/DashboardHeader';
import DashboardStats from './user/DashboardStats';
import DashboardOverview from './user/DashboardOverview';
import DashboardProfile from './user/DashboardProfile';
import EnhancedDashboardProjects from './user/EnhancedDashboardProjects';
import DashboardEvents from './user/DashboardEvents';
import DashboardCareers from './user/DashboardCareers';
import DashboardBlogging from './user/DashboardBlogging';
import DashboardPayments from './user/DashboardPayments';
import DashboardCertificates from './user/DashboardCertificates';
import DashboardBadges from './user/DashboardBadges';

const UserDashboard = () => {
  const { user } = useAuth();
  const [memberData, setMemberData] = useState<any>(null);
  const [stats, setStats] = useState({
    totalProjects: 0,
    eventsAttended: 0,
    certificatesEarned: 0,
    totalPoints: 0,
  });

  useEffect(() => {
    if (user) {
      fetchMemberData();
      fetchUserStats();
    }
  }, [user]);

  const fetchMemberData = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching member data:', error);
        return;
      }

      setMemberData(data);
    } catch (error) {
      console.error('Error fetching member data:', error);
    }
  };

  const fetchUserStats = async () => {
    if (!user) return;

    try {
      // Fetch project count
      const { count: projectCount } = await supabase
        .from('project_submissions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Fetch events attended
      const { count: eventsCount } = await supabase
        .from('event_attendance')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Fetch certificates
      const { count: certificatesCount } = await supabase
        .from('certificates')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Fetch total points
      const { data: pointsData } = await supabase
        .from('member_points')
        .select('points')
        .eq('user_id', user.id);

      const totalPoints = pointsData?.reduce((sum, point) => sum + point.points, 0) || 0;

      setStats({
        totalProjects: projectCount || 0,
        eventsAttended: eventsCount || 0,
        certificatesEarned: certificatesCount || 0,
        totalPoints,
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <DashboardHeader memberData={memberData} />
      <DashboardStats stats={stats} />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="careers">Careers</TabsTrigger>
          <TabsTrigger value="blogging">Blogging</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <DashboardOverview stats={stats} />
        </TabsContent>

        <TabsContent value="profile">
          <DashboardProfile memberData={memberData} onUpdate={fetchMemberData} />
        </TabsContent>

        <TabsContent value="projects">
          <EnhancedDashboardProjects />
        </TabsContent>

        <TabsContent value="events">
          <DashboardEvents />
        </TabsContent>

        <TabsContent value="careers">
          <DashboardCareers />
        </TabsContent>

        <TabsContent value="blogging">
          <DashboardBlogging />
        </TabsContent>

        <TabsContent value="payments">
          <DashboardPayments />
        </TabsContent>

        <TabsContent value="certificates">
          <div className="grid gap-6">
            <DashboardCertificates />
            <DashboardBadges />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserDashboard;
