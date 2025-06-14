
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface AdminStats {
  totalMembers: number;
  pendingMembers: number;
  totalProjects: number;
  pendingProjects: number;
  totalEvents: number;
  totalPayments: number;
  pendingAdminRequests: number;
}

export const useAdminData = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<AdminStats>({
    totalMembers: 0,
    pendingMembers: 0,
    totalProjects: 0,
    pendingProjects: 0,
    totalEvents: 0,
    totalPayments: 0,
    pendingAdminRequests: 0
  });
  const [members, setMembers] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAdminData();
    }
  }, [user]);

  const fetchAdminData = async () => {
    console.log('Fetching admin data...');
    setLoading(true);
    try {
      // Fetch members - removing the approved filter to see all members
      console.log('Fetching members...');
      const { data: membersData, error: membersError } = await supabase
        .from('members')
        .select('*')
        .order('created_at', { ascending: false });

      if (membersError) {
        console.error('Error fetching members:', membersError);
      } else {
        console.log('Members fetched:', membersData?.length || 0, 'members');
        setMembers(membersData || []);
      }

      // Fetch projects
      console.log('Fetching projects...');
      const { data: projectsData, error: projectsError } = await supabase
        .from('project_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (projectsError) {
        console.error('Error fetching projects:', projectsError);
      } else {
        console.log('Projects fetched:', projectsData?.length || 0, 'projects');
        setProjects(projectsData || []);
      }

      // Fetch events
      console.log('Fetching events...');
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (eventsError) {
        console.error('Error fetching events:', eventsError);
      } else {
        console.log('Events fetched:', eventsData?.length || 0, 'events');
        setEvents(eventsData || []);
      }

      // Fetch payments
      console.log('Fetching payments...');
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('mpesa_payments')
        .select('*')
        .order('created_at', { ascending: false });

      if (paymentsError) {
        console.error('Error fetching payments:', paymentsError);
      } else {
        console.log('Payments fetched:', paymentsData?.length || 0, 'payments');
        setPayments(paymentsData || []);
      }

      // Fetch admin requests
      console.log('Fetching admin requests...');
      const { data: adminRequestsData, error: adminRequestsError } = await supabase
        .from('admin_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (adminRequestsError) {
        console.error('Error fetching admin requests:', adminRequestsError);
      }

      // Calculate stats
      const calculatedStats = {
        totalMembers: membersData?.length || 0,
        pendingMembers: membersData?.filter(m => m.registration_status === 'pending').length || 0,
        totalProjects: projectsData?.length || 0,
        pendingProjects: projectsData?.filter(p => p.status === 'pending').length || 0,
        totalEvents: eventsData?.length || 0,
        totalPayments: paymentsData?.length || 0,
        pendingAdminRequests: adminRequestsData?.filter(r => r.status === 'pending').length || 0
      };

      console.log('Calculated stats:', calculatedStats);
      setStats(calculatedStats);

    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast({
        title: "Error",
        description: "Failed to load admin data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateMemberStatus = async (memberId: string, status: string) => {
    console.log('Updating member status:', memberId, status);
    try {
      const { error } = await supabase
        .from('members')
        .update({ 
          registration_status: status,
          updated_at: new Date().toISOString()
        })
        .eq('id', memberId);

      if (error) throw error;

      // Refresh data after update
      await fetchAdminData();
      
      toast({
        title: "Success",
        description: `Member status updated to ${status}`,
      });
    } catch (error) {
      console.error('Error updating member status:', error);
      toast({
        title: "Error",
        description: "Failed to update member status",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateProjectStatus = async (projectId: string, status: string, feedback?: string) => {
    console.log('Updating project status:', projectId, status);
    try {
      const updateData: any = {
        status,
        reviewed_by: user?.id,
        reviewed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (feedback?.trim()) {
        updateData.admin_feedback = feedback.trim();
      }

      const { error } = await supabase
        .from('project_submissions')
        .update(updateData)
        .eq('id', projectId);

      if (error) throw error;

      // Refresh data after update
      await fetchAdminData();
      
      toast({
        title: "Success",
        description: `Project ${status} successfully`,
      });
    } catch (error) {
      console.error('Error updating project status:', error);
      toast({
        title: "Error",
        description: "Failed to update project status",
        variant: "destructive"
      });
      throw error;
    }
  };

  return {
    stats,
    members,
    events,
    projects,
    payments,
    loading,
    updateMemberStatus,
    updateProjectStatus,
    refreshData: fetchAdminData
  };
};
