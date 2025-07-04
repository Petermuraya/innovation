
import { TabsContent } from '@/components/ui/tabs';
import RoleGuard from '@/components/security/RoleGuard';

const SystemManagementTabs = () => {
  return (
    <>
      <TabsContent value="system-settings" className="mt-0 animate-fade-in">
        <RoleGuard requiredRole="general_admin">
          <div className="text-center py-8">
            <h3 className="text-lg font-semibold">System Settings</h3>
            <p className="text-muted-foreground">System configuration options will be available here.</p>
          </div>
        </RoleGuard>
      </TabsContent>

      <TabsContent value="system-analytics" className="mt-0 animate-fade-in">
        <RoleGuard requiredRole="general_admin">
          <div className="text-center py-8">
            <h3 className="text-lg font-semibold">System Analytics</h3>
            <p className="text-muted-foreground">System analytics and reports will be available here.</p>
          </div>
        </RoleGuard>
      </TabsContent>

      <TabsContent value="backup-restore" className="mt-0 animate-fade-in">
        <RoleGuard requiredRole="general_admin">
          <div className="text-center py-8">
            <h3 className="text-lg font-semibold">Backup & Restore</h3>
            <p className="text-muted-foreground">Backup and restore functionality will be available here.</p>
          </div>
        </RoleGuard>
      </TabsContent>

      <TabsContent value="integrations" className="mt-0 animate-fade-in">
        <RoleGuard requiredRole="general_admin">
          <div className="text-center py-8">
            <h3 className="text-lg font-semibold">Integrations</h3>
            <p className="text-muted-foreground">Third-party integrations will be managed here.</p>
          </div>
        </RoleGuard>
      </TabsContent>

      <TabsContent value="logs" className="mt-0 animate-fade-in">
        <RoleGuard requiredPermission="full_system_access">
          <div className="text-center py-8">
            <h3 className="text-lg font-semibold">System Logs</h3>
            <p className="text-muted-foreground">System logs and audit trails will be available here.</p>
          </div>
        </RoleGuard>
      </TabsContent>
    </>
  );
};

export default SystemManagementTabs;
