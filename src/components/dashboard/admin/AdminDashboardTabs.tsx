
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Calendar, FolderOpen, DollarSign, Settings, UserCog, Star, User, FileText } from 'lucide-react';
import EnhancedMembersManagement from './EnhancedMembersManagement';
import EnhancedEventsManagement from './EnhancedEventsManagement';
import ProjectsManagement from './ProjectsManagement';
import PaymentsManagement from './PaymentsManagement';
import RoleManagement from './RoleManagement';
import FeaturedProjectsManagement from './FeaturedProjectsManagement';
import BlogManagement from './BlogManagement';
import DashboardProfile from '../user/DashboardProfile';
import { useMemberData } from '../user/hooks/useMemberData';

interface AdminDashboardTabsProps {
  stats: any;
  members: any[];
  projects: any[];
  payments: any[];
  updateMemberStatus: (memberId: string, status: string) => Promise<void>;
  updateProjectStatus: (projectId: string, status: string) => Promise<void>;
}

const AdminDashboardTabs = ({
  stats,
  members,
  projects,
  payments,
  updateMemberStatus,
  updateProjectStatus
}: AdminDashboardTabsProps) => {
  const { memberData, refetchMemberData } = useMemberData();

  const tabs = [
    {
      id: 'members',
      label: 'Members',
      icon: <Users className="w-4 h-4" />,
      component: (
        <EnhancedMembersManagement
          members={members}
          updateMemberStatus={updateMemberStatus}
        />
      )
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: <FolderOpen className="w-4 h-4" />,
      component: (
        <ProjectsManagement
          projects={projects}
          updateProjectStatus={updateProjectStatus}
        />
      )
    },
    {
      id: 'featured',
      label: 'Featured',
      icon: <Star className="w-4 h-4" />,
      component: <FeaturedProjectsManagement />
    },
    {
      id: 'blogs',
      label: 'Blogs',
      icon: <FileText className="w-4 h-4" />,
      component: <BlogManagement />
    },
    {
      id: 'events',
      label: 'Events',
      icon: <Calendar className="w-4 h-4" />,
      component: <EnhancedEventsManagement />
    },
    {
      id: 'payments',
      label: 'Payments',
      icon: <DollarSign className="w-4 h-4" />,
      component: <PaymentsManagement payments={payments} />
    },
    {
      id: 'roles',
      label: 'Roles',
      icon: <UserCog className="w-4 h-4" />,
      component: <RoleManagement />
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: <User className="w-4 h-4" />,
      component: memberData ? (
        <DashboardProfile 
          memberData={memberData} 
          onDataUpdate={refetchMemberData}
        />
      ) : (
        <div className="text-center py-8">Loading profile...</div>
      )
    }
  ];

  return (
    <div className="w-full">
      <Tabs defaultValue="members" className="w-full">
        <TabsList className="grid w-full grid-cols-8 h-auto p-1 bg-kic-lightGray/30">
          {tabs.map((tab) => (
            <TabsTrigger 
              key={tab.id}
              value={tab.id} 
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all data-[state=active]:bg-white data-[state=active]:text-kic-green-700 data-[state=active]:shadow-sm"
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="mt-6 space-y-6">
            {tab.component}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default AdminDashboardTabs;
