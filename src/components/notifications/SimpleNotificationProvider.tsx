
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface NotificationData {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  is_read: boolean;
  metadata?: Record<string, any>;
  created_at: string;
}

interface NotificationContextType {
  notifications: NotificationData[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
  createNotification: (type: string, title: string, message: string, priority?: 'low' | 'medium' | 'high' | 'urgent', metadata?: Record<string, any>) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a SimpleNotificationProvider');
  }
  return context;
};

interface SimpleNotificationProviderProps {
  children: React.ReactNode;
}

export const SimpleNotificationProvider: React.FC<SimpleNotificationProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  const refreshNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      return;
    }

    try {
      console.log('🔔 Fetching notifications for user:', user.id);
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('❌ Error fetching notifications:', error);
        throw error;
      }

      console.log('✅ Fetched notifications:', data?.length || 0);
      
      // Map the database data to match our interface, providing default priority
      const mappedNotifications: NotificationData[] = (data || []).map(notification => ({
        ...notification,
        priority: notification.priority || 'medium' as 'medium'
      }));
      
      setNotifications(mappedNotifications);
    } catch (error) {
      console.error('❌ Error in refreshNotifications:', error);
      toast({
        title: "Error fetching notifications",
        description: "Failed to load your notifications. Please try again.",
        variant: "destructive",
      });
    }
  }, [user, toast]);

  const markAsRead = useCallback(async (id: string) => {
    try {
      console.log('📖 Marking notification as read:', id);
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);

      if (error) throw error;

      setNotifications(prev =>
        prev.map(notif =>
          notif.id === id ? { ...notif, is_read: true } : notif
        )
      );

      console.log('✅ Notification marked as read');
    } catch (error) {
      console.error('❌ Error marking notification as read:', error);
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive",
      });
    }
  }, [toast]);

  const markAllAsRead = useCallback(async () => {
    if (!user) return;

    try {
      console.log('📖 Marking all notifications as read for user:', user.id);
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (error) throw error;

      setNotifications(prev =>
        prev.map(notif => ({ ...notif, is_read: true }))
      );

      toast({
        title: "All notifications marked as read",
        description: "Your notification list has been cleared",
      });

      console.log('✅ All notifications marked as read');
    } catch (error) {
      console.error('❌ Error marking all notifications as read:', error);
      toast({
        title: "Error",
        description: "Failed to mark all notifications as read",
        variant: "destructive",
      });
    }
  }, [user, toast]);

  const createNotification = useCallback(async (
    type: string,
    title: string,
    message: string,
    priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium',
    metadata?: Record<string, any>
  ) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create notifications",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('🆕 Creating notification:', { type, title, priority });
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: user.id,
          type: type,
          title: title,
          message: message,
          priority: priority,
          metadata: metadata || {},
          is_read: false
        });

      if (error) throw error;

      // Show toast for high priority notifications
      if (priority === 'high' || priority === 'urgent') {
        toast({
          title: title,
          description: message,
          variant: priority === 'urgent' ? 'destructive' : 'default',
        });
      }

      console.log('✅ Notification created successfully');
      // Refresh notifications to show the new one
      await refreshNotifications();
    } catch (error) {
      console.error('❌ Error creating notification:', error);
      toast({
        title: "Error",
        description: "Failed to create notification",
        variant: "destructive",
      });
    }
  }, [user, toast, refreshNotifications]);

  // Initialize notifications when user changes
  useEffect(() => {
    if (user && !isInitialized) {
      console.log('🚀 Initializing notifications for user:', user.id);
      refreshNotifications();
      setIsInitialized(true);
    } else if (!user) {
      setNotifications([]);
      setIsInitialized(false);
    }
  }, [user, isInitialized, refreshNotifications]);

  // Set up real-time subscription
  useEffect(() => {
    if (!user) return;

    console.log('🔄 Setting up real-time subscription for user:', user.id);
    
    const channel = supabase
      .channel('notifications-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('🆕 New notification received:', payload.new);
          const newNotification = {
            ...payload.new,
            priority: payload.new.priority || 'medium'
          } as NotificationData;
          
          setNotifications(prev => [newNotification, ...prev]);
          
          // Show toast for new notifications
          if (newNotification.priority === 'high' || newNotification.priority === 'urgent') {
            toast({
              title: newNotification.title,
              description: newNotification.message,
              variant: newNotification.priority === 'urgent' ? 'destructive' : 'default',
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('📝 Notification updated:', payload.new);
          const updatedNotification = {
            ...payload.new,
            priority: payload.new.priority || 'medium'
          } as NotificationData;
          setNotifications(prev =>
            prev.map(notif =>
              notif.id === updatedNotification.id ? updatedNotification : notif
            )
          );
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('🗑️ Notification deleted:', payload.old);
          const deletedNotification = payload.old as NotificationData;
          setNotifications(prev =>
            prev.filter(notif => notif.id !== deletedNotification.id)
          );
        }
      )
      .subscribe();

    return () => {
      console.log('🔚 Cleaning up real-time subscription');
      supabase.removeChannel(channel);
    };
  }, [user, toast]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    refreshNotifications,
    createNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
