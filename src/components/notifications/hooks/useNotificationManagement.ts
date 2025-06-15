
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { NotificationData, PriorityLevel } from '../types';

export const useNotificationManagement = () => {
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
      setNotifications(data || []);
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
    priority: PriorityLevel = 'medium',
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

  return {
    notifications,
    setNotifications,
    isInitialized,
    setIsInitialized,
    refreshNotifications,
    markAsRead,
    markAllAsRead,
    createNotification,
  };
};
