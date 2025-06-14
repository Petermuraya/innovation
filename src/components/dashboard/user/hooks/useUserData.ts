
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useUserData = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);

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

      // Fetch payments with real-time subscription
      const { data: paymentsData } = await supabase
        .from('mpesa_payments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setPayments(paymentsData || []);

      // Set up real-time subscription for payment updates
      const paymentSubscription = supabase
        .channel('payment-updates')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'mpesa_payments',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            console.log('Payment update received:', payload);
            // Refresh payments data
            fetchUserData();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(paymentSubscription);
      };
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  return {
    notifications,
    projects,
    certificates,
    upcomingEvents,
    payments,
    refetchUserData: fetchUserData,
  };
};
