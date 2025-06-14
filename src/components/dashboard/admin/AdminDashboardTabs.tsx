
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
      <TabsList className="grid w-full grid-cols-5 lg:grid-cols-11 mb-6">
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
    </Tabs>
  );
};

export default AdminDashboardTabs;
