
import { Card, CardContent } from '@/components/ui/card';
import PaymentStatsCards from './payments/PaymentStatsCards';
import PaymentsHeader from './payments/PaymentsHeader';
import PaymentFilters from './payments/PaymentFilters';
import PaymentsTable from './payments/PaymentsTable';
import { usePaymentsData } from './payments/usePaymentsData';
import { usePaymentFilters } from './payments/usePaymentFilters';
import { usePaymentStats } from './payments/usePaymentStats';
import { usePaymentExport } from './payments/usePaymentExport';

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

interface PaymentsManagementProps {
  payments: Payment[];
}

const PaymentsManagement = ({ payments: initialPayments }: PaymentsManagementProps) => {
  const { payments, loading, fetchPayments } = usePaymentsData(initialPayments);
  const {
    searchQuery,
    statusFilter,
    typeFilter,
    filteredPayments,
    setSearchQuery,
    setStatusFilter,
    setTypeFilter
  } = usePaymentFilters(payments);
  const stats = usePaymentStats(filteredPayments);
  const { exportPayments } = usePaymentExport();

  const handleExport = () => {
    exportPayments(filteredPayments);
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <PaymentStatsCards stats={stats} />

      {/* Main Payments Table */}
      <Card>
        <PaymentsHeader
          loading={loading}
          onRefresh={fetchPayments}
          onExport={handleExport}
        />

        <CardContent>
          <PaymentFilters
            searchQuery={searchQuery}
            statusFilter={statusFilter}
            typeFilter={typeFilter}
            onSearchChange={setSearchQuery}
            onStatusChange={setStatusFilter}
            onTypeChange={setTypeFilter}
          />

          <PaymentsTable
            payments={filteredPayments}
            loading={loading}
          />

          {/* Summary */}
          {filteredPayments.length > 0 && (
            <div className="mt-4 text-sm text-gray-500">
              Showing {filteredPayments.length} of {payments.length} payments
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentsManagement;
