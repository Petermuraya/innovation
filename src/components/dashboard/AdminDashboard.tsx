import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import CertificateManager from '@/components/certificates/CertificateManager';
import AdminDashboardHeader from './admin/AdminDashboardHeader';
import AdminDashboardStats from './admin/AdminDashboardStats';
import MembersManagement from './admin/MembersManagement';
import EventsManagement from './admin/EventsManagement';
import ProjectsManagement from './admin/ProjectsManagement';
import PaymentsManagement from './admin/PaymentsManagement';
import AdminRequestsManagement from '@/components/admin/AdminRequestsManagement';

const AdminDashboard = () => {
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalMembers: 0,
    pendingMembers: 0,
    totalEvents: 0,
    pendingProjects: 0,
    totalPayments: 0,
    totalCertificates: 0,
    pendingAdminRequests: 0
  });

  const [members, setMembers] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      // Fetch members
      const { data: membersData } = await supabase
        .from('members')
        .select('*')
        .order('created_at', { ascending: false });
      setMembers(membersData || []);

      // Fetch events
      const { data: eventsData } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });
      setEvents(eventsData || []);

      // Fetch project submissions
      const { data: projectsData } = await supabase
        .from('project_submissions')
        .select('*, members(name)')
        .order('created_at', { ascending: false });
      setProjects(projectsData || []);

      // Fetch payments
      const { data: paymentsData } = await supabase
        .from('mpesa_payments')
        .select('*, members(name)')
        .order('created_at', { ascending: false });
      setPayments(paymentsData || []);

      // Fetch certificates count
      const { data: certificatesData } = await supabase
        .from('certificates')
        .select('id');

      // Fetch admin requests count
      const { data: adminRequestsData } = await supabase
        .from('admin_requests')
        .select('id, status')
        .eq('status', 'pending');

      // Calculate stats
      setStats({
        totalMembers: membersData?.length || 0,
        pendingMembers: membersData?.filter(m => m.registration_status === 'pending').length || 0,
        totalEvents: eventsData?.length || 0,
        pendingProjects: projectsData?.filter(p => p.status === 'pending').length || 0,
        totalPayments: paymentsData?.length || 0,
        totalCertificates: certificatesData?.length || 0,
        pendingAdminRequests: adminRequestsData?.length || 0
      });
    } catch (error) {
      console.error('Error fetching admin data:', error);
    }
  };

  const updateMemberStatus = async (memberId: string, status: string) => {
    try {
      await supabase
        .from('members')
        .update({ registration_status: status })
        .eq('id', memberId);
      
      toast({
        title: "Member status updated",
        description: `Registration ${status} successfully.`,
      });
      
      fetchAdminData(); // Refresh data
    } catch (error) {
      console.error('Error updating member status:', error);
      toast({
        title: "Error",
        description: "Failed to update member status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateProjectStatus = async (projectId: string, status: string) => {
    try {
      await supabase
        .from('project_submissions')
        .update({ status })
        .eq('id', projectId);
      
      fetchAdminData(); // Refresh data
    } catch (error) {
      console.error('Error updating project status:', error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <AdminDashboardHeader />
      <AdminDashboardStats stats={stats} />

      <Tabs defaultValue="members" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
          <TabsTrigger value="admin-requests">
            Admin Requests
            {stats.pendingAdminRequests > 0 && (
              <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-1">
                {stats.pendingAdminRequests}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members">
          <MembersManagement 
            members={members} 
            updateMemberStatus={updateMemberStatus} 
          />
        </TabsContent>

        <TabsContent value="events">
          <EventsManagement events={events} />
        </TabsContent>

        <TabsContent value="projects">
          <ProjectsManagement 
            projects={projects} 
            updateProjectStatus={updateProjectStatus} 
          />
        </TabsContent>

        <TabsContent value="payments">
          <PaymentsManagement payments={payments} />
        </TabsContent>

        <TabsContent value="certificates">
          <CertificateManager />
        </TabsContent>

        <TabsContent value="admin-requests">
          <AdminRequestsManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
