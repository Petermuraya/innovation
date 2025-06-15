
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, DollarSign, Calendar, Eye } from 'lucide-react';

interface PaymentStats {
  totalAmount: number;
  totalCount: number;
  pendingCount: number;
  failedCount: number;
}

interface PaymentStatsCardsProps {
  stats: PaymentStats;
}

const PaymentStatsCards = ({ stats }: PaymentStatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">
                KSh {stats.totalAmount.toLocaleString()}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalCount}</p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pendingCount}</p>
            </div>
            <Calendar className="w-8 h-8 text-yellow-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Failed</p>
              <p className="text-2xl font-bold text-red-600">{stats.failedCount}</p>
            </div>
            <Eye className="w-8 h-8 text-red-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentStatsCards;
