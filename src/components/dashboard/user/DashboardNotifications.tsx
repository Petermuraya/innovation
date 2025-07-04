
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, Clock } from 'lucide-react';

interface DashboardNotificationsProps {
  notifications: any[];
}

const DashboardNotifications: React.FC<DashboardNotificationsProps> = ({ notifications }) => {
  return (
    <div className="space-y-4">
      {notifications.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No notifications</p>
            <p className="text-sm text-muted-foreground mt-2">
              You're all caught up!
            </p>
          </CardContent>
        </Card>
      ) : (
        notifications.map((notification, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">
                    {notification.title || 'Notification'}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" />
                    {notification.date || 'Recent'}
                  </CardDescription>
                </div>
                <Bell className="w-4 h-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground">
                {notification.message || notification.description || 'No details available'}
              </p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default DashboardNotifications;
