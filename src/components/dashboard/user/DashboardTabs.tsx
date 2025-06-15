
import { Tabs } from '@/components/ui/tabs';
import DashboardTabsList from './components/DashboardTabsList';
import DashboardTabsContent from './components/DashboardTabsContent';
import { DashboardTabsProps } from './types/dashboardTabs';

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
      <DashboardTabsList />
      <DashboardTabsContent
        memberData={memberData}
        notifications={notifications}
        upcomingEvents={upcomingEvents}
        projects={projects}
        certificates={certificates}
        payments={payments}
        onDataUpdate={onDataUpdate}
      />
    </Tabs>
  );
};

export default DashboardTabs;
