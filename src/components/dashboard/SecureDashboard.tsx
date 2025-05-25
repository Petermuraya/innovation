
import { useAuth } from '@/contexts/AuthContext';
import { useMemberStatus } from '@/hooks/useMemberStatus';
import UserDashboard from '@/components/dashboard/UserDashboard';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import RegistrationPending from '@/components/auth/RegistrationPending';
import { Card, CardContent } from '@/components/ui/card';

const SecureDashboard = () => {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const { loading: statusLoading, isApproved } = useMemberStatus();

  if (authLoading || statusLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-kic-lightGray">
        <Card>
          <CardContent className="p-6">
            <p>Loading dashboard...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return null; // This will be handled by ProtectedRoute
  }

  // Admins can always access the dashboard
  if (isAdmin) {
    return (
      <div className="min-h-screen bg-kic-lightGray">
        <AdminDashboard />
      </div>
    );
  }

  // Regular users need approval
  if (!isApproved) {
    return <RegistrationPending />;
  }

  return (
    <div className="min-h-screen bg-kic-lightGray">
      <UserDashboard />
    </div>
  );
};

export default SecureDashboard;
