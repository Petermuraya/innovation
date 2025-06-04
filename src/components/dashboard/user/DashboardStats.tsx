
import { Card, CardContent } from '@/components/ui/card';
import { Bell, Calendar, FileText, GitBranch } from 'lucide-react';

interface DashboardStatsProps {
  notifications: any[];
  projects: any[];
  certificates: any[];
  upcomingEvents: any[];
}

const DashboardStats = ({ notifications, projects, certificates, upcomingEvents }: DashboardStatsProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
      <Card>
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center space-x-2">
            <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-kic-green-500 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-kic-gray/70 truncate">Notifications</p>
              <p className="text-lg sm:text-xl font-bold text-kic-gray">{notifications.filter(n => !n.is_read).length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center space-x-2">
            <GitBranch className="h-4 w-4 sm:h-5 sm:w-5 text-kic-green-500 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-kic-gray/70 truncate">Projects</p>
              <p className="text-lg sm:text-xl font-bold text-kic-gray">{projects.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-kic-green-500 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-kic-gray/70 truncate">Certificates</p>
              <p className="text-lg sm:text-xl font-bold text-kic-gray">{certificates.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-kic-green-500 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-kic-gray/70 truncate">Upcoming Events</p>
              <p className="text-lg sm:text-xl font-bold text-kic-gray">{upcomingEvents.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
