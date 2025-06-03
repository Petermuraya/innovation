
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAdminData = () => {
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
        pendingMembers: membersData?.filter((m: any) => m.registration_status === 'pending').length || 0,
        totalEvents: eventsData?.length || 0,
        pendingProjects: projectsData?.filter((p: any) => p.status === 'pending').length || 0,
        totalPayments: paymentsData?.length || 0,
        totalCertificates: certificatesData?.length || 0,
        pendingAdminRequests: adminRequestsData?.length || 0
      });
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
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
      
      fetchAdminData();
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
      
      toast({
        title: "Project status updated",
        description: `Project ${status} successfully.`,
      });
      
      fetchAdminData();
    } catch (error) {
      console.error('Error updating project status:', error);
      toast({
        title: "Error",
        description: "Failed to update project status. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  return {
    stats,
    members,
    events,
    projects,
    payments,
    updateMemberStatus,
    updateProjectStatus,
    refetchData: fetchAdminData,
  };
};
