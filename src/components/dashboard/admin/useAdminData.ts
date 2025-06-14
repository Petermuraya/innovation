
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { AdminStats } from './types/adminData';
import { useAdminActions } from './hooks/useAdminActions';
import { calculateStats } from './utils/statsCalculator';
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
  const { updateMemberStatus, updateProjectStatus } = useAdminActions();
  
  const [stats, setStats] = useState<AdminStats>({
    totalMembers: 0,
    pendingMembers: 0,
    totalProjects: 0,
    pendingProjects: 0,
    totalEvents: 0,
    totalPayments: 0,
    totalCertificates: 0,
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
      const [
        membersData,
        projectsData,
        eventsData,
        paymentsData,
        certificatesData,
        adminRequestsData
      ] = await Promise.all([
        fetchAllMembers(),
        fetchAllProjects(),
        fetchAllEvents(),
        fetchAllPayments(),
        fetchAllCertificates(),
        fetchAllAdminRequests()
      ]);

      setMembers(membersData);
      setProjects(projectsData);
      setEvents(eventsData);
      setPayments(paymentsData);

      const calculatedStats = calculateStats(
        membersData,
        projectsData,
        eventsData,
        paymentsData,
        certificatesData,
        adminRequestsData
      );

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
