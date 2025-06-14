
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import EnhancedMembersManagement from './EnhancedMembersManagement';
import ProjectsManagement from './ProjectsManagement';
import EventsManagement from './EventsManagement';
import BlogManagement from './BlogManagement';
import PaymentsManagement from './PaymentsManagement';
import CareerManagement from './CareerManagement';
import CommunityAdminManagement from './CommunityAdminManagement';
import CertificateManager from './CertificateManager';
import MPesaConfigManager from './MPesaConfigManager';
import EnhancedAdminRequestsManagement from './EnhancedAdminRequestsManagement';
import WorldClassNotificationSystem from './WorldClassNotificationSystem';
import PointConfigurationManager from '@/components/admin/PointConfigurationManager';
import EnhancedLeaderboardManager from '@/components/admin/EnhancedLeaderboardManager';
import AdminElectionManagement from '@/components/elections/AdminElectionManagement';
import { Badge } from '@/components/ui/badge';

interface AdminDashboardTabsProps {
  stats?: any;
  members?: any[];
  projects?: any[];
  payments?: any[];
  updateMemberStatus?: (memberId: string, status: string) => Promise<void>;
  updateProjectStatus?: (projectId: string, status: string) => Promise<void>;
}

const AdminDashboardTabs = ({ 
  stats, 
  members = [], 
  projects = [], 
  payments = [], 
  updateMemberStatus, 
  updateProjectStatus 
}: AdminDashboardTabsProps) => {
  const tabData = [
    { 
      value: 'members', 
      label: 'Members', 
      badge: stats?.pendingMembers > 0 ? stats.pendingMembers : null,
      badgeVariant: 'destructive' as const
    },
    { 
      value: 'projects', 
      label: 'Projects',
      badge: stats?.pendingProjects > 0 ? stats.pendingProjects : null,
      badgeVariant: 'secondary' as const
    },
    { value: 'events', label: 'Events' },
    { value: 'elections', label: 'Elections' },
    { value: 'blogs', label: 'Blogs' },
    { value: 'payments', label: 'Payments' },
    { value: 'careers', label: 'Careers' },
    { value: 'communities', label: 'Communities' },
    { value: 'certificates', label: 'Certificates' },
    { value: 'mpesa', label: 'M-Pesa' },
    { 
      value: 'requests', 
      label: 'Requests',
      badge: stats?.pendingAdminRequests > 0 ? stats.pendingAdminRequests : null,
      badgeVariant: 'destructive' as const
    },
    { value: 'notifications', label: 'Notifications' },
    { value: 'points', label: 'Points' },
    { value: 'leaderboard', label: 'Leaderboard' }
  ];

  return (
    <Tabs defaultValue="members" className="w-full">
      {/* Responsive Tab Navigation */}
      <div className="border-b bg-kic-lightGray/50 px-4 py-2">
        <ScrollArea className="w-full">
          <TabsList className="inline-flex h-auto min-w-full bg-transparent gap-1 p-1">
            {tabData.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="
                  relative flex items-center gap-2 px-3 py-2 text-xs sm:text-sm
                  data-[state=active]:bg-white data-[state=active]:text-kic-green-700
                  data-[state=active]:shadow-sm data-[state=active]:border
                  hover:bg-white/70 transition-all duration-200
                  whitespace-nowrap
                "
              >
                {tab.label}
                {tab.badge && (
                  <Badge 
                    variant={tab.badgeVariant} 
                    className="ml-1 h-4 min-w-4 px-1 text-xs leading-none"
                  >
                    {tab.badge}
                  </Badge>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </ScrollArea>
      </div>

      {/* Tab Content */}
      <div className="p-4 sm:p-6">
        <TabsContent value="members" className="mt-0">
          <EnhancedMembersManagement members={members} updateMemberStatus={updateMemberStatus} />
        </TabsContent>
        
        <TabsContent value="projects" className="mt-0">
          <ProjectsManagement projects={projects} updateProjectStatus={updateProjectStatus} />
        </TabsContent>
        
        <TabsContent value="events" className="mt-0">
          <EventsManagement events={[]} />
        </TabsContent>
        
        <TabsContent value="elections" className="mt-0">
          <AdminElectionManagement />
        </TabsContent>
        
        <TabsContent value="blogs" className="mt-0">
          <BlogManagement />
        </TabsContent>
        
        <TabsContent value="payments" className="mt-0">
          <PaymentsManagement payments={payments} />
        </TabsContent>
        
        <TabsContent value="careers" className="mt-0">
          <CareerManagement />
        </TabsContent>
        
        <TabsContent value="communities" className="mt-0">
          <CommunityAdminManagement />
        </TabsContent>
        
        <TabsContent value="certificates" className="mt-0">
          <CertificateManager />
        </TabsContent>
        
        <TabsContent value="mpesa" className="mt-0">
          <MPesaConfigManager />
        </TabsContent>
        
        <TabsContent value="requests" className="mt-0">
          <EnhancedAdminRequestsManagement />
        </TabsContent>
        
        <TabsContent value="notifications" className="mt-0">
          <WorldClassNotificationSystem />
        </TabsContent>

        <TabsContent value="points" className="mt-0">
          <PointConfigurationManager />
        </TabsContent>

        <TabsContent value="leaderboard" className="mt-0">
          <EnhancedLeaderboardManager />
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default AdminDashboardTabs;
