
import { TabsContent } from '@/components/ui/tabs';
import RoleGuard from '@/components/security/RoleGuard';
import EnhancedLeaderboardManager from '@/components/admin/EnhancedLeaderboardManager';
import PointConfigurationManager from '@/components/admin/PointConfigurationManager';
import AdminNotificationManager from '@/components/admin/notifications/AdminNotificationManager';
import NotificationTemplateManager from '@/components/admin/notifications/NotificationTemplateManager';
import ConstitutionManagement from '../ConstitutionManagement';
import AdminElectionManagement from '@/components/elections/AdminElectionManagement';
import AdminAnalytics from '../AdminAnalytics';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const SystemManagementTabs = () => {
  return (
    <>
      <TabsContent value="leaderboard" className="mt-0 animate-fade-in">
        <RoleGuard requiredRole="general_admin">
          <div className="space-y-6">
            <PointConfigurationManager />
            <EnhancedLeaderboardManager />
          </div>
        </RoleGuard>
      </TabsContent>

      <TabsContent value="notifications" className="mt-0 animate-fade-in">
        <RoleGuard requiredRole="general_admin">
          <div className="space-y-6">
            <Tabs defaultValue="manage" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="manage">Send Notifications</TabsTrigger>
                <TabsTrigger value="templates">Manage Templates</TabsTrigger>
              </TabsList>
              
              <TabsContent value="manage" className="mt-6">
                <AdminNotificationManager />
              </TabsContent>
              
              <TabsContent value="templates" className="mt-6">
                <NotificationTemplateManager />
              </TabsContent>
            </Tabs>
          </div>
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

      <TabsContent value="analytics" className="mt-0 animate-fade-in">
        <RoleGuard requirePermission="system_analytics">
          <AdminAnalytics />
        </RoleGuard>
      </TabsContent>
    </>
  );
};

export default SystemManagementTabs;
