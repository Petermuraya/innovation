
import { Card, CardContent } from '@/components/ui/card';
import { Users, Calendar, GitBranch, CreditCard, FileText } from 'lucide-react';

interface AdminDashboardStatsProps {
  stats: {
    totalMembers: number;
    pendingMembers: number;
    totalEvents: number;
    pendingProjects: number;
    totalPayments: number;
    totalCertificates: number;
  };
}

const AdminDashboardStats = ({ stats }: AdminDashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-kic-green-500" />
            <div>
              <p className="text-sm text-kic-gray/70">Total Members</p>
              <p className="text-xl font-bold text-kic-gray">{stats.totalMembers}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-yellow-500" />
            <div>
              <p className="text-sm text-kic-gray/70">Pending Members</p>
              <p className="text-xl font-bold text-kic-gray">{stats.pendingMembers}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-kic-green-500" />
            <div>
              <p className="text-sm text-kic-gray/70">Total Events</p>
              <p className="text-xl font-bold text-kic-gray">{stats.totalEvents}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <GitBranch className="h-5 w-5 text-kic-green-500" />
            <div>
              <p className="text-sm text-kic-gray/70">Pending Projects</p>
              <p className="text-xl font-bold text-kic-gray">{stats.pendingProjects}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5 text-kic-green-500" />
            <div>
              <p className="text-sm text-kic-gray/70">Total Payments</p>
              <p className="text-xl font-bold text-kic-gray">{stats.totalPayments}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-kic-green-500" />
            <div>
              <p className="text-sm text-kic-gray/70">Certificates</p>
              <p className="text-xl font-bold text-kic-gray">{stats.totalCertificates}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboardStats;
