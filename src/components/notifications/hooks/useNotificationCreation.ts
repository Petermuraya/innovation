
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { PriorityLevel } from '../types';

export const useNotificationCreation = () => {
  const { toast } = useToast();
  const { member } = useAuth();

  const createNotification = async (
    type: string, 
    title: string, 
    message: string, 
    priority: PriorityLevel = 'medium',
    metadata?: Record<string, any>
  ) => {
    if (!member) {
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
          user_id: member.id,
          type: type,
          title: title,
          message: message,
          priority: priority,
          metadata: metadata || {},
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

  return { createNotification };
};
