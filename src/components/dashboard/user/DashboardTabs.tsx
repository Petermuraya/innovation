
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardOverview from './DashboardOverview';
import DashboardProfile from './DashboardProfile';
import DashboardCommunities from './DashboardCommunities';
import EnhancedDashboardProjects from './EnhancedDashboardProjects';
import DashboardEvents from './DashboardEvents';
import DashboardCareers from './DashboardCareers';
import DashboardBlogging from './DashboardBlogging';
import DashboardPayments from './DashboardPayments';
import DashboardCertificates from './DashboardCertificates';
import DashboardBadges from './DashboardBadges';
import { MemberData } from './types';

interface DashboardTabsProps {
  memberData: MemberData | null;
  notifications: any[];
  upcomingEvents: any[];
  projects: any[];
  certificates: any[];
  payments: any[];
  onDataUpdate: () => void;
}

const DashboardTabs = ({
  memberData,
  notifications,
  upcomingEvents,
  projects,
  certificates,
  payments,
  onDataUpdate,
}: DashboardTabsProps) => {
  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <div className="overflow-x-auto">
        <TabsList className="grid w-full grid-cols-4 sm:grid-cols-6 md:grid-cols-9 gap-1 h-auto p-1">
          <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
          <TabsTrigger value="profile" className="text-xs sm:text-sm">Profile</TabsTrigger>
          <TabsTrigger value="communities" className="text-xs sm:text-sm">Communities</TabsTrigger>
          <TabsTrigger value="projects" className="text-xs sm:text-sm">Projects</TabsTrigger>
          <TabsTrigger value="events" className="text-xs sm:text-sm">Events</TabsTrigger>
          <TabsTrigger value="careers" className="text-xs sm:text-sm">Careers</TabsTrigger>
          <TabsTrigger value="blogging" className="text-xs sm:text-sm">Blogging</TabsTrigger>
          <TabsTrigger value="payments" className="text-xs sm:text-sm">Payments</TabsTrigger>
          <TabsTrigger value="certificates" className="text-xs sm:text-sm">Certificates</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="overview">
        <DashboardOverview 
          notifications={notifications}
          upcomingEvents={upcomingEvents}
        />
      </TabsContent>

      <TabsContent value="profile">
        {memberData && (
          <DashboardProfile memberData={memberData} />
        )}
      </TabsContent>

      <TabsContent value="communities">
        <DashboardCommunities />
      </TabsContent>

      <TabsContent value="projects">
        <EnhancedDashboardProjects 
          projects={projects} 
          onSuccess={onDataUpdate} 
        />
      </TabsContent>

      <TabsContent value="events">
        <DashboardEvents />
      </TabsContent>

      <TabsContent value="careers">
        <DashboardCareers />
      </TabsContent>

      <TabsContent value="blogging">
        <DashboardBlogging />
      </TabsContent>

      <TabsContent value="payments">
        <DashboardPayments payments={payments} />
      </TabsContent>

      <TabsContent value="certificates">
        <div className="grid gap-6">
          <DashboardCertificates certificates={certificates} />
          <DashboardBadges />
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
