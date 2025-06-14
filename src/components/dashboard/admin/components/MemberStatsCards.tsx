
import { Card, CardContent } from '@/components/ui/card';
import { Users, UserCheck, UserX, Clock, Calendar } from 'lucide-react';
import { MemberStats } from '../types/members';

interface MemberStatsCardsProps {
  stats: MemberStats;
}

const MemberStatsCards = ({ stats }: MemberStatsCardsProps) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      <Card className="hover:shadow-md transition-shadow border-kic-green-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Members</p>
              <p className="text-2xl font-bold text-kic-green-700">{stats.total}</p>
            </div>
            <Users className="h-8 w-8 text-kic-green-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow border-yellow-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-700">{stats.pending}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-700">{stats.approved}</p>
            </div>
            <UserCheck className="h-8 w-8 text-green-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow border-red-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-red-700">{stats.rejected}</p>
            </div>
            <UserX className="h-8 w-8 text-red-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">New (7 days)</p>
              <p className="text-2xl font-bold text-blue-700">{stats.recent}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MemberStatsCards;
