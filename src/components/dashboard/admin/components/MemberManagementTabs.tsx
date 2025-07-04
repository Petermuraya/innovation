
import { TabsContent } from '@/components/ui/tabs';
import RoleGuard from '@/components/security/RoleGuard';

const MemberManagementTabs = () => {
  return (
    <>
      <TabsContent value="member-approval" className="mt-0 animate-fade-in">
        <RoleGuard requiredRole="general_admin">
          <div className="text-center py-8">
            <h3 className="text-lg font-semibold">Member Approval</h3>
            <p className="text-muted-foreground">Member approval features will be available here.</p>
          </div>
        </RoleGuard>
      </TabsContent>

      <TabsContent value="member-points" className="mt-0 animate-fade-in">
        <RoleGuard requiredRole="general_admin">
          <div className="text-center py-8">
            <h3 className="text-lg font-semibold">Member Points</h3>
            <p className="text-muted-foreground">Member points management will be available here.</p>
          </div>
        </RoleGuard>
      </TabsContent>

      <TabsContent value="member-communications" className="mt-0 animate-fade-in">
        <RoleGuard requiredRole="general_admin">
          <div className="text-center py-8">
            <h3 className="text-lg font-semibold">Member Communications</h3>
            <p className="text-muted-foreground">Member communication tools will be available here.</p>
          </div>
        </RoleGuard>
      </TabsContent>
    </>
  );
};

export default MemberManagementTabs;
