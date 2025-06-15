
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Calendar, 
  FolderOpen, 
  Award, 
  CreditCard, 
  Settings,
  BarChart3,
  FileText,
  MessageSquare,
  Shield,
  UserCog,
  Code2,
  UserCheck,
  Trophy,
  Bell,
  DollarSign,
  BookOpen,
  Briefcase,
  ScrollText,
  Vote
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRolePermissions } from '@/hooks/useRolePermissions';
import RoleGuard from '@/components/security/RoleGuard';
import EnhancedMembersManagement from './admin/EnhancedMembersManagement';
import EnhancedEventsManagement from './admin/EnhancedEventsManagement';
import ProjectsManagement from './admin/ProjectsManagement';
import CertificateManager from './admin/CertificateManager';
import PaymentsManagement from './admin/PaymentsManagement';
import RoleManagement from './admin/RoleManagement';
import AdminAnalytics from './admin/AdminAnalytics';
import AdminBlogManagement from './admin/AdminBlogManagement';
import SubmissionsManagement from './admin/SubmissionsManagement';
import UserManagement from './admin/UserManagement';
import EnhancedAdminRequestsManagement from './admin/EnhancedAdminRequestsManagement';
import EnhancedLeaderboardManager from '@/components/admin/EnhancedLeaderboardManager';
import WorldClassNotificationSystem from './admin/WorldClassNotificationSystem';
import MPesaConfigManager from './admin/MPesaConfigManager';
import BlogManagement from './admin/BlogManagement';
import CareerManagement from './admin/CareerManagement';
import CommunityAdminManagement from './admin/CommunityAdminManagement';
import ConstitutionManagement from './admin/ConstitutionManagement';
import AdminElectionManagement from '@/components/elections/AdminElectionManagement';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { roleInfo, loading, isSuperAdmin, isChairman } = useRolePermissions();
  const [activeTab, setActiveTab] = useState('members');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  const getRoleDisplayName = (role: string) => {
    const roleNames: Record<string, string> = {
      'super_admin': 'Super Admin',
      'general_admin': 'General Admin', 
      'community_admin': 'Community Admin',
      'events_admin': 'Events Admin',
      'projects_admin': 'Projects Admin',
      'finance_admin': 'Finance Admin',
      'content_admin': 'Content Admin',
      'technical_admin': 'Technical Admin',
      'marketing_admin': 'Marketing Admin',
      'chairman': 'Chairman',
      'vice_chairman': 'Vice Chairman'
    };
    return roleNames[role] || role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Show user management tabs for super admins and chairman
  const canManageUsers = isSuperAdmin || isChairman;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 flex-shrink-0" />
              <div>
                <CardTitle className="text-xl sm:text-2xl">Admin Dashboard</CardTitle>
                <p className="text-sm sm:text-base text-gray-600">
                  Welcome, {roleInfo?.assignedRole ? getRoleDisplayName(roleInfo.assignedRole) : 'Administrator'}
                </p>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-xs sm:text-sm text-gray-500">Logged in as</p>
              <p className="text-sm sm:text-base font-medium truncate max-w-[200px]">{user?.email}</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Admin Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="bg-gradient-to-r from-kic-green-50 to-kic-green-100 p-2 sm:p-4 border-b border-kic-green-200 rounded-t-lg">
          <TabsList className={`grid w-full ${canManageUsers ? 'grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-15' : 'grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-13'} bg-white/80 backdrop-blur-sm border border-kic-green-200 p-1 gap-0.5 sm:gap-1 h-auto`}>
            {canManageUsers && (
              <>
                <TabsTrigger 
                  value="user-management" 
                  className="flex flex-col sm:flex-row items-center gap-1 p-2 sm:p-3 text-xs sm:text-sm transition-all duration-300 hover:scale-105 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-orange-500 data-[state=active]:text-white"
                >
                  <UserCog className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline font-medium">Users</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="role-management" 
                  className="flex flex-col sm:flex-row items-center gap-1 p-2 sm:p-3 text-xs sm:text-sm transition-all duration-300 hover:scale-105 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
                >
                  <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline font-medium">Roles</span>
                </TabsTrigger>
              </>
            )}
            
            <TabsTrigger 
              value="members" 
              className="flex flex-col sm:flex-row items-center gap-1 p-2 sm:p-3 text-xs sm:text-sm transition-all duration-300 hover:scale-105 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white"
            >
              <Users className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline font-medium">Members</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="community-admins"
              className="flex flex-col sm:flex-row items-center gap-1 p-2 sm:p-3 text-xs sm:text-sm transition-all duration-300 hover:scale-105 data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline font-medium">Community</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="projects"
              className="flex flex-col sm:flex-row items-center gap-1 p-2 sm:p-3 text-xs sm:text-sm transition-all duration-300 hover:scale-105 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white"
            >
              <Code2 className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline font-medium">Projects</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="events"
              className="flex flex-col sm:flex-row items-center gap-1 p-2 sm:p-3 text-xs sm:text-sm transition-all duration-300 hover:scale-105 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
            >
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline font-medium">Events</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="payments"
              className="flex flex-col sm:flex-row items-center gap-1 p-2 sm:p-3 text-xs sm:text-sm transition-all duration-300 hover:scale-105 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white"
            >
              <CreditCard className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline font-medium">Payments</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="admin-requests"
              className="flex flex-col sm:flex-row items-center gap-1 p-2 sm:p-3 text-xs sm:text-sm transition-all duration-300 hover:scale-105 data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
            >
              <UserCheck className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline font-medium">Requests</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="certificates"
              className="flex flex-col sm:flex-row items-center gap-1 p-2 sm:p-3 text-xs sm:text-sm transition-all duration-300 hover:scale-105 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-yellow-500 data-[state=active]:text-white"
            >
              <Award className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline font-medium">Certificates</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="leaderboard"
              className="flex flex-col sm:flex-row items-center gap-1 p-2 sm:p-3 text-xs sm:text-sm transition-all duration-300 hover:scale-105 data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-white"
            >
              <Trophy className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline font-medium">Leaderboard</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="notifications"
              className="flex flex-col sm:flex-row items-center gap-1 p-2 sm:p-3 text-xs sm:text-sm transition-all duration-300 hover:scale-105 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-rose-500 data-[state=active]:text-white"
            >
              <Bell className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline font-medium">Notifications</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="mpesa-config"
              className="flex flex-col sm:flex-row items-center gap-1 p-2 sm:p-3 text-xs sm:text-sm transition-all duration-300 hover:scale-105 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white"
            >
              <DollarSign className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline font-medium">M-Pesa</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="blogs"
              className="flex flex-col sm:flex-row items-center gap-1 p-2 sm:p-3 text-xs sm:text-sm transition-all duration-300 hover:scale-105 data-[state=active]:bg-gradient-to-r data-[state=active]:from-slate-500 data-[state=active]:to-gray-600 data-[state=active]:text-white"
            >
              <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline font-medium">Blogs</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="careers"
              className="flex flex-col sm:flex-row items-center gap-1 p-2 sm:p-3 text-xs sm:text-sm transition-all duration-300 hover:scale-105 data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-cyan-600 data-[state=active]:text-white"
            >
              <Briefcase className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline font-medium">Careers</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="constitution"
              className="flex flex-col sm:flex-row items-center gap-1 p-2 sm:p-3 text-xs sm:text-sm transition-all duration-300 hover:scale-105 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-blue-700 data-[state=active]:text-white"
            >
              <ScrollText className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline font-medium">Constitution</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="elections"
              className="flex flex-col sm:flex-row items-center gap-1 p-2 sm:p-3 text-xs sm:text-sm transition-all duration-300 hover:scale-105 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-indigo-700 data-[state=active]:text-white"
            >
              <Vote className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline font-medium">Elections</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="submissions"
              className="flex flex-col sm:flex-row items-center gap-1 p-2 sm:p-3 text-xs sm:text-sm transition-all duration-300 hover:scale-105 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white"
            >
              <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline font-medium">Submissions</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="analytics"
              className="flex flex-col sm:flex-row items-center gap-1 p-2 sm:p-3 text-xs sm:text-sm transition-all duration-300 hover:scale-105 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500 data-[state=active]:text-white"
            >
              <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline font-medium">Analytics</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="p-4 sm:p-6">
          {canManageUsers && (
            <>
              <TabsContent value="user-management" className="mt-0 animate-fade-in">
                <RoleGuard requiredRole="super_admin">
                  <UserManagement />
                </RoleGuard>
              </TabsContent>

              <TabsContent value="role-management" className="mt-0 animate-fade-in">
                <RoleGuard requiredRole="super_admin">
                  <RoleManagement />
                </RoleGuard>
              </TabsContent>
            </>
          )}

          <TabsContent value="members" className="mt-0 animate-fade-in">
            <RoleGuard requiredRole="general_admin">
              <EnhancedMembersManagement members={[]} updateMemberStatus={async () => {}} />
            </RoleGuard>
          </TabsContent>

          <TabsContent value="community-admins" className="mt-0 animate-fade-in">
            <RoleGuard requiredRole="general_admin">
              <CommunityAdminManagement />
            </RoleGuard>
          </TabsContent>

          <TabsContent value="projects" className="mt-0 animate-fade-in">
            <RoleGuard requirePermission="project_review">
              <ProjectsManagement />
            </RoleGuard>
          </TabsContent>

          <TabsContent value="events" className="mt-0 animate-fade-in">
            <RoleGuard requirePermission="event_manage">
              <EnhancedEventsManagement />
            </RoleGuard>
          </TabsContent>

          <TabsContent value="payments" className="mt-0 animate-fade-in">
            <RoleGuard requirePermission="payment_processing">
              <PaymentsManagement payments={[]} />
            </RoleGuard>
          </TabsContent>

          <TabsContent value="admin-requests" className="mt-0 animate-fade-in">
            <RoleGuard requiredRole="general_admin">
              <EnhancedAdminRequestsManagement />
            </RoleGuard>
          </TabsContent>

          <TabsContent value="certificates" className="mt-0 animate-fade-in">
            <RoleGuard requirePermission="certificate_upload">
              <CertificateManager />
            </RoleGuard>
          </TabsContent>

          <TabsContent value="leaderboard" className="mt-0 animate-fade-in">
            <RoleGuard requiredRole="general_admin">
              <EnhancedLeaderboardManager />
            </RoleGuard>
          </TabsContent>

          <TabsContent value="notifications" className="mt-0 animate-fade-in">
            <RoleGuard requiredRole="general_admin">
              <WorldClassNotificationSystem />
            </RoleGuard>
          </TabsContent>

          <TabsContent value="mpesa-config" className="mt-0 animate-fade-in">
            <RoleGuard requiredRole="super_admin">
              <MPesaConfigManager />
            </RoleGuard>
          </TabsContent>

          <TabsContent value="blogs" className="mt-0 animate-fade-in">
            <RoleGuard requirePermission="blog_moderation">
              <BlogManagement />
            </RoleGuard>
          </TabsContent>

          <TabsContent value="careers" className="mt-0 animate-fade-in">
            <RoleGuard requiredRole="general_admin">
              <CareerManagement />
            </RoleGuard>
          </TabsContent>

          <TabsContent value="constitution" className="mt-0 animate-fade-in">
            <RoleGuard requiredRole="general_admin">
              <ConstitutionManagement />
            </RoleGuard>
          </TabsContent>

          <TabsContent value="elections" className="mt-0 animate-fade-in">
            <RoleGuard requiredRole="general_admin">
              <AdminElectionManagement />
            </RoleGuard>
          </TabsContent>

          <TabsContent value="submissions" className="mt-0 animate-fade-in">
            <RoleGuard requiredRole="general_admin">
              <SubmissionsManagement />
            </RoleGuard>
          </TabsContent>

          <TabsContent value="analytics" className="mt-0 animate-fade-in">
            <RoleGuard requirePermission="system_analytics">
              <AdminAnalytics />
            </RoleGuard>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
