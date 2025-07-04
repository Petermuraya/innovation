
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import DashboardProfile from './DashboardProfile';
import DashboardProjects from './DashboardProjects';
import DashboardPayments from './DashboardPayments';
import DashboardCertificates from './DashboardCertificates';
import DashboardNotifications from './DashboardNotifications';

export interface DashboardTabsContentProps {
  memberData: any;
  notifications: any[];
  upcomingEvents: any[];
  projects: any[];
  certificates: any[];
  payments: any[];
  onDataUpdate: () => void;
}

const DashboardTabsContent: React.FC<DashboardTabsContentProps> = ({
  memberData,
  notifications,
  upcomingEvents,
  projects,
  certificates,
  payments,
  onDataUpdate
}) => {
  return (
    <>
      <TabsContent value="overview" className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-lg font-semibold mb-4">Recent Notifications</h3>
            <DashboardNotifications notifications={notifications.slice(0, 3)} />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Upcoming Events</h3>
            <div className="space-y-2">
              {upcomingEvents.slice(0, 3).map((event, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <h4 className="font-medium">{event.title}</h4>
                  <p className="text-sm text-muted-foreground">{event.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="profile">
        <DashboardProfile memberData={memberData} onUpdate={onDataUpdate} />
      </TabsContent>

      <TabsContent value="projects">
        <DashboardProjects projects={projects} onUpdate={onDataUpdate} />
      </TabsContent>

      <TabsContent value="payments">
        <DashboardPayments />
      </TabsContent>

      <TabsContent value="certificates">
        <DashboardCertificates certificates={certificates} />
      </TabsContent>

      <TabsContent value="notifications">
        <DashboardNotifications notifications={notifications} />
      </TabsContent>
    </>
  );
};

export default DashboardTabsContent;
