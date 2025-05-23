
import { Card, CardContent } from '@/components/ui/card';
import { Bell, Calendar, CreditCard, FileText, GitBranch, User } from 'lucide-react';

interface DashboardStatsProps {
  notifications: any[];
  projects: any[];
  certificates: any[];
  upcomingEvents: any[];
}

const DashboardStats = ({ notifications, projects, certificates, upcomingEvents }: DashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-kic-green-500" />
            <div>
              <p className="text-sm text-kic-gray/70">Notifications</p>
              <p className="text-xl font-bold text-kic-gray">{notifications.filter(n => !n.is_read).length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <GitBranch className="h-5 w-5 text-kic-green-500" />
            <div>
              <p className="text-sm text-kic-gray/70">Projects</p>
              <p className="text-xl font-bold text-kic-gray">{projects.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-kic-green-500" />
            <div>
              <p className="text-sm text-kic-gray/70">Certificates</p>
              <p className="text-xl font-bold text-kic-gray">{certificates.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-kic-green-500" />
            <div>
              <p className="text-sm text-kic-gray/70">Upcoming Events</p>
              <p className="text-xl font-bold text-kic-gray">{upcomingEvents.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
