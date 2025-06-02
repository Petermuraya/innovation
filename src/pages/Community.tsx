
import CommunityGroups from '@/components/community/CommunityGroups';
import WeeklyMeetings from '@/components/meetings/WeeklyMeetings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Community = () => {
  return (
    <div className="min-h-screen bg-kic-lightGray">
      <div className="container mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-kic-gray mb-4">Community Hub</h1>
          <p className="text-xl text-kic-gray/70 max-w-3xl mx-auto">
            Connect with fellow innovators, join specialized groups, and participate in our weekly meetings.
          </p>
        </div>

        <Tabs defaultValue="groups" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="groups">Community Groups</TabsTrigger>
            <TabsTrigger value="meetings">Weekly Meetings</TabsTrigger>
          </TabsList>

          <TabsContent value="groups">
            <CommunityGroups />
          </TabsContent>

          <TabsContent value="meetings">
            <WeeklyMeetings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Community;
