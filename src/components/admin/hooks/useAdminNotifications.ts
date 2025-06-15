
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  target_type: 'all' | 'individual' | 'community';
  is_draft: boolean;
  scheduled_for?: string;
  created_at: string;
  created_by: string;
  metadata?: Record<string, any>;
}

interface NotificationStats {
  total_sent: number;
  total_scheduled: number;
  total_drafts: number;
  recent_sent: number;
}

export const useAdminNotifications = () => {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [stats, setStats] = useState<NotificationStats>({
    total_sent: 0,
    total_scheduled: 0,
    total_drafts: 0,
    recent_sent: 0
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('is_admin_notification', true)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      
      // Transform the data to ensure proper types, handling missing columns gracefully
      const transformedData = (data || []).map(notification => ({
        id: notification.id,
        title: notification.title || '',
        message: notification.message || '',
        type: notification.type || 'announcement',
        priority: (notification.priority as 'low' | 'medium' | 'high' | 'urgent') || 'medium',
        target_type: (notification.target_type as 'all' | 'individual' | 'community') || 'all',
        is_draft: notification.is_draft || false,
        scheduled_for: notification.scheduled_for || undefined,
        created_at: notification.created_at || '',
        created_by: notification.created_by || '',
        metadata: (notification.metadata && typeof notification.metadata === 'object') 
          ? notification.metadata as Record<string, any> 
          : {}
      }));
      
      setNotifications(transformedData);
    } catch (error) {
      console.error('Error fetching admin notifications:', error);
      toast({
        title: "Error",
        description: "Failed to fetch notifications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Get notification statistics
      const { data: sentData } = await supabase
        .from('notifications')
        .select('id', { count: 'exact' })
        .eq('is_admin_notification', true)
        .eq('is_draft', false)
        .is('scheduled_for', null);

      const { data: scheduledData } = await supabase
        .from('notifications')
        .select('id', { count: 'exact' })
        .eq('is_admin_notification', true)
        .not('scheduled_for', 'is', null);

      const { data: draftsData } = await supabase
        .from('notifications')
        .select('id', { count: 'exact' })
        .eq('is_admin_notification', true)
        .eq('is_draft', true);

      const { data: recentData } = await supabase
        .from('notifications')
        .select('id', { count: 'exact' })
        .eq('is_admin_notification', true)
        .eq('is_draft', false)
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      setStats({
        total_sent: sentData?.length || 0,
        total_scheduled: scheduledData?.length || 0,
        total_drafts: draftsData?.length || 0,
        recent_sent: recentData?.length || 0
      });
    } catch (error) {
      console.error('Error fetching notification stats:', error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Notification deleted successfully",
      });

      await fetchNotifications();
      await fetchStats();
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast({
        title: "Error",
        description: "Failed to delete notification",
        variant: "destructive",
      });
    }
  };

  const resendNotification = async (notificationId: string) => {
    try {
      // Get the original notification details
      const { data: notification, error: fetchError } = await supabase
        .from('notifications')
        .select('*')
        .eq('id', notificationId)
        .single();

      if (fetchError) throw fetchError;

      // Resend using the bulk function
      const { data, error } = await supabase.rpc('send_bulk_notification', {
        p_title: `[RESENT] ${notification.title}`,
        p_message: notification.message,
        p_type: notification.type,
        p_priority: notification.priority || 'medium',
        p_target_type: notification.target_type,
        p_target_ids: null, // Will need to get from targets table if needed
        p_scheduled_for: null,
        p_metadata: notification.metadata || {}
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Notification resent successfully",
      });

    } catch (error) {
      console.error('Error resending notification:', error);
      toast({
        title: "Error",
        description: "Failed to resend notification",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchStats();
  }, []);

  return {
    notifications,
    stats,
    loading,
    fetchNotifications,
    deleteNotification,
    resendNotification,
    refreshData: () => {
      fetchNotifications();
      fetchStats();
    }
  };
};
