
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardHeader from './user/DashboardHeader';
import DashboardStats from './user/DashboardStats';
import DashboardOverview from './user/DashboardOverview';
import EnhancedDashboardProjects from './user/EnhancedDashboardProjects';
import DashboardEvents from './user/DashboardEvents';
import DashboardCertificates from './user/DashboardCertificates';
import DashboardPayments from './user/DashboardPayments';
import DashboardProfile from './user/DashboardProfile';
import DashboardBadges from './user/DashboardBadges';
import DashboardBlogging from './user/DashboardBlogging';

const UserDashboard = () => {
  const { user } = useAuth();
  const [memberData, setMemberData] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      // Fetch member data with profile information
      const { data: member } = await supabase
        .from('members')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      // Fetch profile data
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      // Merge member and profile data
      setMemberData({
        ...member,
        ...profile,
      });

      // Fetch notifications
      const { data: notifs } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(10);
      setNotifications(notifs || []);

      // Fetch certificates
      const { data: certs } = await supabase
        .from('certificates')
        .select('*, events(title)')
        .eq('user_id', user?.id);
      setCertificates(certs || []);

      // Fetch project submissions
      const { data: projectSubmissions } = await supabase
        .from('project_submissions')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
      setProjects(projectSubmissions || []);

      // Fetch payment history
      const { data: paymentHistory } = await supabase
        .from('mpesa_payments')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
      setPayments(paymentHistory || []);

      // Fetch upcoming events
      const { data: events } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'published')
        .gte('date', new Date().toISOString())
        .order('date', { ascending: true })
        .limit(5);
      setUpcomingEvents(events || []);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <DashboardHeader memberData={memberData} user={user} />
      
      <DashboardStats 
        notifications={notifications} 
        projects={projects} 
        certificates={certificates} 
        upcomingEvents={upcomingEvents} 
      />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="blogs">Blogs</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <DashboardOverview notifications={notifications} upcomingEvents={upcomingEvents} />
        </TabsContent>

        <TabsContent value="projects">
          <EnhancedDashboardProjects projects={projects} onSuccess={fetchUserData} />
        </TabsContent>

        <TabsContent value="blogs">
          <DashboardBlogging />
        </TabsContent>

        <TabsContent value="events">
          <DashboardEvents upcomingEvents={upcomingEvents} />
        </TabsContent>

        <TabsContent value="certificates">
          <DashboardCertificates certificates={certificates} />
        </TabsContent>

        <TabsContent value="badges">
          <DashboardBadges />
        </TabsContent>

        <TabsContent value="payments">
          <DashboardPayments payments={payments} />
        </TabsContent>

        <TabsContent value="profile">
          <DashboardProfile memberData={memberData} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserDashboard;
