
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  fetchAllMembers,
  fetchAllProjects,
  fetchAllEvents,
  fetchAllPayments,
  fetchAllCertificates,
  fetchAllAdminRequests
} from './services/adminDataService';

export const useAdminData = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [events, setEvents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [adminRequests, setAdminRequests] = useState([]);

  const fetchAdminData = async () => {
    if (!user) return;

    try {
      console.log('Fetching admin data...');
      setLoading(true);

      // Fetch all data with proper error handling
      const [
        membersData,
        projectsData,
        eventsData,
        paymentsData,
        certificatesData,
        adminRequestsData
      ] = await Promise.allSettled([
        fetchAllMembers(),
        fetchAllProjects(),
        fetchAllEvents(),
        fetchAllPayments(),
        fetchAllCertificates(),
        fetchAllAdminRequests()
      ]);

      // Set data with fallbacks for failed promises
      setMembers(membersData.status === 'fulfilled' ? membersData.value : []);
      setProjects(projectsData.status === 'fulfilled' ? projectsData.value : []);
      setEvents(eventsData.status === 'fulfilled' ? eventsData.value : []);
      setPayments(paymentsData.status === 'fulfilled' ? paymentsData.value : []);
      setCertificates(certificatesData.status === 'fulfilled' ? certificatesData.value : []);
      setAdminRequests(adminRequestsData.status === 'fulfilled' ? adminRequestsData.value : []);

      // Log any failed fetches
      if (membersData.status === 'rejected') console.error('Members fetch failed:', membersData.reason);
      if (projectsData.status === 'rejected') console.error('Projects fetch failed:', projectsData.reason);
      if (eventsData.status === 'rejected') console.error('Events fetch failed:', eventsData.reason);
      if (paymentsData.status === 'rejected') console.error('Payments fetch failed:', paymentsData.reason);
      if (certificatesData.status === 'rejected') console.error('Certificates fetch failed:', certificatesData.reason);
      if (adminRequestsData.status === 'rejected') console.error('Admin requests fetch failed:', adminRequestsData.reason);

    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast({
        title: "Error",
        description: "Some admin data failed to load. Please refresh the page.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [user]);

  const stats = {
    totalMembers: members.length,
    pendingMembers: members.filter((m: any) => m.registration_status === 'pending').length,
    totalProjects: projects.length,
    pendingProjects: projects.filter((p: any) => p.status === 'pending').length,
    totalEvents: events.length,
    totalPayments: payments.length,
    totalCertificates: certificates.length,
    pendingAdminRequests: adminRequests.filter((r: any) => r.status === 'pending').length,
  };

  console.log('Calculated stats:', stats);

  const updateMemberStatus = async (memberId: string, status: string) => {
    try {
      // Implementation for updating member status
      await fetchAdminData(); // Refresh data after update
    } catch (error) {
      console.error('Error updating member status:', error);
      toast({
        title: "Error",
        description: "Failed to update member status",
        variant: "destructive",
      });
    }
  };

  const updateProjectStatus = async (projectId: string, status: string, feedback?: string) => {
    try {
      // Implementation for updating project status
      await fetchAdminData(); // Refresh data after update
    } catch (error) {
      console.error('Error updating project status:', error);
      toast({
        title: "Error",
        description: "Failed to update project status",
        variant: "destructive",
      });
    }
  };

  return {
    loading,
    stats,
    members,
    projects,
    events,
    payments,
    certificates,
    adminRequests,
    updateMemberStatus,
    updateProjectStatus,
    refetch: fetchAdminData
  };
};
