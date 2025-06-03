
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SecureRoute from '@/components/security/SecureRoute';
import CommunityAdminManagement from '@/components/admin/CommunityAdminManagement';
import RefactoredAdminRequestsManagement from '@/components/admin/RefactoredAdminRequestsManagement';
import MembersManagement from './MembersManagement';
import PaymentsManagement from './PaymentsManagement';
import ProjectsManagement from './ProjectsManagement';
import CertificateManager from './CertificateManager';
import MPesaConfigManager from './MPesaConfigManager';
import EnhancedEventsManagement from './EnhancedEventsManagement';

interface AdminDashboardTabsProps {
  stats: {
    pendingAdminRequests: number;
  };
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
  updateProjectStatus,
}: AdminDashboardTabsProps) => {
  return (
    <SecureRoute requiredRole="admin">
      <Tabs defaultValue="members" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
          <TabsTrigger value="mpesa">M-Pesa</TabsTrigger>
          <TabsTrigger value="community-admins">Community Admins</TabsTrigger>
          <TabsTrigger value="admin-requests">
            Admin Requests
            {stats.pendingAdminRequests > 0 && (
              <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                {stats.pendingAdminRequests}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members">
          <MembersManagement 
            members={members} 
            updateMemberStatus={updateMemberStatus} 
          />
        </TabsContent>

        <TabsContent value="events">
          <EnhancedEventsManagement />
        </TabsContent>

        <TabsContent value="projects">
          <ProjectsManagement 
            projects={projects} 
            updateProjectStatus={updateProjectStatus} 
          />
        </TabsContent>

        <TabsContent value="payments">
          <PaymentsManagement payments={payments} />
        </TabsContent>

        <TabsContent value="certificates">
          <CertificateManager />
        </TabsContent>

        <TabsContent value="mpesa">
          <MPesaConfigManager />
        </TabsContent>

        <TabsContent value="community-admins">
          <CommunityAdminManagement />
        </TabsContent>

        <TabsContent value="admin-requests">
          <RefactoredAdminRequestsManagement />
        </TabsContent>
      </Tabs>
    </SecureRoute>
  );
};

export default AdminDashboardTabs;
