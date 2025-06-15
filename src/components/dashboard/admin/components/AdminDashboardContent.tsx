
import { TabsContent } from '@/components/ui/tabs';
import RoleGuard from '@/components/security/RoleGuard';
import EnhancedMembersManagement from '../EnhancedMembersManagement';
import EnhancedEventsManagement from '../EnhancedEventsManagement';
import ProjectsManagement from '../ProjectsManagement';
import CertificateManager from '../CertificateManager';
import PaymentsManagement from '../PaymentsManagement';
import RoleManagement from '../RoleManagement';
import AdminAnalytics from '../AdminAnalytics';
import AdminBlogManagement from '../AdminBlogManagement';
import SubmissionsManagement from '../SubmissionsManagement';
import UserManagement from '../UserManagement';
import EnhancedAdminRequestsManagement from '../EnhancedAdminRequestsManagement';
import EnhancedLeaderboardManager from '@/components/admin/EnhancedLeaderboardManager';
import WorldClassNotificationSystem from '../WorldClassNotificationSystem';
import MPesaConfigManager from '../MPesaConfigManager';
import BlogManagement from '../BlogManagement';
import CareerManagement from '../CareerManagement';
import CommunityAdminManagement from '../CommunityAdminManagement';
import ConstitutionManagement from '../ConstitutionManagement';
import AdminElectionManagement from '@/components/elections/AdminElectionManagement';

interface AdminDashboardContentProps {
  canManageUsers: boolean;
}

const AdminDashboardContent = ({ canManageUsers }: AdminDashboardContentProps) => {
  return (
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
  );
};

export default AdminDashboardContent;
