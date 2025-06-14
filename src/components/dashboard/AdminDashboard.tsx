
import { useAuth } from '@/contexts/AuthContext';
import SecureRoute from '@/components/security/SecureRoute';
import AdminDashboardHeader from './admin/AdminDashboardHeader';
import AdminDashboardStats from './admin/AdminDashboardStats';
import AdminDashboardTabs from './admin/AdminDashboardTabs';
import { useAdminData } from './admin/useAdminData';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const AdminDashboard = () => {
  const { user } = useAuth();
  const {
    stats,
    members,
    events,
    projects,
    payments,
    updateMemberStatus,
    updateProjectStatus,
  } = useAdminData();

  return (
    <SecureRoute requiredRole="general_admin">
      <div className="min-h-screen bg-gradient-to-br from-kic-lightGray via-kic-nearWhite to-kic-offWhite">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Header Section */}
          <div className="animate-fade-in">
            <AdminDashboardHeader />
          </div>

          {/* Quick Stats Overview */}
          <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <AdminDashboardStats stats={stats} />
          </div>

          {/* Main Content Tabs */}
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-0">
                <AdminDashboardTabs
                  stats={stats}
                  members={members}
                  projects={projects}
                  payments={payments}
                  updateMemberStatus={updateMemberStatus}
                  updateProjectStatus={updateProjectStatus}
                />
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions Bar */}
          <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Card className="bg-kic-green-500 text-white shadow-lg border-0">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-center sm:text-left">
                    <h3 className="font-semibold text-lg">Admin Quick Actions</h3>
                    <p className="text-kic-green-100 text-sm">
                      Manage your platform efficiently with these quick tools
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
                    {stats.pendingMembers > 0 && (
                      <Alert className="bg-yellow-100 border-yellow-300 text-yellow-800 text-xs p-2 max-w-xs">
                        <AlertTriangle className="h-3 w-3" />
                        <AlertDescription className="text-xs">
                          {stats.pendingMembers} pending member{stats.pendingMembers > 1 ? 's' : ''}
                        </AlertDescription>
                      </Alert>
                    )}
                    {stats.pendingAdminRequests > 0 && (
                      <Alert className="bg-red-100 border-red-300 text-red-800 text-xs p-2 max-w-xs">
                        <AlertTriangle className="h-3 w-3" />
                        <AlertDescription className="text-xs">
                          {stats.pendingAdminRequests} admin request{stats.pendingAdminRequests > 1 ? 's' : ''}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SecureRoute>
  );
};

export default AdminDashboard;
