import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Clock, AlertCircle, Loader2, CreditCard } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  Badge,
  Skeleton
} from '@/components/ui';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';

const PaymentStatus = () => {
  const { user } = useAuth();
  const [recentPayments, setRecentPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchRecentPayments();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchRecentPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('mpesa_payments')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setRecentPayments(data || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
      setError('Failed to load payment history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPaymentStatus = (payment: any) => {
    switch (payment.status) {
      case 'completed':
        return {
          color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
          icon: <CheckCircle2 className="h-4 w-4" />,
          label: 'Completed'
        };
      case 'failed':
        return {
          color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
          icon: <AlertCircle className="h-4 w-4" />,
          label: 'Failed'
        };
      case 'pending':
        return {
          color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
          icon: <Clock className="h-4 w-4" />,
          label: 'Pending'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400',
          icon: <Loader2 className="h-4 w-4 animate-spin" />,
          label: 'Processing'
        };
    }
  };

  const getPaymentIcon = (paymentType: string) => {
    switch (paymentType.toLowerCase()) {
      case 'membership':
        return <CreditCard className="h-5 w-5 text-blue-500" />;
      case 'event':
        return <Calendar className="h-5 w-5 text-purple-500" />;
      default:
        return <CreditCard className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <Card className="border-none shadow-sm rounded-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-b">
        <CardTitle className="flex items-center gap-3">
          <CreditCard className="h-6 w-6 text-blue-600" />
          <span className="text-lg font-semibold">Payment History</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        {error ? (
          <div className="p-6 text-center text-red-500">
            <p>{error}</p>
            <Button 
              variant="ghost" 
              className="mt-2 text-blue-600 dark:text-blue-400"
              onClick={fetchRecentPayments}
            >
              Retry
            </Button>
          </div>
        ) : loading ? (
          <div className="space-y-4 p-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3 w-full">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-[100px]" />
                    <Skeleton className="h-3 w-[80px]" />
                  </div>
                </div>
                <Skeleton className="h-6 w-[80px]" />
              </div>
            ))}
          </div>
        ) : recentPayments.length === 0 ? (
          <div className="p-6 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 mb-3">
              <CreditCard className="h-5 w-5 text-gray-400" />
            </div>
            <h4 className="font-medium text-gray-700 dark:text-gray-300">No recent payments</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Your payment history will appear here
            </p>
          </div>
        ) : (
          <motion.ul className="divide-y divide-gray-100 dark:divide-gray-800">
            <AnimatePresence>
              {recentPayments.map((payment) => {
                const status = getPaymentStatus(payment);
                return (
                  <motion.li
                    key={payment.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors"
                  >
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800">
                          {getPaymentIcon(payment.payment_type)}
                        </div>
                        <div>
                          <h4 className="font-medium flex items-center gap-1">
                            KSh {payment.amount}
                            <span className="text-xs font-normal text-gray-500 dark:text-gray-400">
                              • {payment.payment_type}
                            </span>
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {format(new Date(payment.created_at), 'MMM d, yyyy • h:mm a')}
                          </p>
                        </div>
                      </div>
                      
                      <Badge 
                        className={`${status.color} px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1`}
                      >
                        {status.icon}
                        {status.label}
                      </Badge>
                    </div>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </motion.ul>
        )}
      </CardContent>
      
      {recentPayments.length > 0 && (
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 text-center">
          <Button 
            variant="ghost" 
            className="text-blue-600 dark:text-blue-400"
            onClick={fetchRecentPayments}
          >
            Refresh Payment History
          </Button>
        </div>
      )}
    </Card>
  );
};

export default PaymentStatus;