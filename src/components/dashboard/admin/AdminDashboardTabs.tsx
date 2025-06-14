
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MembersManagement from './MembersManagement';
import ProjectsManagement from './ProjectsManagement';
import EventsManagement from './EventsManagement';
import BlogManagement from './BlogManagement';
import PaymentsManagement from './PaymentsManagement';
import CareerManagement from './CareerManagement';
import CommunityAdminManagement from './CommunityAdminManagement';
import CertificateManager from './CertificateManager';
import MPesaConfigManager from './MPesaConfigManager';
import EnhancedAdminRequestsManagement from './EnhancedAdminRequestsManagement';
import WorldClassNotificationSystem from './WorldClassNotificationSystem';
import PointConfigurationManager from '@/components/admin/PointConfigurationManager';
import EnhancedLeaderboardManager from '@/components/admin/EnhancedLeaderboardManager';

interface AdminDashboardTabsProps {
  stats?: any;
  members?: any[];
  projects?: any[];
  payments?: any[];
  updateMemberStatus?: (memberId: string, status: string) => Promise<void>;
  updateProjectStatus?: (projectId: string, status: string) => Promise<void>;
}

const AdminDashboardTabs = ({ 
  stats, 
  members = [], 
  projects = [], 
  payments = [], 
  updateMemberStatus, 
  updateProjectStatus 
}: AdminDashboardTabsProps) => {
  return (
    <Tabs defaultValue="members" className="w-full">
      <TabsList className="grid w-full grid-cols-6 lg:grid-cols-13 mb-6">
        <TabsTrigger value="members">Members</TabsTrigger>
        <TabsTrigger value="projects">Projects</TabsTrigger>
        <TabsTrigger value="events">Events</TabsTrigger>
        <TabsTrigger value="blogs">Blogs</TabsTrigger>
        <TabsTrigger value="payments">Payments</TabsTrigger>
        <TabsTrigger value="careers">Careers</TabsTrigger>
        <TabsTrigger value="communities">Communities</TabsTrigger>
        <TabsTrigger value="certificates">Certificates</TabsTrigger>
        <TabsTrigger value="mpesa">M-Pesa</TabsTrigger>
        <TabsTrigger value="requests">Requests</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="points">Points</TabsTrigger>
        <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
      </TabsList>
      
      <TabsContent value="members">
        <MembersManagement members={members} updateMemberStatus={updateMemberStatus} />
      </TabsContent>
      
      <TabsContent value="projects">
        <ProjectsManagement projects={projects} updateProjectStatus={updateProjectStatus} />
      </TabsContent>
      
      <TabsContent value="events">
        <EventsManagement events={[]} />
      </TabsContent>
      
      <TabsContent value="blogs">
        <BlogManagement />
      </TabsContent>
      
      <TabsContent value="payments">
        <PaymentsManagement payments={payments} />
      </TabsContent>
      
      <TabsContent value="careers">
        <CareerManagement />
      </TabsContent>
      
      <TabsContent value="communities">
        <CommunityAdminManagement />
      </TabsContent>
      
      <TabsContent value="certificates">
        <CertificateManager />
      </TabsContent>
      
      <TabsContent value="mpesa">
        <MPesaConfigManager />
      </TabsContent>
      
      <TabsContent value="requests">
        <EnhancedAdminRequestsManagement />
      </TabsContent>
      
      <TabsContent value="notifications">
        <WorldClassNotificationSystem />
      </TabsContent>

      <TabsContent value="points">
        <PointConfigurationManager />
      </TabsContent>

      <TabsContent value="leaderboard">
        <EnhancedLeaderboardManager />
      </TabsContent>
    </Tabs>
  );
};

export default AdminDashboardTabs;
