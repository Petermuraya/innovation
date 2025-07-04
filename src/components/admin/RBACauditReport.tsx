
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useRolePermissions } from '@/hooks/useRolePermissions';
import { ROLE_PERMISSIONS, AppRole } from '@/types/roles';

interface AuditIssue {
  type: 'error' | 'warning' | 'info';
  category: 'route' | 'rls' | 'ui' | 'role_assignment';
  description: string;
  recommendation: string;
}

const RBACauditReport = () => {
  const { isPatron } = useRolePermissions();
  const [auditResults, setAuditResults] = useState<AuditIssue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isPatron) {
      performAudit();
    }
  }, [isPatron]);

  const performAudit = async () => {
    setLoading(true);
    const issues: AuditIssue[] = [];

    // 1. Audit user roles vs permission matrix
    try {
      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('user_id, role');

      const { data: users } = await supabase
        .from('members')
        .select('user_id, name, email');

      // Check for undefined roles
      const definedRoles = Object.keys(ROLE_PERMISSIONS) as AppRole[];
      const usedRoles = [...new Set(userRoles?.map(ur => ur.role) || [])];
      
      usedRoles.forEach(role => {
        if (!definedRoles.includes(role as AppRole)) {
          issues.push({
            type: 'error',
            category: 'role_assignment',
            description: `Role "${role}" is assigned but not defined in permission matrix`,
            recommendation: `Remove role or add to permission matrix with explicit permissions`
          });
        }
      });

      // Check for users without roles
      const usersWithRoles = new Set(userRoles?.map(ur => ur.user_id) || []);
      users?.forEach(user => {
        if (!usersWithRoles.has(user.user_id)) {
          issues.push({
            type: 'warning',
            category: 'role_assignment',
            description: `User "${user.name}" (${user.email}) has no assigned roles`,
            recommendation: 'Assign appropriate role or default to "member"'
          });
        }
      });

    } catch (error) {
      issues.push({
        type: 'error',
        category: 'role_assignment',
        description: 'Failed to audit user roles',
        recommendation: 'Check database connectivity and permissions'
      });
    }

    // 2. Audit route protection
    const protectedRoutes = [
      { path: '/admin', requiredRoles: ['patron', 'chairperson', 'vice-chairperson'] },
      { path: '/admin/users', requiredRoles: ['patron', 'chairperson'] },
      { path: '/admin/finances', requiredRoles: ['patron', 'chairperson', 'treasurer'] },
      { path: '/admin/events', requiredRoles: ['patron', 'chairperson', 'vice-chairperson', 'secretary', 'vice-secretary', 'organizing-secretary'] }
    ];

    protectedRoutes.forEach(route => {
      // This would normally check if routes are properly protected
      // For now, we'll assume they need to be verified manually
      issues.push({
        type: 'info',
        category: 'route',
        description: `Route ${route.path} requires manual verification`,
        recommendation: `Ensure ProtectedRoute component guards this path with roles: ${route.requiredRoles.join(', ')}`
      });
    });

    // 3. Check for patron role existence and power
    const patronExists = usedRoles.includes('patron');
    if (!patronExists) {
      issues.push({
        type: 'error',
        category: 'role_assignment',
        description: 'No patron role assigned to any user',
        recommendation: 'Assign patron role to at least one user for system administration'
      });
    }

    // 4. Financial access audit
    const financialRoles = ['patron', 'chairperson', 'treasurer'];
    const hasFinancialAdmin = usedRoles.some(role => financialRoles.includes(role));
    if (!hasFinancialAdmin) {
      issues.push({
        type: 'warning',
        category: 'role_assignment',
        description: 'No users have financial management permissions',
        recommendation: 'Assign treasurer, chairperson, or patron role to manage finances'
      });
    }

    setAuditResults(issues);
    setLoading(false);
  };

  if (!isPatron) {
    return (
      <Card>
        <CardContent className="p-6">
          <Alert variant="destructive">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Only patrons can access the RBAC audit report.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const errorCount = auditResults.filter(r => r.type === 'error').length;
  const warningCount = auditResults.filter(r => r.type === 'warning').length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            RBAC Audit Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2">
                <XCircle className="w-5 h-5 text-red-500" />
                <span className="text-2xl font-bold text-red-500">{errorCount}</span>
              </div>
              <p className="text-sm text-gray-600">Critical Issues</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                <span className="text-2xl font-bold text-yellow-500">{warningCount}</span>
              </div>
              <p className="text-sm text-gray-600">Warnings</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-2xl font-bold text-green-500">
                  {auditResults.filter(r => r.type === 'info').length}
                </span>
              </div>
              <p className="text-sm text-gray-600">Info Items</p>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2">Auditing RBAC system...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {auditResults.map((issue, index) => (
                <Alert key={index} variant={issue.type === 'error' ? 'destructive' : 'default'}>
                  <div className="flex items-start gap-3">
                    {issue.type === 'error' && <XCircle className="w-4 h-4 text-red-500 mt-0.5" />}
                    {issue.type === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5" />}
                    {issue.type === 'info' && <Shield className="w-4 h-4 text-blue-500 mt-0.5" />}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">{issue.category}</Badge>
                        <Badge variant={issue.type === 'error' ? 'destructive' : issue.type === 'warning' ? 'secondary' : 'default'}>
                          {issue.type}
                        </Badge>
                      </div>
                      <AlertDescription className="mb-2">
                        <strong>Issue:</strong> {issue.description}
                      </AlertDescription>
                      <AlertDescription>
                        <strong>Recommendation:</strong> {issue.recommendation}
                      </AlertDescription>
                    </div>
                  </div>
                </Alert>
              ))}

              {auditResults.length === 0 && (
                <Alert>
                  <CheckCircle className="w-4 w-4 text-green-500" />
                  <AlertDescription>
                    RBAC audit completed successfully. No issues found.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Permission Matrix Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(ROLE_PERMISSIONS).map(([role, permissions]) => (
              <div key={role} className="border rounded-lg p-4">
                <div className="font-medium mb-2 capitalize">
                  {role.replace('-', ' ')}
                </div>
                <div className="text-sm text-gray-600">
                  {permissions.length} permissions
                </div>
                <div className="mt-2 space-y-1">
                  {permissions.slice(0, 3).map(permission => (
                    <Badge key={permission} variant="outline" className="mr-1 mb-1 text-xs">
                      {permission.replace('_', ' ')}
                    </Badge>
                  ))}
                  {permissions.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{permissions.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RBACauditReport;
