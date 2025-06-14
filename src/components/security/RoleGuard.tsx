
import { ReactNode, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield } from 'lucide-react';

type ComprehensiveRole = 'member' | 'super_admin' | 'general_admin' | 'community_admin' | 'events_admin' | 'projects_admin' | 'finance_admin' | 'content_admin' | 'technical_admin' | 'marketing_admin' | 'chairman' | 'vice_chairman';

interface RoleGuardProps {
  children: ReactNode;
  requiredRole?: ComprehensiveRole;
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
          // Check specific permission
          const { data, error } = await supabase.rpc('has_permission', {
            _user_id: user.id,
            _permission_key: requirePermission
          });
          
          if (error) {
            console.error('Error checking permission:', error);
            setHasAccess(false);
          } else {
            setHasAccess(data);
          }
        } else if (requiredRole) {
          // Check role hierarchy
          const { data, error } = await supabase.rpc('has_role_or_higher', {
            _user_id: user.id,
            _required_role: requiredRole
          });
          
          if (error) {
            console.error('Error checking role:', error);
            setHasAccess(false);
          } else {
            setHasAccess(data);
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
