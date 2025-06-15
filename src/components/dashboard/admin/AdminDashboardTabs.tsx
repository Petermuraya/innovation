
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
  UserCog
} from 'lucide-react';

import MembersManagement from './MembersManagement';
import ProjectsManagement from './ProjectsManagement';
import EventsManagement from './EventsManagement';
import PaymentsManagement from './PaymentsManagement';
import EnhancedAdminRequestsManagement from './EnhancedAdminRequestsManagement';
import EnhancedLeaderboardManager from '@/components/admin/EnhancedLeaderboardManager';
import LeaderboardResetManager from '@/components/admin/LeaderboardResetManager';
import UserManagement from './UserManagement';
import RoleManagement from './RoleManagement';
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
  
  // Mock events data - replace with actual events from your data source
  const events = [];

  // Show user management tabs for super admins and chairman
  const canManageUsers = isSuperAdmin || isChairman;

  const tabTriggerClass = "relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg data-[state=active]:shadow-xl";

  return (
    <div className="w-full">
      <Tabs defaultValue={canManageUsers ? "user-management" : "members"} className="w-full">
        <div className="bg-gradient-to-r from-kic-green-50 to-kic-green-100 p-4 border-b border-kic-green-200">
          <TabsList className={`grid w-full ${canManageUsers ? 'grid-cols-9' : 'grid-cols-7'} bg-white/80 backdrop-blur-sm border border-kic-green-200 p-1 gap-1 h-auto`}>
            {canManageUsers && (
              <>
                <TabsTrigger 
                  value="user-management" 
                  className={`${tabTriggerClass} data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-orange-500 data-[state=active]:text-white flex flex-col sm:flex-row items-center gap-1 p-3 animate-fade-in`}
                >
                  <UserCog className="w-4 h-4" />
                  <span className="text-xs sm:text-sm font-medium">User Mgmt</span>
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
              value="projects"
              className={`${tabTriggerClass} data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white flex flex-col sm:flex-row items-center gap-1 p-3 animate-fade-in`}
              style={{animationDelay: canManageUsers ? '0.3s' : '0.1s'}}
            >
              <Code2 className="w-4 h-4" />
              <span className="text-xs sm:text-sm font-medium">Projects</span>
            </TabsTrigger>
            <TabsTrigger 
              value="events"
              className={`${tabTriggerClass} data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white flex flex-col sm:flex-row items-center gap-1 p-3 animate-fade-in`}
              style={{animationDelay: canManageUsers ? '0.4s' : '0.2s'}}
            >
              <Calendar className="w-4 h-4" />
              <span className="text-xs sm:text-sm font-medium">Events</span>
            </TabsTrigger>
            <TabsTrigger 
              value="payments"
              className={`${tabTriggerClass} data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white flex flex-col sm:flex-row items-center gap-1 p-3 animate-fade-in`}
              style={{animationDelay: canManageUsers ? '0.5s' : '0.3s'}}
            >
              <CreditCard className="w-4 h-4" />
              <span className="text-xs sm:text-sm font-medium">Payments</span>
            </TabsTrigger>
            <TabsTrigger 
              value="admin-requests"
              className={`${tabTriggerClass} data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-500 data-[state=active]:to-pink-500 data-[state=active]:text-white flex flex-col sm:flex-row items-center gap-1 p-3 animate-fade-in`}
              style={{animationDelay: canManageUsers ? '0.6s' : '0.4s'}}
            >
              <UserCheck className="w-4 h-4" />
              <span className="text-xs sm:text-sm font-medium">Requests</span>
            </TabsTrigger>
            <TabsTrigger 
              value="leaderboard"
              className={`${tabTriggerClass} data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-white flex flex-col sm:flex-row items-center gap-1 p-3 animate-fade-in`}
              style={{animationDelay: canManageUsers ? '0.7s' : '0.5s'}}
            >
              <Trophy className="w-4 h-4" />
              <span className="text-xs sm:text-sm font-medium">Leaderboard</span>
            </TabsTrigger>
            <TabsTrigger 
              value="reset-leaderboard"
              className={`${tabTriggerClass} data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-rose-500 data-[state=active]:text-white flex flex-col sm:flex-row items-center gap-1 p-3 animate-fade-in`}
              style={{animationDelay: canManageUsers ? '0.8s' : '0.6s'}}
            >
              <Target className="w-4 h-4" />
              <span className="text-xs sm:text-sm font-medium">Reset</span>
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

          <TabsContent value="projects" className="mt-0 animate-fade-in">
            <ProjectsManagement 
              projects={projects}
              updateProjectStatus={updateProjectStatus}
            />
          </TabsContent>

          <TabsContent value="events" className="mt-0 animate-fade-in">
            <EventsManagement events={events} />
          </TabsContent>

          <TabsContent value="payments" className="mt-0 animate-fade-in">
            <PaymentsManagement payments={payments} />
          </TabsContent>

          <TabsContent value="admin-requests" className="mt-0 animate-fade-in">
            <EnhancedAdminRequestsManagement />
          </TabsContent>

          <TabsContent value="leaderboard" className="mt-0 animate-fade-in">
            <EnhancedLeaderboardManager />
          </TabsContent>

          <TabsContent value="reset-leaderboard" className="mt-0 animate-fade-in">
            <LeaderboardResetManager />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default AdminDashboardTabs;
