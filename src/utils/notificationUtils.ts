
import { supabase } from '@/integrations/supabase/client';

export interface CreateNotificationParams {
  userId: string;
  type: 'event' | 'payment' | 'approval' | 'announcement' | 'alert' | 'success' | 'info' | 'warning' | 'achievement';
  title: string;
  message: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  actionUrl?: string;
  metadata?: Record<string, any>;
  expiresAt?: string;
}

export const createNotification = async ({
  userId,
  type,
  title,
  message,
  priority = 'medium',
  actionUrl,
  metadata,
  expiresAt
}: CreateNotificationParams) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type,
        title,
        message,
        priority,
        action_url: actionUrl,
        metadata: metadata || {},
        expires_at: expiresAt,
        is_read: false
      })
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error creating notification:', error);
    return { success: false, error };
  }
};

export const createWorldClassNotification = async (
  userId: string,
  title: string,
  message: string,
  type: 'success' | 'achievement' | 'announcement' = 'achievement',
  priority: 'high' | 'urgent' = 'high'
) => {
  return createNotification({
    userId,
    type,
    title,
    message,
    priority,
    metadata: {
      isWorldClass: true,
      animation: 'celebration',
      sound: 'success'
    }
  });
};

export const markNotificationAsRead = async (notificationId: string) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return { success: false, error };
  }
};

export const markAllNotificationsAsRead = async (userId: string) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return { success: false, error };
  }
};

export const deleteExpiredNotifications = async (userId: string) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('user_id', userId)
      .lt('expires_at', new Date().toISOString());

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting expired notifications:', error);
    return { success: false, error };
  }
};
