
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MembersManagement from './MembersManagement';
import ProjectsManagement from './ProjectsManagement';
import PaymentsManagement from './PaymentsManagement';
import EnhancedEventsManagement from './EnhancedEventsManagement';
import BlogManagement from './BlogManagement';
import CertificateManager from './CertificateManager';
import EnhancedAdminRequestsManagement from './EnhancedAdminRequestsManagement';
import CommunityAdminManagement from './CommunityAdminManagement';
import MPesaConfigManager from './MPesaConfigManager';
import FeaturedProjectsManagement from './FeaturedProjectsManagement';

interface AdminDashboardTabsProps {
  stats: any;
  members: any[];
  projects: any[];
  payments: any[];
  updateMemberStatus: (memberId: string, status: string) => Promise<void>;
  updateProjectStatus: (projectId: string, status: string) => Promise<void>;
}

const AdminDashboardTabs = ({
  stats,
  members,
  projects,
  payments,
  updateMemberStatus,
  updateProjectStatus
}: AdminDashboardTabsProps) => {
  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <div className="overflow-x-auto">
        <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10 gap-1 h-auto p-1">
          <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
          <TabsTrigger value="members" className="text-xs sm:text-sm">Members</TabsTrigger>
          <TabsTrigger value="projects" className="text-xs sm:text-sm">Projects</TabsTrigger>
          <TabsTrigger value="featured" className="text-xs sm:text-sm">Featured</TabsTrigger>
          <TabsTrigger value="events" className="text-xs sm:text-sm">Events</TabsTrigger>
          <TabsTrigger value="blogs" className="text-xs sm:text-sm">Blogs</TabsTrigger>
          <TabsTrigger value="payments" className="text-xs sm:text-sm">Payments</TabsTrigger>
          <TabsTrigger value="certificates" className="text-xs sm:text-sm">Certificates</TabsTrigger>
          <TabsTrigger value="requests" className="text-xs sm:text-sm">Requests</TabsTrigger>
          <TabsTrigger value="settings" className="text-xs sm:text-sm">Settings</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="overview">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Add overview content here */}
        </div>
      </TabsContent>

      <TabsContent value="members">
        <MembersManagement members={members} updateMemberStatus={updateMemberStatus} />
      </TabsContent>

      <TabsContent value="projects">
        <ProjectsManagement projects={projects} updateProjectStatus={updateProjectStatus} />
      </TabsContent>

      <TabsContent value="featured">
        <FeaturedProjectsManagement />
      </TabsContent>

      <TabsContent value="events">
        <EnhancedEventsManagement />
      </TabsContent>

      <TabsContent value="blogs">
        <BlogManagement />
      </TabsContent>

      <TabsContent value="payments">
        <PaymentsManagement payments={payments} />
      </TabsContent>

      <TabsContent value="certificates">
        <CertificateManager />
      </TabsContent>

      <TabsContent value="requests">
        <EnhancedAdminRequestsManagement />
      </TabsContent>

      <TabsContent value="settings">
        <div className="space-y-6">
          <CommunityAdminManagement />
          <MPesaConfigManager />
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default AdminDashboardTabs;
