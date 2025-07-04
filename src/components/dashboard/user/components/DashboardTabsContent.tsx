
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import DashboardOverview from '../DashboardOverview';
import DashboardStats from '../DashboardStats';
import DashboardSubmissions from '../DashboardSubmissions';
import DashboardEvents from '../DashboardEvents';
import DashboardPayments from '../DashboardPayments';
import DashboardBlogging from '../DashboardBlogging';
import DashboardBadges from '../DashboardBadges';
import ProfileEditor from '../ProfileEditor';

interface DashboardTabsContentProps {
  memberProfile: any;
  loading: boolean;
}

const DashboardTabsContent: React.FC<DashboardTabsContentProps> = ({ 
  memberProfile, 
  loading 
}) => {
  return (
    <>
      <TabsContent value="overview">
        <DashboardOverview memberProfile={memberProfile} loading={loading} />
      </TabsContent>

      <TabsContent value="stats">
        <DashboardStats />
      </TabsContent>

      <TabsContent value="submissions">
        <DashboardSubmissions />
      </TabsContent>

      <TabsContent value="events">
        <DashboardEvents />
      </TabsContent>

      <TabsContent value="payments">
        <DashboardPayments />
      </TabsContent>

      <TabsContent value="blogging">
        <DashboardBlogging />
      </TabsContent>

      <TabsContent value="badges">
        <DashboardBadges />
      </TabsContent>

      <TabsContent value="profile">
        <ProfileEditor />
      </TabsContent>
    </>
  );
};

export default DashboardTabsContent;
