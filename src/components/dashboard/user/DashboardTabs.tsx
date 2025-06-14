
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
import DashboardElections from './DashboardElections';
import DashboardConstitution from './DashboardConstitution';
import { MemberData } from './types';
import { Badge } from '@/components/ui/badge';
import { Vote, FileText } from 'lucide-react';

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
  console.log("DashboardTabs rendering - Elections tab should be visible");
  
  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <div className="overflow-x-auto">
        <TabsList className="grid w-full grid-cols-5 sm:grid-cols-6 md:grid-cols-12 gap-1 h-auto p-1">
          <TabsTrigger value="overview" className="text-xs sm:text-sm">
            Overview
          </TabsTrigger>
          <TabsTrigger value="profile" className="text-xs sm:text-sm">
            Profile
          </TabsTrigger>
          <TabsTrigger value="communities" className="text-xs sm:text-sm">
            Communities
          </TabsTrigger>
          <TabsTrigger value="projects" className="text-xs sm:text-sm">
            Projects
          </TabsTrigger>
          <TabsTrigger value="events" className="text-xs sm:text-sm">
            Events
          </TabsTrigger>
          <TabsTrigger 
            value="elections" 
            className="text-xs sm:text-sm bg-gradient-to-r from-kic-green-100 to-kic-green-200 text-kic-green-800 font-semibold border border-kic-green-300 hover:from-kic-green-200 hover:to-kic-green-300 transition-all duration-200"
          >
            <Vote className="w-3 h-3 mr-1" />
            Elections
            <Badge variant="secondary" className="ml-1 text-xs bg-kic-green-600 text-white">
              NEW
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="constitution" className="text-xs sm:text-sm">
            <FileText className="w-3 h-3 mr-1" />
            Constitution
          </TabsTrigger>
          <TabsTrigger value="careers" className="text-xs sm:text-sm">
            Careers
          </TabsTrigger>
          <TabsTrigger value="blogging" className="text-xs sm:text-sm">
            Blogging
          </TabsTrigger>
          <TabsTrigger value="payments" className="text-xs sm:text-sm">
            Payments
          </TabsTrigger>
          <TabsTrigger value="certificates" className="text-xs sm:text-sm">
            Certificates
          </TabsTrigger>
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

      <TabsContent value="elections">
        <DashboardElections />
      </TabsContent>

      <TabsContent value="constitution">
        <DashboardConstitution />
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
