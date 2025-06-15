
import { TabsContent } from '@/components/ui/tabs';
import DashboardOverview from '../DashboardOverview';
import DashboardProfile from '../DashboardProfile';
import DashboardEvents from '../DashboardEvents';
import EnhancedDashboardProjects from '../EnhancedDashboardProjects';
import DashboardCertificates from '../DashboardCertificates';
import DashboardPayments from '../DashboardPayments';
import DashboardSubmissions from '../DashboardSubmissions';
import DashboardConstitution from '../DashboardConstitution';
import DashboardCommunities from '../DashboardCommunities';
import DashboardElections from '../DashboardElections';
import DashboardBlogging from '../DashboardBlogging';
import DashboardCareers from '../DashboardCareers';
import { DashboardTabsProps } from '../types/dashboardTabs';

interface DashboardTabsContentProps extends DashboardTabsProps {}

const DashboardTabsContent = ({ 
  memberData, 
  notifications, 
  upcomingEvents, 
  projects, 
  certificates, 
  payments, 
  onDataUpdate 
}: DashboardTabsContentProps) => {
  return (
    <>
      <TabsContent value="overview">
        <DashboardOverview />
      </TabsContent>

      <TabsContent value="profile">
        <DashboardProfile memberData={memberData} onDataUpdate={onDataUpdate} />
      </TabsContent>

      <TabsContent value="events">
        <DashboardEvents />
      </TabsContent>

      <TabsContent value="projects">
        <EnhancedDashboardProjects projects={projects} onSuccess={onDataUpdate} />
      </TabsContent>

      <TabsContent value="certificates">
        <DashboardCertificates certificates={certificates} />
      </TabsContent>

      <TabsContent value="payments">
        <DashboardPayments payments={payments} />
      </TabsContent>

      <TabsContent value="submissions">
        <DashboardSubmissions />
      </TabsContent>

      <TabsContent value="constitution">
        <DashboardConstitution />
      </TabsContent>

      <TabsContent value="communities">
        <DashboardCommunities />
      </TabsContent>

      <TabsContent value="elections">
        <DashboardElections />
      </TabsContent>

      <TabsContent value="blogging">
        <DashboardBlogging />
      </TabsContent>

      <TabsContent value="careers">
        <DashboardCareers />
      </TabsContent>
    </>
  );
};

export default DashboardTabsContent;
