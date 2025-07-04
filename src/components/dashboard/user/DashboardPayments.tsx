
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Receipt, AlertCircle } from 'lucide-react';

interface Payment {
  id: string;
  amount: number;
  purpose: string;
  status: string;
  created_at: string;
  phone_number?: string;
}

const DashboardPayments: React.FC = () => {
  const { member } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (member) {
      fetchPayments();
    }
  }, [member]);

  const fetchPayments = async () => {
    if (!member) return;

    try {
      const { data, error } = await supabase
        .from('mpesa_payments')
        .select('*')
        .eq('user_id', member.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPayments(data || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading payments...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Payment History</h3>
          <p className="text-muted-foreground">Track your payments and dues</p>
        </div>
        <Button>
          <CreditCard className="w-4 h-4 mr-2" />
          Make Payment
        </Button>
      </div>

      <div className="grid gap-6">
        {payments.map((payment) => (
          <Card key={payment.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Receipt className="w-5 h-5" />
                    KES {payment.amount}
                  </CardTitle>
                  <CardDescription>
                    {payment.purpose} • {new Date(payment.created_at).toLocaleDateString()}
                  </CardDescription>
                </div>
                <Badge variant={
                  payment.status === 'completed' ? 'default' :
                  payment.status === 'failed' ? 'destructive' : 'secondary'
                }>
                  {payment.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {payment.phone_number && (
                <p className="text-sm text-muted-foreground">
                  Phone: {payment.phone_number}
                </p>
              )}
            </CardContent>
          </Card>
        ))}

        {payments.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Receipt className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                No payment history found
              </p>
              <Button>
                <CreditCard className="w-4 h-4 mr-2" />
                Make Your First Payment
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <AlertCircle className="w-5 h-5" />
            Payment Reminder
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-orange-700 text-sm">
            Don't forget to pay your semester subscription to maintain your membership status.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPayments;
