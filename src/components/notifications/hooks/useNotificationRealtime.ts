
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { NotificationData } from '../types';

interface UseNotificationRealtimeProps {
  notifications: NotificationData[];
  setNotifications: React.Dispatch<React.SetStateAction<NotificationData[]>>;
}

export const useNotificationRealtime = ({ 
  notifications, 
  setNotifications 
}: UseNotificationRealtimeProps) => {
  const { user } = useAuth();
  const { toast } = useToast();

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
          const newNotification = payload.new as NotificationData;
          
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
          const updatedNotification = payload.new as NotificationData;
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
  }, [user, toast, setNotifications]);
};
