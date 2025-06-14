
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
  CheckCircle,
  Info,
  AlertTriangle,
  Trophy,
  Sparkles,
  Zap
} from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  action_url?: string;
  metadata?: Record<string, any>;
  expires_at?: string;
}

interface EnhancedNotificationsListProps {
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
  success: <CheckCircle className="w-4 h-4" />,
  info: <Info className="w-4 h-4" />,
  warning: <AlertTriangle className="w-4 h-4" />,
  achievement: <Trophy className="w-4 h-4" />,
};

const EnhancedNotificationsList = ({ 
  notifications, 
  onMarkAllRead,
  onDismiss
}: EnhancedNotificationsListProps) => {
  const [localNotifications, setLocalNotifications] = useState(notifications);
  const [isHovering, setIsHovering] = useState<string | null>(null);
  const [celebratingId, setCelebratingId] = useState<string | null>(null);

  useEffect(() => {
    setLocalNotifications(notifications);
    
    // Check for world-class notifications and trigger celebration
    notifications.forEach(notification => {
      if (notification.metadata?.isWorldClass && !notification.is_read) {
        setCelebratingId(notification.id);
        setTimeout(() => setCelebratingId(null), 3000);
      }
    });
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
      case 'success': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'info': return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      case 'warning': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'achievement': return 'bg-gradient-to-r from-yellow-100 to-amber-100 text-amber-800 border-amber-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'urgent': return 'border-l-4 border-l-red-600 shadow-lg shadow-red-100';
      case 'high': return 'border-l-4 border-l-red-500 shadow-md shadow-red-50';
      case 'medium': return 'border-l-4 border-l-amber-500';
      case 'low': return 'border-l-4 border-l-blue-500';
      default: return '';
    }
  };

  const getWorldClassStyling = (notification: Notification) => {
    if (notification.metadata?.isWorldClass) {
      const isCelebrating = celebratingId === notification.id;
      return `ring-2 ring-gradient-to-r from-purple-400 to-pink-400 shadow-xl bg-gradient-to-r from-purple-50 via-pink-50 to-yellow-50 ${
        isCelebrating ? 'animate-pulse' : ''
      }`;
    }
    return '';
  };

  if (localNotifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Bell className="w-16 h-16 text-gray-300 mb-4 mx-auto" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications yet</h3>
          <p className="text-gray-500">We'll notify you when something amazing happens!</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {onMarkAllRead && localNotifications.some(n => !n.is_read) && (
        <div className="flex justify-between items-center px-2 py-1">
          <p className="text-sm text-gray-600">
            {localNotifications.filter(n => !n.is_read).length} unread notifications
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={onMarkAllRead}
            className="text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50"
          >
            <Check className="w-3 h-3 mr-1" />
            Mark all as read
          </Button>
        </div>
      )}

      <AnimatePresence>
        {localNotifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`relative ${getPriorityColor(notification.priority)}`}
            onMouseEnter={() => setIsHovering(notification.id)}
            onMouseLeave={() => setIsHovering(null)}
          >
            <div className={`p-4 rounded-xl border transition-all duration-300 ${
              notification.is_read 
                ? 'bg-gray-50/50 border-gray-200' 
                : 'bg-white border-gray-300 shadow-sm'
            } ${
              isHovering === notification.id ? 'ring-2 ring-blue-200 shadow-md transform scale-[1.01]' : ''
            } ${getWorldClassStyling(notification)}`}>
              
              {/* World-class celebration effects */}
              {notification.metadata?.isWorldClass && celebratingId === notification.id && (
                <div className="absolute -top-2 -right-2">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.2, 1] }}
                    transition={{ duration: 0.6 }}
                    className="relative"
                  >
                    <Sparkles className="w-6 h-6 text-yellow-500" />
                    {Array.from({ length: 3 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-yellow-400 rounded-full"
                        initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                        animate={{ 
                          opacity: 0, 
                          scale: 0,
                          x: Math.random() * 40 - 20,
                          y: Math.random() * 40 - 20
                        }}
                        transition={{ duration: 1, delay: i * 0.2 }}
                      />
                    ))}
                  </motion.div>
                </div>
              )}

              <div className="flex justify-between items-start gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <motion.div 
                      className={`p-2 rounded-lg ${getTypeColor(notification.type)}`}
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {typeIcons[notification.type as keyof typeof typeIcons] || <Bell className="w-4 h-4" />}
                    </motion.div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className={`font-semibold text-sm ${
                          notification.is_read ? 'text-gray-600' : 'text-gray-900'
                        } ${notification.metadata?.isWorldClass ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600' : ''}`}>
                          {notification.title}
                          {notification.metadata?.isWorldClass && (
                            <motion.span 
                              className="ml-2 inline-flex items-center"
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <Zap className="w-4 h-4 text-yellow-500 mr-1" />
                              <span className="text-xs bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full font-bold">
                                WORLD CLASS
                              </span>
                            </motion.span>
                          )}
                        </h4>
                        <Badge 
                          variant="outline" 
                          className={`text-xs capitalize ${getTypeColor(notification.type)}`}
                        >
                          {notification.type}
                        </Badge>
                        {notification.priority === 'urgent' && (
                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          >
                            <Badge variant="destructive" className="text-xs">
                              URGENT
                            </Badge>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <p className={`text-sm mt-2 leading-relaxed ${
                    notification.is_read ? 'text-gray-500' : 'text-gray-700'
                  } ${notification.metadata?.isWorldClass ? 'font-medium' : ''}`}>
                    {notification.message}
                  </p>
                  
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-xs text-gray-400">
                      {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                    </p>
                    {notification.action_url && (
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="text-xs h-auto p-0 text-blue-600 hover:text-blue-800"
                        asChild
                      >
                        <a href={notification.action_url} className="flex items-center gap-1">
                          View details
                          <motion.div whileHover={{ x: 2 }}>
                            →
                          </motion.div>
                        </a>
                      </Button>
                    )}
                  </div>
                </div>

                <div className="flex gap-1">
                  {!notification.is_read && (
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => markAsRead(notification.id)}
                        className="h-8 w-8 hover:bg-blue-100 text-blue-600"
                        title="Mark as read"
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  )}
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => dismissNotification(notification.id)}
                      className="h-8 w-8 hover:bg-red-100 text-red-600"
                      title="Dismiss"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedNotificationsList;
