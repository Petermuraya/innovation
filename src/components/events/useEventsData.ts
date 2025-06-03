
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  price: number;
  status: string;
  visibility: string;
  is_published: boolean;
  max_attendees?: number;
  requires_registration: boolean;
  created_at: string;
}

export const useEventsData = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchEvents = async () => {
    console.log('useEventsData: Starting fetchEvents');
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_published', true)
        .order('date', { ascending: true });

      if (error) throw error;
      
      console.log('useEventsData: Fetched events data:', data?.length || 0, 'events');
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: "Error",
        description: "Failed to load events",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('useEventsData: Hook mounted, starting data fetch');
    fetchEvents();
  }, []);

  const refreshData = () => {
    console.log('useEventsData: Refreshing events data');
    setLoading(true);
    fetchEvents();
  };

  return {
    events,
    loading,
    refreshData,
  };
};
