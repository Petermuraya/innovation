
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import RoleGuard from './RoleGuard';

interface SecureRouteProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'member';
  redirectTo?: string;
}

const SecureRoute = ({ 
  children, 
  requiredRole = 'member', 
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
    <RoleGuard requiredRole={requiredRole}>
      {children}
    </RoleGuard>
  );
};

export default SecureRoute;
