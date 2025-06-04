
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CreditCard, Smartphone, CheckCircle, XCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import PaymentForm from '@/components/payments/PaymentForm';

interface DashboardPaymentsProps {
  payments: any[];
}

const DashboardPayments = ({ payments }: DashboardPaymentsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [paymentStatus, setPaymentStatus] = useState({
    registration: false,
    subscription: false,
    loading: true
  });
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedPaymentType, setSelectedPaymentType] = useState<'membership' | 'subscription'>('membership');

  useEffect(() => {
    fetchPaymentStatus();
  }, [user]);

  const fetchPaymentStatus = async () => {
    if (!user) return;

    try {
      const { data: completedPayments, error } = await supabase
        .from('mpesa_payments')
        .select('payment_type, status')
        .eq('user_id', user.id)
        .eq('status', 'completed');

      if (error) throw error;

      const registrationPaid = completedPayments?.some(p => 
        p.payment_type === 'membership' || p.payment_type === 'registration'
      ) || false;
      
      const subscriptionPaid = completedPayments?.some(p => 
        p.payment_type === 'subscription'
      ) || false;

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

  const handlePaymentSuccess = () => {
    setShowPaymentForm(false);
    fetchPaymentStatus(); // Refresh payment status
    toast({
      title: "Payment Successful!",
      description: selectedPaymentType === 'membership' 
        ? "Your registration payment has been processed successfully" 
        : "Your subscription payment has been processed successfully",
    });
  };

  const initiatePayment = (type: 'membership' | 'subscription') => {
    setSelectedPaymentType(type);
    setShowPaymentForm(true);
  };

  if (showPaymentForm) {
    return (
      <div className="space-y-4">
        <Button 
          variant="outline" 
          onClick={() => setShowPaymentForm(false)}
          className="mb-4"
        >
          ← Back to Payments
        </Button>
        <PaymentForm
          amount={selectedPaymentType === 'membership' ? 100 : 100}
          paymentType={selectedPaymentType}
          onSuccess={handlePaymentSuccess}
          onError={(error) => toast({
            title: "Payment Error",
            description: error,
            variant: "destructive"
          })}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Payment Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Payment Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Registration Payment */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-kic-gray">Registration Fee</h3>
                <Badge variant={paymentStatus.registration ? 'default' : 'destructive'}>
                  {paymentStatus.registration ? (
                    <><CheckCircle className="w-3 h-3 mr-1" /> Paid</>
                  ) : (
                    <><XCircle className="w-3 h-3 mr-1" /> Unpaid</>
                  )}
                </Badge>
              </div>
              <p className="text-sm text-kic-gray/70 mb-3">
                One-time registration fee to join KIC community
              </p>
              <div className="flex items-center justify-between">
                <span className="font-bold text-lg">KSh 100</span>
                {!paymentStatus.registration && (
                  <Button 
                    size="sm" 
                    onClick={() => initiatePayment('membership')}
                    className="bg-kic-green-500 hover:bg-kic-green-600"
                  >
                    <Smartphone className="w-4 h-4 mr-2" />
                    Pay Now
                  </Button>
                )}
              </div>
            </div>

            {/* Subscription Payment */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-kic-gray">Semester Subscription</h3>
                <Badge variant={paymentStatus.subscription ? 'default' : 'destructive'}>
                  {paymentStatus.subscription ? (
                    <><CheckCircle className="w-3 h-3 mr-1" /> Active</>
                  ) : (
                    <><XCircle className="w-3 h-3 mr-1" /> Inactive</>
                  )}
                </Badge>
              </div>
              <p className="text-sm text-kic-gray/70 mb-3">
                Current semester access to premium features
              </p>
              <div className="flex items-center justify-between">
                <span className="font-bold text-lg">KSh 100</span>
                {!paymentStatus.subscription && (
                  <Button 
                    size="sm" 
                    onClick={() => initiatePayment('subscription')}
                    className="bg-kic-green-500 hover:bg-kic-green-600"
                  >
                    <Smartphone className="w-4 h-4 mr-2" />
                    Subscribe
                  </Button>
                )}
              </div>
            </div>
          </div>

          {!paymentStatus.registration && (
            <Alert className="mt-4 border-orange-200 bg-orange-50">
              <AlertDescription className="text-orange-800">
                Complete your registration payment to access all KIC features and events.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {payments.map((payment) => (
              <div key={payment.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-kic-gray">KSh {payment.amount}</h4>
                    <p className="text-sm text-kic-gray/70 capitalize">{payment.payment_type}</p>
                    <p className="text-sm text-kic-gray/70">{new Date(payment.created_at).toLocaleDateString()}</p>
                    {payment.mpesa_receipt_number && (
                      <p className="text-xs text-kic-gray/60">Receipt: {payment.mpesa_receipt_number}</p>
                    )}
                  </div>
                  <Badge variant={
                    payment.status === 'completed' ? 'default' : 
                    payment.status === 'failed' ? 'destructive' : 'secondary'
                  }>
                    {payment.status}
                  </Badge>
                </div>
              </div>
            ))}
            {payments.length === 0 && (
              <p className="text-kic-gray/70 text-center py-8">No payment history</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPayments;
