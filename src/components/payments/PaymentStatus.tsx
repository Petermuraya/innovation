
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const PaymentStatus = () => {
  const { user } = useAuth();
  const [recentPayments, setRecentPayments] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchRecentPayments();
    }
  }, [user]);

  const fetchRecentPayments = async () => {
    try {
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
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'failed':
        return 'destructive';
      case 'pending':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Payments</CardTitle>
      </CardHeader>
      <CardContent>
        {recentPayments.length === 0 ? (
          <p className="text-gray-500">No recent payments</p>
        ) : (
          <div className="space-y-3">
            {recentPayments.map((payment) => (
              <div key={payment.id} className="flex justify-between items-center p-3 border rounded">
                <div>
                  <p className="font-medium">KSh {payment.amount}</p>
                  <p className="text-sm text-gray-500">{payment.payment_type}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(payment.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant={getStatusColor(payment.status)}>
                  {payment.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentStatus;
