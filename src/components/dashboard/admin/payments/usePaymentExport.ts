
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

export const usePaymentExport = () => {
  const exportPayments = (filteredPayments: Payment[]) => {
    const csvContent = [
      ['Date', 'Transaction ID', 'Amount', 'Phone', 'Type', 'Status', 'Member Name', 'Member Email'].join(','),
      ...filteredPayments.map(payment => [
        format(new Date(payment.created_at), 'yyyy-MM-dd HH:mm:ss'),
        payment.transaction_id || 'N/A',
        payment.amount,
        payment.phone_number,
        payment.payment_type,
        payment.status,
        payment.members?.name || 'N/A',
        payment.members?.email || 'N/A'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payments_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return { exportPayments };
};
