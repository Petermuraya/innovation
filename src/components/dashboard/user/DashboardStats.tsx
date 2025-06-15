import { Card, CardContent } from '@/components/ui/card';
import { Bell, Calendar, FileText, GitBranch, Trophy, CreditCard } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
interface DashboardStatsProps {
  notifications: any[];
  projects: any[];
  certificates: any[];
  upcomingEvents: any[];
}
const DashboardStats = ({
  notifications,
  projects,
  certificates,
  upcomingEvents
}: DashboardStatsProps) => {
  const {
    user
  } = useAuth();
  const [userRanking, setUserRanking] = useState<{
    rank: number;
    total_points: number;
  } | null>(null);
  const [paymentStatus, setPaymentStatus] = useState({
    registration: false,
    subscription: false,
    loading: true
  });
  useEffect(() => {
    if (user) {
      fetchUserRanking();
      fetchPaymentStatus();
    }
  }, [user]);
  const fetchUserRanking = async () => {
    if (!user) return;
    try {
      const {
        data,
        error
      } = await supabase.rpc('calculate_detailed_member_ranking');
      if (error) throw error;
      const userRank = data?.find((member: any) => member.user_id === user.id);
      if (userRank) {
        setUserRanking({
          rank: userRank.rank,
          total_points: userRank.total_points
        });
      }
    } catch (error) {
      console.error('Error fetching user ranking:', error);
    }
  };
  const fetchPaymentStatus = async () => {
    if (!user) return;
    try {
      // Check for completed payments
      const {
        data: payments,
        error
      } = await supabase.from('mpesa_payments').select('payment_type, status').eq('user_id', user.id).eq('status', 'completed');
      if (error) throw error;
      const registrationPaid = payments?.some(p => p.payment_type === 'membership' || p.payment_type === 'registration') || false;
      const subscriptionPaid = payments?.some(p => p.payment_type === 'subscription') || false;
      setPaymentStatus({
        registration: registrationPaid,
        subscription: subscriptionPaid,
        loading: false
      });
    } catch (error) {
      console.error('Error fetching payment status:', error);
      setPaymentStatus(prev => ({
        ...prev,
        loading: false
      }));
    }
  };
  return;
};
export default DashboardStats;