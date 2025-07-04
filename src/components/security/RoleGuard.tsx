
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
  const { member } = useAuth();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      if (!member) {
        setHasAccess(false);
        setLoading(false);
        return;
      }

      try {
        // Use the has_role function instead of direct query
        if (requiredRole) {
          const { data, error } = await supabase.rpc('has_role', {
            _user_id: member.id,
            _role: requiredRole
          });
          
          if (error) {
            console.error('Error checking role:', error);
            setHasAccess(false);
          } else {
            setHasAccess(data || false);
          }
        } else if (requiredRoles) {
          // Check if user has any of the required roles
          let hasAnyRole = false;
          for (const role of requiredRoles) {
            const { data, error } = await supabase.rpc('has_role', {
              _user_id: member.id,
              _role: role
            });
            if (!error && data) {
              hasAnyRole = true;
              break;
            }
          }
          setHasAccess(hasAnyRole);
        } else {
          setHasAccess(true);
        }
      } catch (error) {
        console.error('Access check failed:', error);
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [member, requiredRole, requiredPermission, requiredRoles]);

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
