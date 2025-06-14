
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, AlertTriangle, Info, CheckCircle } from 'lucide-react';

const NotificationTester = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  const createNotification = async (type: string, title: string, message: string, priority: 'low' | 'medium' | 'high' = 'medium') => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create notifications",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: user.id,
          type: type,
          title: title,
          message: message,
          priority: priority,
          is_read: false
        });

      if (error) throw error;

      toast({
        title: "Notification Created",
        description: `${type} notification created successfully`,
      });
    } catch (error) {
      console.error('Error creating notification:', error);
      toast({
        title: "Error",
        description: "Failed to create notification",
        variant: "destructive",
      });
    }
  };

  const testNotifications = [
    {
      type: 'awold',
      title: 'Awold Class Notification',
      message: 'This is a special awold class notification to test the system',
      priority: 'high' as const,
      icon: <AlertTriangle className="w-4 h-4" />
    },
    {
      type: 'event',
      title: 'Test Event Notification',
      message: 'Upcoming event: Weekly Innovation Meeting',
      priority: 'medium' as const,
      icon: <Bell className="w-4 h-4" />
    },
    {
      type: 'announcement',
      title: 'Test Announcement',
      message: 'Important announcement for all members',
      priority: 'high' as const,
      icon: <Info className="w-4 h-4" />
    },
    {
      type: 'approval',
      title: 'Test Approval',
      message: 'Your project has been approved!',
      priority: 'medium' as const,
      icon: <CheckCircle className="w-4 h-4" />
    }
  ];

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notification System Tester
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          Test the notification system by creating different types of notifications.
        </p>
        
        <div className="grid gap-3">
          {testNotifications.map((notification, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {notification.icon}
                <div>
                  <p className="font-medium">{notification.title}</p>
                  <p className="text-sm text-gray-500">{notification.message}</p>
                  <span className={`text-xs px-2 py-1 rounded ${
                    notification.priority === 'high' ? 'bg-red-100 text-red-800' :
                    notification.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {notification.priority} priority
                  </span>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => createNotification(
                  notification.type,
                  notification.title,
                  notification.message,
                  notification.priority
                )}
              >
                Create
              </Button>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              testNotifications.forEach((notification, index) => {
                setTimeout(() => {
                  createNotification(
                    notification.type,
                    notification.title,
                    notification.message,
                    notification.priority
                  );
                }, index * 1000);
              });
            }}
          >
            Create All Test Notifications
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationTester;
