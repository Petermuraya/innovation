
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

const DashboardStats = ({ notifications, projects, certificates, upcomingEvents }: DashboardStatsProps) => {
  const { user } = useAuth();
  const [userRanking, setUserRanking] = useState<{ rank: number; total_points: number } | null>(null);
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
      const { data, error } = await supabase
        .rpc('calculate_detailed_member_ranking');

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
      setPaymentStatus(prev => ({ ...prev, loading: false }));
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6">
      <Card>
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center space-x-2">
            <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-kic-green-500 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-kic-gray/70 truncate">Notifications</p>
              <p className="text-lg sm:text-xl font-bold text-kic-gray">{notifications.filter(n => !n.is_read).length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center space-x-2">
            <GitBranch className="h-4 w-4 sm:h-5 sm:w-5 text-kic-green-500 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-kic-gray/70 truncate">Projects</p>
              <p className="text-lg sm:text-xl font-bold text-kic-gray">{projects.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-kic-green-500 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-kic-gray/70 truncate">Certificates</p>
              <p className="text-lg sm:text-xl font-bold text-kic-gray">{certificates.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-kic-green-500 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-kic-gray/70 truncate">Upcoming Events</p>
              <p className="text-lg sm:text-xl font-bold text-kic-gray">{upcomingEvents.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {userRanking && (
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center space-x-2">
              <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-kic-gray/70 truncate">My Rank</p>
                <p className="text-lg sm:text-xl font-bold text-kic-gray">#{userRanking.rank}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center space-x-2">
            <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-kic-green-500 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-kic-gray/70 truncate">Payment Status</p>
              <div className="flex space-x-1">
                <span className={`text-xs px-1 py-0.5 rounded ${paymentStatus.registration ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  Reg
                </span>
                <span className={`text-xs px-1 py-0.5 rounded ${paymentStatus.subscription ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  Sub
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
