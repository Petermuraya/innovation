
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  Check, 
  AlertCircle, 
  Calendar, 
  DollarSign, 
  Megaphone, 
  Star,
  X,
  Shield
} from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
  priority?: 'low' | 'medium' | 'high';
  action_url?: string;
}

interface NotificationsListProps {
  notifications: Notification[];
  onMarkAllRead?: () => void;
  onDismiss?: (id: string) => void;
}

const typeIcons = {
  event: <Calendar className="w-4 h-4" />,
  payment: <DollarSign className="w-4 h-4" />,
  approval: <Star className="w-4 h-4" />,
  announcement: <Megaphone className="w-4 h-4" />,
  alert: <AlertCircle className="w-4 h-4" />,
  awold: <Shield className="w-4 h-4" />, // Special icon for awold class
};

const NotificationsList = ({ 
  notifications, 
  onMarkAllRead,
  onDismiss
}: NotificationsListProps) => {
  const [localNotifications, setLocalNotifications] = useState(notifications);
  const [isHovering, setIsHovering] = useState<string | null>(null);

  useEffect(() => {
    setLocalNotifications(notifications);
  }, [notifications]);

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

  const dismissNotification = async (notificationId: string) => {
    try {
      await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      setLocalNotifications(prev => 
        prev.filter(notif => notif.id !== notificationId)
      );

      if (onDismiss) {
        onDismiss(notificationId);
      }
    } catch (error) {
      console.error('Error dismissing notification:', error);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'event': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'payment': return 'bg-green-100 text-green-800 border-green-200';
      case 'approval': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'announcement': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'alert': return 'bg-red-100 text-red-800 border-red-200';
      case 'awold': return 'bg-indigo-100 text-indigo-800 border-indigo-200'; // Special styling for awold
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'border-l-4 border-l-red-500';
      case 'medium': return 'border-l-4 border-l-amber-500';
      case 'low': return 'border-l-4 border-l-blue-500';
      default: return '';
    }
  };

  // Special styling for awold class notifications
  const getAwoldStyling = (type: string, priority?: string) => {
    if (type === 'awold') {
      return 'ring-2 ring-indigo-300 shadow-lg bg-gradient-to-r from-indigo-50 to-purple-50';
    }
    return '';
  };

  if (localNotifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Bell className="w-10 h-10 text-gray-300 mb-4" />
        <p className="text-gray-500">No notifications yet</p>
        <p className="text-sm text-gray-400 mt-1">We'll notify you when something arrives</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {onMarkAllRead && localNotifications.some(n => !n.is_read) && (
        <div className="flex justify-end px-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMarkAllRead}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Mark all as read
          </Button>
        </div>
      )}

      <AnimatePresence>
        {localNotifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.2 }}
            className={`relative ${getPriorityColor(notification.priority)}`}
            onMouseEnter={() => setIsHovering(notification.id)}
            onMouseLeave={() => setIsHovering(null)}
          >
            <div className={`p-4 rounded-lg border transition-all duration-200 ${
              notification.is_read 
                ? 'bg-gray-50/50 border-gray-200' 
                : 'bg-white border-gray-300 shadow-sm'
            } ${
              isHovering === notification.id ? 'ring-1 ring-gray-300' : ''
            } ${getAwoldStyling(notification.type, notification.priority)}`}>
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`p-1.5 rounded-md ${getTypeColor(notification.type)}`}>
                      {typeIcons[notification.type as keyof typeof typeIcons] || <Bell className="w-4 h-4" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className={`font-medium text-sm ${
                          notification.is_read ? 'text-gray-600' : 'text-gray-900'
                        } ${notification.type === 'awold' ? 'font-bold' : ''}`}>
                          {notification.title}
                          {notification.type === 'awold' && (
                            <span className="ml-2 text-xs bg-indigo-500 text-white px-2 py-1 rounded-full">
                              AWOLD
                            </span>
                          )}
                        </h4>
                        <Badge 
                          variant="outline" 
                          className={`text-xs capitalize ${getTypeColor(notification.type)}`}
                        >
                          {notification.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <p className={`text-sm mt-1 ${
                    notification.is_read ? 'text-gray-500' : 'text-gray-700'
                  } ${notification.type === 'awold' ? 'font-medium' : ''}`}>
                    {notification.message}
                  </p>
                  
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-gray-400">
                      {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                    </p>
                    {notification.action_url && (
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="text-xs h-auto p-0"
                        asChild
                      >
                        <a href={notification.action_url}>View details</a>
                      </Button>
                    )}
                  </div>
                </div>

                <div className="flex gap-1">
                  {!notification.is_read && (
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => markAsRead(notification.id)}
                      className="h-8 w-8 hover:bg-gray-200/50"
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4 text-gray-500" />
                    </Button>
                  )}
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => dismissNotification(notification.id)}
                    className="h-8 w-8 hover:bg-gray-200/50"
                    title="Dismiss"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationsList;
