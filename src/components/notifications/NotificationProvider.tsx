
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
  priority?: 'low' | 'medium' | 'high';
  action_url?: string;
  expires_at?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const refreshNotifications = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      const transformedData = (data || []).map(notification => ({
        id: notification.id,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        is_read: notification.is_read,
        created_at: notification.created_at,
        priority: (notification.priority as 'low' | 'medium' | 'high') || undefined,
        action_url: notification.action_url || undefined,
        expires_at: notification.expires_at || undefined
      }));
      
      setNotifications(transformedData);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
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
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;

    try {
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
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };
  useEffect(() => {
    if (!user) return;

    refreshNotifications();

    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const newNotification = payload.new as any;
          const transformedNotification: Notification = {
            id: newNotification.id,
            title: newNotification.title,
            message: newNotification.message,
            type: newNotification.type,
            is_read: newNotification.is_read,
            created_at: newNotification.created_at,
            priority: (newNotification.priority as 'low' | 'medium' | 'high') || undefined,
            action_url: newNotification.action_url || undefined,
            expires_at: newNotification.expires_at || undefined
          };
          
          setNotifications(prev => [transformedNotification, ...prev]);
          
          // Show toast for high priority notifications
          if (transformedNotification.priority === 'high') {
            toast({
              title: transformedNotification.title,
              description: transformedNotification.message,
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
          const updatedNotification = payload.new as any;
          const transformedNotification: Notification = {
            id: updatedNotification.id,
            title: updatedNotification.title,
            message: updatedNotification.message,
            type: updatedNotification.type,
            is_read: updatedNotification.is_read,
            created_at: updatedNotification.created_at,
            priority: (updatedNotification.priority as 'low' | 'medium' | 'high') || undefined,
            action_url: updatedNotification.action_url || undefined,
            expires_at: updatedNotification.expires_at || undefined
          };
          
          setNotifications(prev =>
            prev.map(notif =>
              notif.id === transformedNotification.id ? transformedNotification : notif
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const value = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    refreshNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
