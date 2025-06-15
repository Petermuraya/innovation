
import { useMemo } from 'react';

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

export const usePaymentStats = (filteredPayments: Payment[]) => {
  return useMemo(() => {
    const completedPayments = filteredPayments.filter(p => p.status === 'completed');
    const totalAmount = completedPayments.reduce((sum, p) => sum + Number(p.amount), 0);
    const totalCount = completedPayments.length;
    const pendingCount = filteredPayments.filter(p => p.status === 'pending').length;
    const failedCount = filteredPayments.filter(p => p.status === 'failed').length;

    return { totalAmount, totalCount, pendingCount, failedCount };
  }, [filteredPayments]);
};
