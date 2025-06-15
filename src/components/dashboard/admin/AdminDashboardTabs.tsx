import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Code2, 
  Calendar, 
  CreditCard, 
  Settings, 
  UserCheck, 
  Trophy,
  FileText,
  Target,
  Shield,
  UserCog,
  Award,
  Bell,
  DollarSign,
  BookOpen,
  Briefcase,
  MessageSquare,
  BarChart3,
  Vote,
  ScrollText
} from 'lucide-react';

import MembersManagement from './MembersManagement';
import ProjectsManagement from './ProjectsManagement';
import EnhancedEventsManagement from './EnhancedEventsManagement';
import PaymentsManagement from './PaymentsManagement';
import EnhancedAdminRequestsManagement from './EnhancedAdminRequestsManagement';
import EnhancedLeaderboardManager from '@/components/admin/EnhancedLeaderboardManager';
import LeaderboardResetManager from '@/components/admin/LeaderboardResetManager';
import UserManagement from './UserManagement';
import RoleManagement from './RoleManagement';
import CertificateManager from './CertificateManager';
import MPesaConfigManager from './MPesaConfigManager';
import BlogManagement from './BlogManagement';
import CareerManagement from './CareerManagement';
import WorldClassNotificationSystem from './WorldClassNotificationSystem';
import CommunityAdminManagement from './CommunityAdminManagement';
import ConstitutionManagement from './ConstitutionManagement';
import AdminElectionManagement from '@/components/elections/AdminElectionManagement';
import { useRolePermissions } from '@/hooks/useRolePermissions';

interface AdminDashboardTabsProps {
  stats: any;
  members: any[];
  projects: any[];
  payments: any[];
  updateMemberStatus: (memberId: string, status: string) => Promise<void>;
  updateProjectStatus: (projectId: string, status: string, feedback?: string) => Promise<void>;
}

const AdminDashboardTabs = ({ 
  stats, 
  members, 
  projects, 
  payments, 
  updateMemberStatus, 
  updateProjectStatus 
}: AdminDashboardTabsProps) => {
  const { isSuperAdmin, isChairman } = useRolePermissions();
  
  // Show user management tabs for super admins and chairman
  const canManageUsers = isSuperAdmin || isChairman;

  const tabTriggerClass = "relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg data-[state=active]:shadow-xl";

  return (
    <div className="w-full">
      <Tabs defaultValue={canManageUsers ? "user-management" : "members"} className="w-full">
        <div className="bg-gradient-to-r from-kic-green-50 to-kic-green-100 p-4 border-b border-kic-green-200">
          <TabsList className={`grid w-full ${canManageUsers ? 'grid-cols-6 lg:grid-cols-15' : 'grid-cols-5 lg:grid-cols-13'} bg-white/80 backdrop-blur-sm border border-kic-green-200 p-1 gap-1 h-auto`}>
            {canManageUsers && (
              <>
                <TabsTrigger 
                  value="user-management" 
                  className={`${tabTriggerClass} data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-orange-500 data-[state=active]:text-white flex flex-col sm:flex-row items-center gap-1 p-3 animate-fade-in`}
                >
                  <UserCog className="w-4 h-4" />
                  <span className="text-xs sm:text-sm font-medium">Users</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="role-management" 
                  className={`${tabTriggerClass} data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white flex flex-col sm:flex-row items-center gap-1 p-3 animate-fade-in`}
                  style={{animationDelay: '0.1s'}}
                >
                  <Shield className="w-4 h-4" />
                  <span className="text-xs sm:text-sm font-medium">Roles</span>
                </TabsTrigger>
              </>
            )}
            <TabsTrigger 
              value="members" 
              className={`${tabTriggerClass} data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white flex flex-col sm:flex-row items-center gap-1 p-3 animate-fade-in`}
              style={{animationDelay: canManageUsers ? '0.2s' : '0s'}}
            >
              <Users className="w-4 h-4" />
              <span className="text-xs sm:text-sm font-medium">Members</span>
            </TabsTrigger>
            <TabsTrigger 
              value="community-admins"
              className={`${tabTriggerClass} data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-600 data-[state=active]:text-white flex flex-col sm:flex-row items-center gap-1 p-3 animate-fade-in`}
              style={{animationDelay: canManageUsers ? '0.3s' : '0.1s'}}
            >
              <MessageSquare className="w-4 h-4" />
              <span className="text-xs sm:text-sm font-medium">Community</span>
            </TabsTrigger>
            <TabsTrigger 
              value="projects"
              className={`${tabTriggerClass} data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white flex flex-col sm:flex-row items-center gap-1 p-3 animate-fade-in`}
              style={{animationDelay: canManageUsers ? '0.4s' : '0.2s'}}
            >
              <Code2 className="w-4 h-4" />
              <span className="text-xs sm:text-sm font-medium">Projects</span>
            </TabsTrigger>
            <TabsTrigger 
              value="events"
              className={`${tabTriggerClass} data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white flex flex-col sm:flex-row items-center gap-1 p-3 animate-fade-in`}
              style={{animationDelay: canManageUsers ? '0.5s' : '0.3s'}}
            >
              <Calendar className="w-4 h-4" />
              <span className="text-xs sm:text-sm font-medium">Events</span>
            </TabsTrigger>
            <TabsTrigger 
              value="payments"
              className={`${tabTriggerClass} data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white flex flex-col sm:flex-row items-center gap-1 p-3 animate-fade-in`}
              style={{animationDelay: canManageUsers ? '0.6s' : '0.4s'}}
            >
              <CreditCard className="w-4 h-4" />
              <span className="text-xs sm:text-sm font-medium">Payments</span>
            </TabsTrigger>
            <TabsTrigger 
              value="admin-requests"
              className={`${tabTriggerClass} data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-500 data-[state=active]:to-pink-500 data-[state=active]:text-white flex flex-col sm:flex-row items-center gap-1 p-3 animate-fade-in`}
              style={{animationDelay: canManageUsers ? '0.7s' : '0.5s'}}
            >
              <UserCheck className="w-4 h-4" />
              <span className="text-xs sm:text-sm font-medium">Requests</span>
            </TabsTrigger>
            <TabsTrigger 
              value="certificates"
              className={`${tabTriggerClass} data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-yellow-500 data-[state=active]:text-white flex flex-col sm:flex-row items-center gap-1 p-3 animate-fade-in`}
              style={{animationDelay: canManageUsers ? '0.8s' : '0.6s'}}
            >
              <Award className="w-4 h-4" />
              <span className="text-xs sm:text-sm font-medium">Certificates</span>
            </TabsTrigger>
            <TabsTrigger 
              value="leaderboard"
              className={`${tabTriggerClass} data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-white flex flex-col sm:flex-row items-center gap-1 p-3 animate-fade-in`}
              style={{animationDelay: canManageUsers ? '0.9s' : '0.7s'}}
            >
              <Trophy className="w-4 h-4" />
              <span className="text-xs sm:text-sm font-medium">Leaderboard</span>
            </TabsTrigger>
            <TabsTrigger 
              value="notifications"
              className={`${tabTriggerClass} data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-rose-500 data-[state=active]:text-white flex flex-col sm:flex-row items-center gap-1 p-3 animate-fade-in`}
              style={{animationDelay: canManageUsers ? '1.0s' : '0.8s'}}
            >
              <Bell className="w-4 h-4" />
              <span className="text-xs sm:text-sm font-medium">Notifications</span>
            </TabsTrigger>
            <TabsTrigger 
              value="mpesa-config"
              className={`${tabTriggerClass} data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white flex flex-col sm:flex-row items-center gap-1 p-3 animate-fade-in`}
              style={{animationDelay: canManageUsers ? '1.1s' : '0.9s'}}
            >
              <DollarSign className="w-4 h-4" />
              <span className="text-xs sm:text-sm font-medium">M-Pesa</span>
            </TabsTrigger>
            <TabsTrigger 
              value="blogs"
              className={`${tabTriggerClass} data-[state=active]:bg-gradient-to-r data-[state=active]:from-slate-500 data-[state=active]:to-gray-600 data-[state=active]:text-white flex flex-col sm:flex-row items-center gap-1 p-3 animate-fade-in`}
              style={{animationDelay: canManageUsers ? '1.2s' : '1.0s'}}
            >
              <BookOpen className="w-4 h-4" />
              <span className="text-xs sm:text-sm font-medium">Blogs</span>
            </TabsTrigger>
            <TabsTrigger 
              value="careers"
              className={`${tabTriggerClass} data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-cyan-600 data-[state=active]:text-white flex flex-col sm:flex-row items-center gap-1 p-3 animate-fade-in`}
              style={{animationDelay: canManageUsers ? '1.3s' : '1.1s'}}
            >
              <Briefcase className="w-4 h-4" />
              <span className="text-xs sm:text-sm font-medium">Careers</span>
            </TabsTrigger>
            <TabsTrigger 
              value="constitution"
              className={`${tabTriggerClass} data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-blue-700 data-[state=active]:text-white flex flex-col sm:flex-row items-center gap-1 p-3 animate-fade-in`}
              style={{animationDelay: canManageUsers ? '1.4s' : '1.2s'}}
            >
              <ScrollText className="w-4 h-4" />
              <span className="text-xs sm:text-sm font-medium">Constitution</span>
            </TabsTrigger>
            <TabsTrigger 
              value="elections"
              className={`${tabTriggerClass} data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-indigo-700 data-[state=active]:text-white flex flex-col sm:flex-row items-center gap-1 p-3 animate-fade-in`}
              style={{animationDelay: canManageUsers ? '1.5s' : '1.3s'}}
            >
              <Vote className="w-4 h-4" />
              <span className="text-xs sm:text-sm font-medium">Elections</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="p-6">
          {canManageUsers && (
            <>
              <TabsContent value="user-management" className="mt-0 animate-fade-in">
                <UserManagement />
              </TabsContent>

              <TabsContent value="role-management" className="mt-0 animate-fade-in">
                <RoleManagement />
              </TabsContent>
            </>
          )}

          <TabsContent value="members" className="mt-0 animate-fade-in">
            <MembersManagement 
              members={members}
              updateMemberStatus={updateMemberStatus}
            />
          </TabsContent>

          <TabsContent value="community-admins" className="mt-0 animate-fade-in">
            <CommunityAdminManagement />
          </TabsContent>

          <TabsContent value="projects" className="mt-0 animate-fade-in">
            <ProjectsManagement />
          </TabsContent>

          <TabsContent value="events" className="mt-0 animate-fade-in">
            <EnhancedEventsManagement />
          </TabsContent>

          <TabsContent value="payments" className="mt-0 animate-fade-in">
            <PaymentsManagement payments={payments} />
          </TabsContent>

          <TabsContent value="admin-requests" className="mt-0 animate-fade-in">
            <EnhancedAdminRequestsManagement />
          </TabsContent>

          <TabsContent value="certificates" className="mt-0 animate-fade-in">
            <CertificateManager />
          </TabsContent>

          <TabsContent value="leaderboard" className="mt-0 animate-fade-in">
            <EnhancedLeaderboardManager />
          </TabsContent>

          <TabsContent value="notifications" className="mt-0 animate-fade-in">
            <WorldClassNotificationSystem />
          </TabsContent>

          <TabsContent value="mpesa-config" className="mt-0 animate-fade-in">
            <MPesaConfigManager />
          </TabsContent>

          <TabsContent value="blogs" className="mt-0 animate-fade-in">
            <BlogManagement />
          </TabsContent>

          <TabsContent value="careers" className="mt-0 animate-fade-in">
            <CareerManagement />
          </TabsContent>

          <TabsContent value="constitution" className="mt-0 animate-fade-in">
            <ConstitutionManagement />
          </TabsContent>

          <TabsContent value="elections" className="mt-0 animate-fade-in">
            <AdminElectionManagement />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default AdminDashboardTabs;
