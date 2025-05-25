
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Payment {
  id: string;
  amount: number;
  phone_number: string;
  payment_type: string;
  transaction_id: string;
  created_at: string;
  status: string;
  members?: { name: string };
}

interface PaymentsManagementProps {
  payments: Payment[];
}

const PaymentsManagement = ({ payments }: PaymentsManagementProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Management</CardTitle>
        <CardDescription>View and manage MPESA payments</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {payments.map((payment) => (
            <div key={payment.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-kic-gray">KSh {payment.amount}</h4>
                  <p className="text-sm text-kic-gray/70">From: {payment.members?.name}</p>
                  <p className="text-sm text-kic-gray/70">Phone: {payment.phone_number}</p>
                  <p className="text-sm text-kic-gray/70">Type: {payment.payment_type}</p>
                  <p className="text-sm text-kic-gray/70">Transaction: {payment.transaction_id}</p>
                  <p className="text-sm text-kic-gray/70">Date: {new Date(payment.created_at).toLocaleDateString()}</p>
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
            <p className="text-kic-gray/70">No payments found</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentsManagement;
