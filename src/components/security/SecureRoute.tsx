
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import RoleGuard from './RoleGuard';
import { AppRole } from '@/types/roles';

interface SecureRouteProps {
  children: ReactNode;
  requiredRole?: AppRole;
  requiredPermission?: string;
  redirectTo?: string;
}

const SecureRoute = ({ 
  children, 
  requiredRole = 'member', 
  requiredPermission,
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
    <RoleGuard requiredRole={requiredRole} requiredPermission={requiredPermission}>
      {children}
    </RoleGuard>
  );
};

export default SecureRoute;
