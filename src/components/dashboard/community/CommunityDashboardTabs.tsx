
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
    <div className="space-y-4 sm:space-y-6 w-full">
      <div className="flex justify-end">
        <BackToDashboard />
      </div>
      
      <Tabs defaultValue="members" className="space-y-4 sm:space-y-6 w-full">
        <div className="overflow-x-auto">
          <TabsList className="grid w-full min-w-max grid-cols-9 gap-1 h-auto p-1">
            <TabsTrigger value="members" className="text-xs whitespace-nowrap px-2 py-1">
              Members
            </TabsTrigger>
            <TabsTrigger value="activities" className="text-xs whitespace-nowrap px-2 py-1">
              Activities
            </TabsTrigger>
            <TabsTrigger value="workshops" className="text-xs whitespace-nowrap px-2 py-1">
              Workshops
            </TabsTrigger>
            <TabsTrigger value="events" className="text-xs whitespace-nowrap px-2 py-1">
              Events
            </TabsTrigger>
            <TabsTrigger value="meetings" className="text-xs whitespace-nowrap px-2 py-1">
              Meetings
            </TabsTrigger>
            <TabsTrigger value="projects" className="text-xs whitespace-nowrap px-2 py-1">
              Projects
            </TabsTrigger>
            <TabsTrigger value="resources" className="text-xs whitespace-nowrap px-2 py-1">
              Resources
            </TabsTrigger>
            <TabsTrigger value="attendance" className="text-xs whitespace-nowrap px-2 py-1">
              Attendance
            </TabsTrigger>
            <TabsTrigger value="reminders" className="text-xs whitespace-nowrap px-2 py-1">
              Reminders
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="members" className="w-full">
          <CommunityMembersTab communityId={communityId} isAdmin={isAdmin} />
        </TabsContent>

        <TabsContent value="activities" className="w-full">
          <CommunityActivitiesTab communityId={communityId} isAdmin={isAdmin} />
        </TabsContent>

        <TabsContent value="workshops" className="w-full">
          <CommunityWorkshopsTab communityId={communityId} isAdmin={isAdmin} />
        </TabsContent>

        <TabsContent value="events" className="w-full">
          <CommunityEventsTab communityId={communityId} isAdmin={isAdmin} />
        </TabsContent>

        <TabsContent value="meetings" className="w-full">
          <CommunityOnlineMeetingsTab communityId={communityId} isAdmin={isAdmin} />
        </TabsContent>

        <TabsContent value="projects" className="w-full">
          <CommunityProjectsTab communityId={communityId} isAdmin={isAdmin} />
        </TabsContent>

        <TabsContent value="resources" className="w-full">
          <CommunityResourcesTab communityId={communityId} isAdmin={isAdmin} />
        </TabsContent>

        <TabsContent value="attendance" className="w-full">
          <CommunityAttendanceEnhanced communityId={communityId} isAdmin={isAdmin} />
        </TabsContent>

        <TabsContent value="reminders" className="w-full">
          <CommunityRemindersTab communityId={communityId} isAdmin={isAdmin} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunityDashboardTabs;
