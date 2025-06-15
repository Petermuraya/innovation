
import { useState, useEffect } from 'react';

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

export const usePaymentFilters = (payments: Payment[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);

  useEffect(() => {
    filterPayments();
  }, [payments, searchQuery, statusFilter, typeFilter]);

  const filterPayments = () => {
    let filtered = payments;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(payment =>
        payment.transaction_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.mpesa_receipt_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.phone_number?.includes(searchQuery) ||
        payment.members?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.members?.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(payment => payment.status === statusFilter);
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(payment => payment.payment_type === typeFilter);
    }

    setFilteredPayments(filtered);
  };

  return {
    searchQuery,
    statusFilter,
    typeFilter,
    filteredPayments,
    setSearchQuery,
    setStatusFilter,
    setTypeFilter
  };
};
