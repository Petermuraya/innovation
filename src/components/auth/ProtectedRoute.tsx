
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useMemberStatus } from '@/hooks/useMemberStatus';
import { useRolePermissions } from '@/hooks/useRolePermissions';
import { Navigate, useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, UserX, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireApproval?: boolean;
  requiredPermission?: string;
  redirectTo?: string;
}

const ProtectedRoute = ({ 
  children, 
  requireApproval = true, 
  requiredPermission,
  redirectTo = '/login'
}: ProtectedRouteProps) => {
  const { member, loading: authLoading } = useAuth();
  const { loading: statusLoading, isApproved } = useMemberStatus();
  const { isAdmin, hasRolePermission, loading: roleLoading, roleInfo } = useRolePermissions();
  const location = useLocation();

  if (authLoading || statusLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-kic-lightGray">
        <Card>
          <CardContent className="p-6">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-kic-green-500" />
            <p className="text-gray-600">Verifying authentication...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Redirect to login if user is not authenticated
  if (!member) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check required permission if specified
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

  // For routes that require approval, check member status
  if (requireApproval && !isApproved) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-kic-lightGray p-6">
        <Alert className="max-w-md">
          <UserX className="h-4 w-4" />
          <AlertDescription>
            Your account is pending approval. Please wait for administrator approval.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
