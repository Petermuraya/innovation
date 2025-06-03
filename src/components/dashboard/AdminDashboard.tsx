
import { useAuth } from '@/contexts/AuthContext';
import SecureRoute from '@/components/security/SecureRoute';
import AdminDashboardHeader from './admin/AdminDashboardHeader';
import AdminDashboardStats from './admin/AdminDashboardStats';
import AdminDashboardTabs from './admin/AdminDashboardTabs';
import { useAdminData } from './admin/useAdminData';

const AdminDashboard = () => {
  const { user } = useAuth();
  const {
    stats,
    members,
    events,
    projects,
    payments,
    updateMemberStatus,
    updateProjectStatus,
  } = useAdminData();

  return (
    <SecureRoute requiredRole="admin">
      <div className="container mx-auto p-6">
        <AdminDashboardHeader />
        <AdminDashboardStats stats={stats} />
        
        <AdminDashboardTabs
          stats={stats}
          members={members}
          projects={projects}
          payments={payments}
          updateMemberStatus={updateMemberStatus}
          updateProjectStatus={updateProjectStatus}
        />
      </div>
    </SecureRoute>
  );
};

export default AdminDashboard;
