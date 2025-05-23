
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, Calendar } from 'lucide-react';
import NotificationsList from '../NotificationsList';

interface DashboardOverviewProps {
  notifications: any[];
  upcomingEvents: any[];
}

const DashboardOverview = ({ notifications, upcomingEvents }: DashboardOverviewProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Recent Notifications</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <NotificationsList notifications={notifications.slice(0, 5)} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Upcoming Events</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="border-l-4 border-kic-green-500 pl-4">
                <h4 className="font-medium text-kic-gray">{event.title}</h4>
                <p className="text-sm text-kic-gray/70">{new Date(event.date).toLocaleDateString()}</p>
                <p className="text-sm text-kic-gray/70">{event.location}</p>
              </div>
            ))}
            {upcomingEvents.length === 0 && (
              <p className="text-kic-gray/70">No upcoming events</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;
