
import { TabsContent } from '@/components/ui/tabs';
import RoleGuard from '@/components/security/RoleGuard';
import EnhancedLeaderboardManager from '@/components/admin/EnhancedLeaderboardManager';
import PointConfigurationManager from '@/components/admin/PointConfigurationManager';
import WorldClassNotificationSystem from '../WorldClassNotificationSystem';
import ConstitutionManagement from '../ConstitutionManagement';
import AdminElectionManagement from '@/components/elections/AdminElectionManagement';
import AdminAnalytics from '../AdminAnalytics';

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
          <WorldClassNotificationSystem />
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
