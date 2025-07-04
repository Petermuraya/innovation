
import { TabsContent } from '@/components/ui/tabs';
import RoleGuard from '@/components/security/RoleGuard';
import PaymentsManagement from '../PaymentsManagement';
import MPesaConfigManager from '../MPesaConfigManager';

const FinancialManagementTabs = () => {
  return (
    <>
      <TabsContent value="payments" className="mt-0 animate-fade-in">
        <RoleGuard requiredPermission="manage_payments">
          <PaymentsManagement payments={[]} />
        </RoleGuard>
      </TabsContent>

      <TabsContent value="mpesa-config" className="mt-0 animate-fade-in">
        <RoleGuard requiredRole="finance_admin">
          <MPesaConfigManager />
        </RoleGuard>
      </TabsContent>
    </>
  );
};

export default FinancialManagementTabs;
