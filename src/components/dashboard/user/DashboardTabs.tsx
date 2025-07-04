
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, FolderOpen, CreditCard, Award, Bell } from 'lucide-react';
import DashboardTabsContent, { DashboardTabsContentProps } from './DashboardTabsContent';

const DashboardTabs: React.FC<DashboardTabsContentProps> = (props) => {
  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList className="grid w-full grid-cols-6">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="profile" className="flex items-center gap-2">
          <User className="w-4 h-4" />
          Profile
        </TabsTrigger>
        <TabsTrigger value="projects" className="flex items-center gap-2">
          <FolderOpen className="w-4 h-4" />
          Projects
        </TabsTrigger>
        <TabsTrigger value="payments" className="flex items-center gap-2">
          <CreditCard className="w-4 h-4" />
          Payments
        </TabsTrigger>
        <TabsTrigger value="certificates" className="flex items-center gap-2">
          <Award className="w-4 h-4" />
          Certificates
        </TabsTrigger>
        <TabsTrigger value="notifications" className="flex items-center gap-2">
          <Bell className="w-4 h-4" />
          Notifications
        </TabsTrigger>
      </TabsList>

      <DashboardTabsContent {...props} />
    </Tabs>
  );
};

export default DashboardTabs;
