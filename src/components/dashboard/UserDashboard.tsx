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

// Define types for better type safety
interface MemberData {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  course?: string;
  bio?: string;
  registration_status: string;
  avatar_url?: string;
  [key: string]: any;
}

interface UserStats {
  totalProjects: number;
  eventsAttended: number;
  certificatesEarned: number;
  totalPoints: number;
}

const UserDashboard = () => {
  const { user } = useAuth();
  const [memberData, setMemberData] = useState<MemberData | null>(null);
  const [stats, setStats] = useState<UserStats>({
    totalProjects: 0,
    eventsAttended: 0,
    certificatesEarned: 0,
    totalPoints: 0,
  });
  const [notifications, setNotifications] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchMemberData();
      fetchUserStats();
      fetchUserData();
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

      const totalPoints = pointsData?.reduce((sum, point) => sum + (point.points || 0), 0) || 0;

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

  const fetchUserData = async () => {
    if (!user) return;

    try {
      // Fetch notifications
      const { data: notificationsData } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      setNotifications(notificationsData || []);

      // Fetch projects
      const { data: projectsData } = await supabase
        .from('project_submissions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setProjects(projectsData || []);

      // Fetch certificates
      const { data: certificatesData } = await supabase
        .from('certificates')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setCertificates(certificatesData || []);

      // Fetch upcoming events
      const { data: eventsData } = await supabase
        .from('events')
        .select('*')
        .gte('date', new Date().toISOString())
        .order('date', { ascending: true })
        .limit(5);

      setUpcomingEvents(eventsData || []);

      // Fetch payments
      const { data: paymentsData } = await supabase
        .from('mpesa_payments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setPayments(paymentsData || []);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleDataUpdate = () => {
    fetchMemberData();
    fetchUserStats();
    fetchUserData();
  };

  return (
    <div className="container mx-auto p-4 sm:p-6">
      {memberData && <DashboardHeader user={memberData} memberData={memberData} />}
      <DashboardStats 
        notifications={notifications}
        projects={projects}
        certificates={certificates}
        upcomingEvents={upcomingEvents}
      />

      <Tabs defaultValue="overview" className="space-y-4">
        <div className="overflow-x-auto">
          <TabsList className="grid w-full grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-1 h-auto p-1">
            <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
            <TabsTrigger value="profile" className="text-xs sm:text-sm">Profile</TabsTrigger>
            <TabsTrigger value="projects" className="text-xs sm:text-sm">Projects</TabsTrigger>
            <TabsTrigger value="events" className="text-xs sm:text-sm">Events</TabsTrigger>
            <TabsTrigger value="careers" className="text-xs sm:text-sm">Careers</TabsTrigger>
            <TabsTrigger value="blogging" className="text-xs sm:text-sm">Blogging</TabsTrigger>
            <TabsTrigger value="payments" className="text-xs sm:text-sm">Payments</TabsTrigger>
            <TabsTrigger value="certificates" className="text-xs sm:text-sm">Certificates</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview">
          <DashboardOverview 
            notifications={notifications}
            upcomingEvents={upcomingEvents}
          />
        </TabsContent>

        <TabsContent value="profile">
          {memberData && (
            <DashboardProfile memberData={memberData} />
          )}
        </TabsContent>

        <TabsContent value="projects">
          <EnhancedDashboardProjects 
            projects={projects} 
            onSuccess={handleDataUpdate} 
          />
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
          <DashboardPayments payments={payments} />
        </TabsContent>

        <TabsContent value="certificates">
          <div className="grid gap-6">
            <DashboardCertificates certificates={certificates} />
            <DashboardBadges />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserDashboard;
