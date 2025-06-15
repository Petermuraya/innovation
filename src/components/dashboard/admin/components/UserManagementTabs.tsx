
import { TabsContent } from '@/components/ui/tabs';
import RoleGuard from '@/components/security/RoleGuard';
import UserManagement from '../UserManagement';
import RoleManagement from '../RoleManagement';

interface UserManagementTabsProps {
  canManageUsers: boolean;
}

const UserManagementTabs = ({ canManageUsers }: UserManagementTabsProps) => {
  if (!canManageUsers) return null;

  return (
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
  );
};

export default UserManagementTabs;
