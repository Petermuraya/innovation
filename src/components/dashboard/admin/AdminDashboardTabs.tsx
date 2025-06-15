
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
  Target
} from 'lucide-react';

import MembersManagement from './MembersManagement';
import ProjectsManagement from './ProjectsManagement';
import EventsManagement from './EventsManagement';
import PaymentsManagement from './PaymentsManagement';
import EnhancedAdminRequestsManagement from './EnhancedAdminRequestsManagement';
import EnhancedLeaderboardManager from '@/components/admin/EnhancedLeaderboardManager';
import LeaderboardResetManager from '@/components/admin/LeaderboardResetManager';

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
  // Mock events data - replace with actual events from your data source
  const events = [];

  return (
    <Tabs defaultValue="members" className="w-full">
      <TabsList className="grid w-full grid-cols-7 bg-gradient-to-r from-green-50 to-yellow-50 border-green-200">
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
