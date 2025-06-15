
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface PaymentReminder {
  id: string;
  user_id: string;
  reminder_type: 'registration' | 'subscription';
  reminder_count: number;
  last_reminded_at: string;
  is_dismissed: boolean;
  created_at: string;
  updated_at: string;
}

export const usePaymentReminders = () => {
  const { user } = useAuth();
  const [reminders, setReminders] = useState<PaymentReminder[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReminders = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('payment_reminders')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_dismissed', false);

      if (error) throw error;
      setReminders(data || []);
    } catch (error) {
      console.error('Error fetching payment reminders:', error);
    } finally {
      setLoading(false);
    }
  };

  const incrementReminder = async (reminderType: 'registration' | 'subscription') => {
    if (!user) return;

    try {
      const { error } = await supabase.rpc('increment_payment_reminder', {
        reminder_user_id: user.id,
        reminder_type_param: reminderType
      });

      if (error) throw error;
      await fetchReminders(); // Refresh reminders
    } catch (error) {
      console.error('Error incrementing reminder:', error);
    }
  };

  const dismissReminder = async (reminderId: string) => {
    try {
      const { error } = await supabase
        .from('payment_reminders')
        .update({ is_dismissed: true, updated_at: new Date().toISOString() })
        .eq('id', reminderId);

      if (error) throw error;
      await fetchReminders(); // Refresh reminders
    } catch (error) {
      console.error('Error dismissing reminder:', error);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, [user]);

  return {
    reminders,
    loading,
    incrementReminder,
    dismissReminder,
    refreshReminders: fetchReminders
  };
};
