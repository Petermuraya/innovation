
import { ReactNode, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield } from 'lucide-react';
import type { AppRole } from '@/types/roles';

interface RoleGuardProps {
  children: ReactNode;
  requiredRole?: AppRole;
  fallback?: ReactNode;
  requirePermission?: string;
}

const RoleGuard = ({ children, requiredRole, fallback, requirePermission }: RoleGuardProps) => {
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
        if (requirePermission) {
          // Check specific permission - simplified approach
          // For now, super admins have all permissions
          const { data, error } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .eq('role', 'super_admin')
            .single();
          
          if (error && error.code !== 'PGRST116') {
            console.error('Error checking permission:', error);
            setHasAccess(false);
          } else {
            setHasAccess(!!data);
          }
        } else if (requiredRole) {
          // Check role
          const { data, error } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id);
          
          if (error) {
            console.error('Error checking role:', error);
            setHasAccess(false);
          } else {
            const userRoles = data?.map(r => r.role) || [];
            // Super admin has access to everything
            const hasRole = userRoles.includes('super_admin') || userRoles.includes(requiredRole);
            setHasAccess(hasRole);
          }
        } else {
          // No permission or role check specified, default to false
          setHasAccess(false);
        }
      } catch (error) {
        console.error('Access check failed:', error);
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [user, requiredRole, requirePermission]);

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
