
import { useAuth } from '@/contexts/AuthContext';
import SecureRoute from '@/components/security/SecureRoute';
import AdminDashboardHeader from './admin/AdminDashboardHeader';
import AdminDashboardStats from './admin/AdminDashboardStats';
import AdminDashboardTabs from './admin/AdminDashboardTabs';
import { useAdminData } from './admin/useAdminData';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Zap, TrendingUp, Users } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

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
      <div className="min-h-screen bg-gradient-to-br from-kic-lightGray via-kic-nearWhite to-kic-offWhite relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-kic-green-400 rounded-full blur-3xl animate-pulse-soft"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-kic-green-300 rounded-full blur-3xl animate-pulse-soft" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 relative z-10">
          {/* Header Section */}
          <div className="animate-fade-in">
            <AdminDashboardHeader />
          </div>

          {/* Quick Stats Overview */}
          <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <AdminDashboardStats stats={stats} />
          </div>

          {/* Quick Actions and Alerts Bar */}
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <Card className="bg-gradient-to-r from-kic-green-500 to-kic-green-600 text-white shadow-xl border-0 overflow-hidden">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-white/20 rounded-lg">
                        <Zap className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="font-semibold text-lg">Admin Command Center</h3>
                    </div>
                    <p className="text-kic-green-100 text-sm">
                      Monitor platform health and manage operations efficiently
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-3 w-full lg:w-auto justify-start lg:justify-end">
                    {/* Pending Members Alert */}
                    {stats.pendingMembers > 0 && (
                      <Alert className="bg-yellow-500/20 border-yellow-300/30 text-yellow-100 p-3 max-w-xs backdrop-blur-sm animate-bounce-gentle">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription className="text-sm">
                          <strong>{stats.pendingMembers}</strong> pending member{stats.pendingMembers > 1 ? 's' : ''} await approval
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    {/* Admin Requests Alert */}
                    {stats.pendingAdminRequests > 0 && (
                      <Alert className="bg-red-500/20 border-red-300/30 text-red-100 p-3 max-w-xs backdrop-blur-sm animate-bounce-gentle" style={{animationDelay: '0.2s'}}>
                        <Users className="h-4 w-4" />
                        <AlertDescription className="text-sm">
                          <strong>{stats.pendingAdminRequests}</strong> admin request{stats.pendingAdminRequests > 1 ? 's' : ''} need review
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Platform Health Indicator */}
                    <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                      <TrendingUp className="h-4 w-4 text-green-300" />
                      <span className="text-sm font-medium">Platform Healthy</span>
                      <Badge className="bg-green-500 text-white text-xs">Online</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
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

          {/* Footer Stats */}
          <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-white/70 backdrop-blur-sm border-kic-green-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-kic-green-600 mb-1">{stats.totalMembers || 0}</div>
                  <div className="text-sm text-kic-gray/70">Total Members</div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/70 backdrop-blur-sm border-kic-green-200 hover:shadow-lg transition-all duration-300 hover:scale-105" style={{animationDelay: '0.1s'}}>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-kic-green-600 mb-1">{stats.totalProjects || 0}</div>
                  <div className="text-sm text-kic-gray/70">Active Projects</div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/70 backdrop-blur-sm border-kic-green-200 hover:shadow-lg transition-all duration-300 hover:scale-105" style={{animationDelay: '0.2s'}}>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-kic-green-600 mb-1">{stats.totalEvents || 0}</div>
                  <div className="text-sm text-kic-gray/70">Upcoming Events</div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/70 backdrop-blur-sm border-kic-green-200 hover:shadow-lg transition-all duration-300 hover:scale-105" style={{animationDelay: '0.3s'}}>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-kic-green-600 mb-1">98%</div>
                  <div className="text-sm text-kic-gray/70">System Health</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </SecureRoute>
  );
};

export default AdminDashboard;
