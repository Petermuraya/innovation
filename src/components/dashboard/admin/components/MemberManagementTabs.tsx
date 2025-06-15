
import { TabsContent } from '@/components/ui/tabs';
import RoleGuard from '@/components/security/RoleGuard';
import EnhancedMembersManagement from '../EnhancedMembersManagement';
import CommunityAdminManagement from '../CommunityAdminManagement';
import EnhancedAdminRequestsManagement from '../EnhancedAdminRequestsManagement';

const MemberManagementTabs = () => {
  return (
    <>
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

      <TabsContent value="admin-requests" className="mt-0 animate-fade-in">
        <RoleGuard requiredRole="general_admin">
          <EnhancedAdminRequestsManagement />
        </RoleGuard>
      </TabsContent>
    </>
  );
};

export default MemberManagementTabs;
