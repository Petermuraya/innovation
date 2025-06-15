
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, RefreshCw, Download } from 'lucide-react';

interface PaymentsHeaderProps {
  loading: boolean;
  onRefresh: () => void;
  onExport: () => void;
}

const PaymentsHeader = ({ loading, onRefresh, onExport }: PaymentsHeaderProps) => {
  return (
    <CardHeader>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Payment Tracking
          </CardTitle>
          <CardDescription>Monitor and manage all M-PESA payments</CardDescription>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>
    </CardHeader>
  );
};

export default PaymentsHeader;
