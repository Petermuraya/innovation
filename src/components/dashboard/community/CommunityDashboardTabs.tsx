
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
        {/* Mobile: Scrollable horizontal tabs */}
        <div className="block lg:hidden">
          <div className="overflow-x-auto scrollbar-hide">
            <TabsList className="inline-flex h-12 items-center justify-start rounded-md bg-muted p-1 min-w-max">
              <TabsTrigger value="members" className="px-3 py-2 text-sm whitespace-nowrap">
                Members
              </TabsTrigger>
              <TabsTrigger value="activities" className="px-3 py-2 text-sm whitespace-nowrap">
                Activities
              </TabsTrigger>
              <TabsTrigger value="workshops" className="px-3 py-2 text-sm whitespace-nowrap">
                Workshops
              </TabsTrigger>
              <TabsTrigger value="events" className="px-3 py-2 text-sm whitespace-nowrap">
                Events
              </TabsTrigger>
              <TabsTrigger value="meetings" className="px-3 py-2 text-sm whitespace-nowrap">
                Meetings
              </TabsTrigger>
              <TabsTrigger value="projects" className="px-3 py-2 text-sm whitespace-nowrap">
                Projects
              </TabsTrigger>
              <TabsTrigger value="resources" className="px-3 py-2 text-sm whitespace-nowrap">
                Resources
              </TabsTrigger>
              <TabsTrigger value="attendance" className="px-3 py-2 text-sm whitespace-nowrap">
                Attendance
              </TabsTrigger>
              <TabsTrigger value="reminders" className="px-3 py-2 text-sm whitespace-nowrap">
                Reminders
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        {/* Desktop: Grid layout */}
        <div className="hidden lg:block">
          <TabsList className="grid w-full grid-cols-9 gap-1 h-12 p-1">
            <TabsTrigger value="members" className="text-sm px-2 py-1">
              Members
            </TabsTrigger>
            <TabsTrigger value="activities" className="text-sm px-2 py-1">
              Activities
            </TabsTrigger>
            <TabsTrigger value="workshops" className="text-sm px-2 py-1">
              Workshops
            </TabsTrigger>
            <TabsTrigger value="events" className="text-sm px-2 py-1">
              Events
            </TabsTrigger>
            <TabsTrigger value="meetings" className="text-sm px-2 py-1">
              Meetings
            </TabsTrigger>
            <TabsTrigger value="projects" className="text-sm px-2 py-1">
              Projects
            </TabsTrigger>
            <TabsTrigger value="resources" className="text-sm px-2 py-1">
              Resources
            </TabsTrigger>
            <TabsTrigger value="attendance" className="text-sm px-2 py-1">
              Attendance
            </TabsTrigger>
            <TabsTrigger value="reminders" className="text-sm px-2 py-1">
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
