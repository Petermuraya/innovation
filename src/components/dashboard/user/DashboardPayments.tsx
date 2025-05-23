
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DashboardPaymentsProps {
  payments: any[];
}

const DashboardPayments = ({ payments }: DashboardPaymentsProps) => {
  return (
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
                  <p className="text-sm text-kic-gray/70">{payment.payment_type}</p>
                  <p className="text-sm text-kic-gray/70">{new Date(payment.created_at).toLocaleDateString()}</p>
                </div>
                <Badge variant={payment.status === 'completed' ? 'default' : payment.status === 'failed' ? 'destructive' : 'secondary'}>
                  {payment.status}
                </Badge>
              </div>
            </div>
          ))}
          {payments.length === 0 && (
            <p className="text-kic-gray/70">No payment history</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardPayments;
