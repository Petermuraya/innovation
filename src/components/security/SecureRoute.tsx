
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import RoleGuard from './RoleGuard';

type ComprehensiveRole = 'member' | 'super_admin' | 'general_admin' | 'community_admin' | 'events_admin' | 'projects_admin' | 'finance_admin' | 'content_admin' | 'technical_admin' | 'marketing_admin' | 'chairman' | 'vice_chairman';

interface SecureRouteProps {
  children: ReactNode;
  requiredRole?: ComprehensiveRole;
  requirePermission?: string;
  redirectTo?: string;
}

const SecureRoute = ({ 
  children, 
  requiredRole = 'member', 
  requirePermission,
  redirectTo = '/login' 
}: SecureRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <RoleGuard requiredRole={requiredRole} requirePermission={requirePermission}>
      {children}
    </RoleGuard>
  );
};

export default SecureRoute;
