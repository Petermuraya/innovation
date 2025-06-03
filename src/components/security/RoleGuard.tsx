
import { ReactNode, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield } from 'lucide-react';

interface RoleGuardProps {
  children: ReactNode;
  requiredRole: 'admin' | 'member';
  fallback?: ReactNode;
}

const RoleGuard = ({ children, requiredRole, fallback }: RoleGuardProps) => {
  const { user } = useAuth();
  const [hasRole, setHasRole] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      if (!user) {
        setHasRole(false);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error checking role:', error);
          setHasRole(false);
        } else {
          // Admin can access everything, member can access member areas
          setHasRole(
            data.role === 'admin' || 
            (requiredRole === 'member' && data.role === 'member')
          );
        }
      } catch (error) {
        console.error('Role check failed:', error);
        setHasRole(false);
      } finally {
        setLoading(false);
      }
    };

    checkRole();
  }, [user, requiredRole]);

  if (loading) {
    return <div className="text-center py-8">Verifying permissions...</div>;
  }

  if (!hasRole) {
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
