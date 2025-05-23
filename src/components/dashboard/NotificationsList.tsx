
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

interface NotificationsListProps {
  notifications: Notification[];
}

const NotificationsList = ({ notifications }: NotificationsListProps) => {
  const [localNotifications, setLocalNotifications] = useState(notifications);

  const markAsRead = async (notificationId: string) => {
    try {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      setLocalNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, is_read: true } : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'event': return 'bg-blue-100 text-blue-800';
      case 'payment': return 'bg-green-100 text-green-800';
      case 'approval': return 'bg-yellow-100 text-yellow-800';
      case 'announcement': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (localNotifications.length === 0) {
    return <p className="text-kic-gray/70">No notifications</p>;
  }

  return (
    <div className="space-y-3">
      {localNotifications.map((notification) => (
        <div
          key={notification.id}
          className={`p-3 rounded-lg border ${
            notification.is_read ? 'bg-gray-50' : 'bg-white border-kic-green-200'
          }`}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className={`font-medium text-sm ${
                  notification.is_read ? 'text-gray-600' : 'text-kic-gray'
                }`}>
                  {notification.title}
                </h4>
                <Badge className={getTypeColor(notification.type)}>
                  {notification.type}
                </Badge>
              </div>
              <p className={`text-sm ${
                notification.is_read ? 'text-gray-500' : 'text-kic-gray/70'
              }`}>
                {notification.message}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
              </p>
            </div>
            {!notification.is_read && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => markAsRead(notification.id)}
                className="text-xs"
              >
                Mark read
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationsList;
