
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Calendar, 
  FolderOpen, 
  Award, 
  CreditCard, 
  UserCheck,
  FileText,
  MessageSquare
} from 'lucide-react';
import MembersManagement from './MembersManagement';
import EnhancedEventsManagement from './EnhancedEventsManagement';
import ProjectsManagement from './ProjectsManagement';
import CertificateManager from './CertificateManager';
import PaymentsManagement from './PaymentsManagement';
import EnhancedAdminRequestsManagement from './EnhancedAdminRequestsManagement';
import RoleManagement from './RoleManagement';
import SubmissionsManagement from './SubmissionsManagement';

interface AdminDashboardTabsProps {
  stats: any;
  members: any[];
  projects: any[];
  payments: any[];
  updateMemberStatus: (memberId: string, status: string) => Promise<void>;
  updateProjectStatus: (projectId: string, status: string, feedback?: string) => Promise<void>;
}

const AdminDashboardTabs = ({ 
  stats, 
  members, 
  projects, 
  payments, 
  updateMemberStatus, 
  updateProjectStatus 
}: AdminDashboardTabsProps) => {
  return (
    <Tabs defaultValue="members" className="w-full">
      <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 mb-6">
        <TabsTrigger value="members" className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span className="hidden sm:inline">Members</span>
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
          <MessageSquare className="w-4 h-4" />
          <span className="hidden sm:inline">Submissions</span>
        </TabsTrigger>
        <TabsTrigger value="admin-requests" className="flex items-center gap-2">
          <UserCheck className="w-4 h-4" />
          <span className="hidden sm:inline">Admin Requests</span>
        </TabsTrigger>
        <TabsTrigger value="roles" className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          <span className="hidden sm:inline">Roles</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="members">
        <MembersManagement 
          members={members}
          updateMemberStatus={updateMemberStatus}
        />
      </TabsContent>

      <TabsContent value="events">
        <EnhancedEventsManagement />
      </TabsContent>

      <TabsContent value="projects">
        <ProjectsManagement 
          projects={projects}
          updateProjectStatus={updateProjectStatus}
        />
      </TabsContent>

      <TabsContent value="certificates">
        <CertificateManager />
      </TabsContent>

      <TabsContent value="payments">
        <PaymentsManagement payments={payments} />
      </TabsContent>

      <TabsContent value="submissions">
        <SubmissionsManagement />
      </TabsContent>

      <TabsContent value="admin-requests">
        <EnhancedAdminRequestsManagement />
      </TabsContent>

      <TabsContent value="roles">
        <RoleManagement />
      </TabsContent>
    </Tabs>
  );
};

export default AdminDashboardTabs;
