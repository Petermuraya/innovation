
import AdminStatCard from './AdminStatCard';

interface AdminDashboardStatsProps {
  stats: {
    totalMembers: number;
    pendingMembers: number;
    totalEvents: number;
    pendingProjects: number;
    totalPayments: number;
    totalCertificates: number;
    pendingAdminRequests: number;
  };
}

const AdminDashboardStats = ({ stats }: AdminDashboardStatsProps) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
    <AdminStatCard title="Total Members" value={stats.totalMembers} />
    <AdminStatCard title="Pending Members" value={stats.pendingMembers} />
    <AdminStatCard title="Total Events" value={stats.totalEvents} />
    <AdminStatCard title="Pending Projects" value={stats.pendingProjects} />
    <AdminStatCard title="Total Payments" value={stats.totalPayments} />
    <AdminStatCard title="Certificates" value={stats.totalCertificates} />
    <AdminStatCard 
      title="Admin Requests" 
      value={stats.pendingAdminRequests} 
      highlight={stats.pendingAdminRequests > 0}
    />
  </div>
);

export default AdminDashboardStats;
