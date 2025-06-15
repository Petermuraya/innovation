
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CommunityMembersTab from './CommunityMembersTab';
import CommunityEventsTab from './CommunityEventsTab';
import CommunityProjectsTab from './CommunityProjectsTab';
import CommunityAttendanceEnhanced from './attendance/CommunityAttendanceEnhanced';
import CommunityActivitiesTab from './activities/CommunityActivitiesTab';
import CommunityWorkshopsTab from './workshops/CommunityWorkshopsTab';
import CommunityResourcesTab from './resources/CommunityResourcesTab';
import CommunityRemindersTab from './CommunityRemindersTab';
import CommunityOnlineMeetingsTab from './meetings/CommunityOnlineMeetingsTab';
import BackToDashboard from './BackToDashboard';
import { useCommunityAdminData } from '@/hooks/useCommunityAdminData';
import { useCommunityPointTracking } from '@/hooks/useCommunityPointTracking';

interface CommunityDashboardTabsProps {
  communityId: string;
}

const CommunityDashboardTabs = ({ communityId }: CommunityDashboardTabsProps) => {
  const { isAdmin } = useCommunityAdminData(communityId);
  
  // Track community dashboard visit and get attendance marking function
  useCommunityPointTracking(communityId);

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <BackToDashboard />
      </div>
      
      <Tabs defaultValue="members" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-9">
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="workshops">Workshops</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="meetings">Meetings</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="reminders">Reminders</TabsTrigger>
        </TabsList>

        <TabsContent value="members">
          <CommunityMembersTab communityId={communityId} isAdmin={isAdmin} />
        </TabsContent>

        <TabsContent value="activities">
          <CommunityActivitiesTab communityId={communityId} isAdmin={isAdmin} />
        </TabsContent>

        <TabsContent value="workshops">
          <CommunityWorkshopsTab communityId={communityId} isAdmin={isAdmin} />
        </TabsContent>

        <TabsContent value="events">
          <CommunityEventsTab communityId={communityId} isAdmin={isAdmin} />
        </TabsContent>

        <TabsContent value="meetings">
          <CommunityOnlineMeetingsTab communityId={communityId} isAdmin={isAdmin} />
        </TabsContent>

        <TabsContent value="projects">
          <CommunityProjectsTab communityId={communityId} isAdmin={isAdmin} />
        </TabsContent>

        <TabsContent value="resources">
          <CommunityResourcesTab communityId={communityId} isAdmin={isAdmin} />
        </TabsContent>

        <TabsContent value="attendance">
          <CommunityAttendanceEnhanced communityId={communityId} isAdmin={isAdmin} />
        </TabsContent>

        <TabsContent value="reminders">
          <CommunityRemindersTab communityId={communityId} isAdmin={isAdmin} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunityDashboardTabs;
