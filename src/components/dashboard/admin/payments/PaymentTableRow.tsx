
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DollarSign, Users, Calendar, Eye } from 'lucide-react';
import { format } from 'date-fns';

interface Payment {
  id: string;
  amount: number;
  phone_number: string;
  payment_type: string;
  transaction_id: string;
  mpesa_receipt_number: string;
  created_at: string;
  status: string;
  user_id: string;
  checkout_request_id: string;
  merchant_request_id: string;
  result_desc?: string;
  members?: { name: string; email: string } | null;
}

interface PaymentTableRowProps {
  payment: Payment;
}

const PaymentTableRow = ({ payment }: PaymentTableRowProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPaymentTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'membership':
        return <Users className="w-4 h-4 text-blue-500" />;
      case 'event':
        return <Calendar className="w-4 h-4 text-purple-500" />;
      default:
        return <DollarSign className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <TableRow className="hover:bg-gray-50">
      <TableCell className="font-medium">
        {format(new Date(payment.created_at), 'MMM d, yyyy')}
        <br />
        <span className="text-xs text-gray-500">
          {format(new Date(payment.created_at), 'h:mm a')}
        </span>
      </TableCell>
      <TableCell>
        <div>
          <p className="font-medium">{payment.members?.name || 'N/A'}</p>
          <p className="text-xs text-gray-500">{payment.members?.email || 'N/A'}</p>
        </div>
      </TableCell>
      <TableCell className="font-semibold text-green-600">
        KSh {Number(payment.amount).toLocaleString()}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          {getPaymentTypeIcon(payment.payment_type)}
          <span className="capitalize">{payment.payment_type}</span>
        </div>
      </TableCell>
      <TableCell>
        <div>
          <p className="font-mono text-xs">{payment.transaction_id || 'N/A'}</p>
          {payment.mpesa_receipt_number && (
            <p className="font-mono text-xs text-gray-500">
              {payment.mpesa_receipt_number}
            </p>
          )}
        </div>
      </TableCell>
      <TableCell>{payment.phone_number}</TableCell>
      <TableCell>{getStatusBadge(payment.status)}</TableCell>
      <TableCell>
        <Button variant="ghost" size="sm">
          <Eye className="w-4 h-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default PaymentTableRow;
