
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

  return (
    <Tabs defaultValue={canManageUsers ? "user-management" : "members"} className="w-full">
      <TabsList className={`grid w-full ${canManageUsers ? 'grid-cols-9' : 'grid-cols-7'} bg-gradient-to-r from-green-50 to-yellow-50 border-green-200`}>
        {canManageUsers && (
          <>
            <TabsTrigger 
              value="user-management" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-orange-500 data-[state=active]:text-white"
            >
              <UserCog className="w-4 h-4 mr-2" />
              User Mgmt
            </TabsTrigger>
            <TabsTrigger 
              value="role-management" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
            >
              <Shield className="w-4 h-4 mr-2" />
              Roles
            </TabsTrigger>
          </>
        )}
        <TabsTrigger 
          value="members" 
          className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-yellow-500 data-[state=active]:text-white"
        >
          <Users className="w-4 h-4 mr-2" />
          Members
        </TabsTrigger>
        <TabsTrigger 
          value="projects"
          className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-yellow-500 data-[state=active]:text-white"
        >
          <Code2 className="w-4 h-4 mr-2" />
          Projects
        </TabsTrigger>
        <TabsTrigger 
          value="events"
          className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-yellow-500 data-[state=active]:text-white"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Events
        </TabsTrigger>
        <TabsTrigger 
          value="payments"
          className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-yellow-500 data-[state=active]:text-white"
        >
          <CreditCard className="w-4 h-4 mr-2" />
          Payments
        </TabsTrigger>
        <TabsTrigger 
          value="admin-requests"
          className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-yellow-500 data-[state=active]:text-white"
        >
          <UserCheck className="w-4 h-4 mr-2" />
          Requests
        </TabsTrigger>
        <TabsTrigger 
          value="leaderboard"
          className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-yellow-500 data-[state=active]:text-white"
        >
          <Trophy className="w-4 h-4 mr-2" />
          Leaderboard
        </TabsTrigger>
        <TabsTrigger 
          value="reset-leaderboard"
          className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-yellow-500 data-[state=active]:text-white"
        >
          <Target className="w-4 h-4 mr-2" />
          Reset
        </TabsTrigger>
      </TabsList>

      {canManageUsers && (
        <>
          <TabsContent value="user-management" className="mt-6">
            <UserManagement />
          </TabsContent>

          <TabsContent value="role-management" className="mt-6">
            <RoleManagement />
          </TabsContent>
        </>
      )}

      <TabsContent value="members" className="mt-6">
        <MembersManagement 
          members={members}
          updateMemberStatus={updateMemberStatus}
        />
      </TabsContent>

      <TabsContent value="projects" className="mt-6">
        <ProjectsManagement 
          projects={projects}
          updateProjectStatus={updateProjectStatus}
        />
      </TabsContent>

      <TabsContent value="events" className="mt-6">
        <EventsManagement events={events} />
      </TabsContent>

      <TabsContent value="payments" className="mt-6">
        <PaymentsManagement payments={payments} />
      </TabsContent>

      <TabsContent value="admin-requests" className="mt-6">
        <EnhancedAdminRequestsManagement />
      </TabsContent>

      <TabsContent value="leaderboard" className="mt-6">
        <EnhancedLeaderboardManager />
      </TabsContent>

      <TabsContent value="reset-leaderboard" className="mt-6">
        <LeaderboardResetManager />
      </TabsContent>
    </Tabs>
  );
};

export default AdminDashboardTabs;
