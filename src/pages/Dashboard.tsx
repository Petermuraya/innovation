
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import SecureDashboard from '@/components/dashboard/SecureDashboard';

const Dashboard = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // SecureDashboard will handle loading state
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <SecureDashboard />;
};

export default Dashboard;
