
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SecureRoute from '@/components/security/SecureRoute';
import CommunityAdminManagement from './CommunityAdminManagement';
import RefactoredAdminRequestsManagement from '@/components/admin/RefactoredAdminRequestsManagement';
import MembersManagement from './MembersManagement';
import PaymentsManagement from './PaymentsManagement';
import ProjectsManagement from './ProjectsManagement';
import CertificateManager from './CertificateManager';
import MPesaConfigManager from './MPesaConfigManager';
import EnhancedEventsManagement from './EnhancedEventsManagement';
import UserManagement from './UserManagement';
import BlogManagement from './BlogManagement';

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
        <div className="overflow-x-auto">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-9 gap-1 h-auto p-1">
            <TabsTrigger value="members" className="text-xs sm:text-sm">Members</TabsTrigger>
            <TabsTrigger value="events" className="text-xs sm:text-sm">Events</TabsTrigger>
            <TabsTrigger value="projects" className="text-xs sm:text-sm">Projects</TabsTrigger>
            <TabsTrigger value="payments" className="text-xs sm:text-sm">Payments</TabsTrigger>
            <TabsTrigger value="blogs" className="text-xs sm:text-sm">Blogs</TabsTrigger>
            <TabsTrigger value="users" className="text-xs sm:text-sm">Users</TabsTrigger>
            <TabsTrigger value="certificates" className="text-xs sm:text-sm">Certificates</TabsTrigger>
            <TabsTrigger value="mpesa" className="text-xs sm:text-sm">M-Pesa</TabsTrigger>
            <TabsTrigger value="community-admins" className="text-xs sm:text-sm">Community Admins</TabsTrigger>
            <TabsTrigger value="admin-requests" className="text-xs sm:text-sm relative">
              Admin Requests
              {stats.pendingAdminRequests > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] h-[18px] flex items-center justify-center">
                  {stats.pendingAdminRequests}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
        </div>

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

        <TabsContent value="blogs">
          <BlogManagement />
        </TabsContent>

        <TabsContent value="users">
          <UserManagement />
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
