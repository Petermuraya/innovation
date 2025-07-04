
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useMemberStatus } from '@/hooks/useMemberStatus';
import { useRolePermissions } from '@/hooks/useRolePermissions';
import { Navigate, useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, UserX } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AppRole } from '@/types/roles';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireApproval?: boolean;
  requiredRole?: AppRole;
  requiredRoles?: AppRole[];
  requiredPermission?: string;
  redirectTo?: string;
}

const ProtectedRoute = ({ 
  children, 
  requireApproval = true, 
  requiredRole,
  requiredRoles,
  requiredPermission,
  redirectTo = '/login' 
}: ProtectedRouteProps) => {
  const { user, loading: authLoading } = useAuth();
  const { loading: statusLoading, isApproved } = useMemberStatus();
  const { isAdmin, hasRolePermission, loading: roleLoading, roleInfo } = useRolePermissions();
  const location = useLocation();

  if (authLoading || statusLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-kic-lightGray">
        <Card>
          <CardContent className="p-6">
            <p>Verifying access...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check specific role requirement
  if (requiredRole && !roleInfo?.inheritedRoles.includes(requiredRole) && !roleInfo?.inheritedRoles.includes('super_admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-kic-lightGray p-6">
        <Alert variant="destructive" className="max-w-md">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            You need {requiredRole.replace('-', ' ')} privileges to access this page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Check multiple roles requirement
  if (requiredRoles && !requiredRoles.some(role => roleInfo?.inheritedRoles.includes(role)) && !roleInfo?.inheritedRoles.includes('super_admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-kic-lightGray p-6">
        <Alert variant="destructive" className="max-w-md">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            You don't have the required role to access this page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Check specific permission requirement
  if (requiredPermission && !hasRolePermission(requiredPermission)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-kic-lightGray p-6">
        <Alert variant="destructive" className="max-w-md">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            You don't have the required permissions to access this page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Member approval requirement (skip for admins)
  if (requireApproval && !isAdmin && !isApproved) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-kic-lightGray p-6">
        <Alert variant="destructive" className="max-w-md">
          <UserX className="h-4 w-4" />
          <AlertDescription>
            Your membership is pending approval. Please wait for an administrator to approve your account.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
