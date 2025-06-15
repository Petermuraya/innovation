
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Calendar, 
  FolderOpen, 
  Award, 
  CreditCard, 
  MessageCircle, 
  FileText,
  Users,
  Vote,
  PenTool,
  Briefcase
} from 'lucide-react';
import DashboardOverview from './DashboardOverview';
import DashboardProfile from './DashboardProfile';
import DashboardEvents from './DashboardEvents';
import EnhancedDashboardProjects from './EnhancedDashboardProjects';
import DashboardCertificates from './DashboardCertificates';
import DashboardPayments from './DashboardPayments';
import DashboardConstitution from './DashboardConstitution';
import DashboardCommunities from './DashboardCommunities';
import DashboardElections from './DashboardElections';
import DashboardBlogging from './DashboardBlogging';
import DashboardCareers from './DashboardCareers';
import DashboardSubmissions from './DashboardSubmissions';

interface DashboardTabsProps {
  memberData: any;
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
  onDataUpdate 
}: DashboardTabsProps) => {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-6 lg:grid-cols-12 mb-6">
        <TabsTrigger value="overview" className="flex items-center gap-2">
          <User className="w-4 h-4" />
          <span className="hidden sm:inline">Overview</span>
        </TabsTrigger>
        <TabsTrigger value="profile" className="flex items-center gap-2">
          <User className="w-4 h-4" />
          <span className="hidden sm:inline">Profile</span>
        </TabsTrigger>
        <TabsTrigger value="events" className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span className="hidden sm:inline">Events</span>
        </TabsTrigger>
        <TabsTrigger value="projects" className="flex items-center gap-2">
          <FolderOpen className="w-4 h-4" />
          <span className="hidden sm:inline">Projects</span>
        </TabsTrigger>
        <TabsTrigger value="certificates" className="flex items-center gap-2">
          <Award className="w-4 h-4" />
          <span className="hidden sm:inline">Certificates</span>
        </TabsTrigger>
        <TabsTrigger value="payments" className="flex items-center gap-2">
          <CreditCard className="w-4 h-4" />
          <span className="hidden sm:inline">Payments</span>
        </TabsTrigger>
        <TabsTrigger value="submissions" className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Submissions</span>
        </TabsTrigger>
        <TabsTrigger value="constitution" className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          <span className="hidden sm:inline">Constitution</span>
        </TabsTrigger>
        <TabsTrigger value="communities" className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span className="hidden sm:inline">Communities</span>
        </TabsTrigger>
        <TabsTrigger value="elections" className="flex items-center gap-2">
          <Vote className="w-4 h-4" />
          <span className="hidden sm:inline">Elections</span>
        </TabsTrigger>
        <TabsTrigger value="blogging" className="flex items-center gap-2">
          <PenTool className="w-4 h-4" />
          <span className="hidden sm:inline">Blogging</span>
        </TabsTrigger>
        <TabsTrigger value="careers" className="flex items-center gap-2">
          <Briefcase className="w-4 h-4" />
          <span className="hidden sm:inline">Careers</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <DashboardOverview 
          upcomingEvents={upcomingEvents}
        />
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
    </Tabs>
  );
};

export default DashboardTabs;
