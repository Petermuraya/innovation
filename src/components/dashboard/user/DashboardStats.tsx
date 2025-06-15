
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
  const { user } = useAuth();
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
      const { data, error } = await supabase.rpc('calculate_detailed_member_ranking');
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
      const { data: payments, error } = await supabase
        .from('mpesa_payments')
        .select('payment_type, status')
        .eq('user_id', user.id)
        .eq('status', 'completed');

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Notifications</p>
              <p className="text-3xl font-bold">{notifications.length}</p>
            </div>
            <Bell className="h-8 w-8 text-blue-200" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Projects</p>
              <p className="text-3xl font-bold">{projects.length}</p>
            </div>
            <GitBranch className="h-8 w-8 text-green-200" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Certificates</p>
              <p className="text-3xl font-bold">{certificates.length}</p>
            </div>
            <Trophy className="h-8 w-8 text-purple-200" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Upcoming Events</p>
              <p className="text-3xl font-bold">{upcomingEvents.length}</p>
            </div>
            <Calendar className="h-8 w-8 text-orange-200" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
