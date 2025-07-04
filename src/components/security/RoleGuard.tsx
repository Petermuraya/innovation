
import { ReactNode, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield } from 'lucide-react';
import { AppRole, hasPermission } from '@/types/roles';

interface RoleGuardProps {
  children: ReactNode;
  requiredRole?: AppRole;
  requiredPermission?: string;
  requiredRoles?: AppRole[];
  fallback?: ReactNode;
}

const RoleGuard = ({ 
  children, 
  requiredRole, 
  requiredPermission, 
  requiredRoles,
  fallback 
}: RoleGuardProps) => {
  const { user } = useAuth();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      if (!user) {
        setHasAccess(false);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);
        
        if (error) {
          console.error('Error checking role:', error);
          setHasAccess(false);
        } else {
          const userRoles = data?.map(r => r.role as AppRole) || ['member'];
          
          // Super admin has access to everything
          if (userRoles.includes('super_admin')) {
            setHasAccess(true);
          } else if (requiredPermission) {
            setHasAccess(hasPermission(userRoles, requiredPermission));
          } else if (requiredRole) {
            setHasAccess(userRoles.includes(requiredRole));
          } else if (requiredRoles) {
            setHasAccess(requiredRoles.some(role => userRoles.includes(role)));
          } else {
            setHasAccess(true);
          }
        }
      } catch (error) {
        console.error('Access check failed:', error);
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [user, requiredRole, requiredPermission, requiredRoles]);

  if (loading) {
    return <div className="text-center py-8">Verifying permissions...</div>;
  }

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <Alert variant="destructive" className="max-w-md mx-auto mt-8">
        <Shield className="h-4 w-4" />
        <AlertDescription>
          You don't have permission to access this area. Contact an administrator if you believe this is an error.
        </AlertDescription>
      </Alert>
    );
  }

  return <>{children}</>;
};

export default RoleGuard;
