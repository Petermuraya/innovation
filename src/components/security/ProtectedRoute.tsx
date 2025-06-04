
import { useAuth } from '@/contexts/AuthContext';
import { useMemberStatus } from '@/hooks/useMemberStatus';
import { Navigate, useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, UserX } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireApproval?: boolean;
  adminOnly?: boolean;
  redirectTo?: string;
}

const ProtectedRoute = ({ 
  children, 
  requireApproval = true, 
  adminOnly = false,
  redirectTo = '/login' 
}: ProtectedRouteProps) => {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const { loading: statusLoading, isApproved } = useMemberStatus();
  const location = useLocation();

  if (authLoading || statusLoading) {
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

  // Admin-only routes
  if (adminOnly && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-kic-lightGray p-6">
        <Alert variant="destructive" className="max-w-md">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            You need administrator privileges to access this page.
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
