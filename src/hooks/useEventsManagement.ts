
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
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
  image_url?: string;
}

interface EventInput {
  title: string;
  description: string;
  date: string;
  location: string;
  price: number;
  visibility: string;
  is_published: boolean;
  max_attendees?: number;
  requires_registration: boolean;
  image_url?: string;
}

export const useEventsManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
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

  const createEvent = async (eventData: EventInput) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create events",
        variant: "destructive",
      });
      return false;
    }

    try {
      // Ensure all required fields are present
      const insertData = {
        title: eventData.title,
        description: eventData.description,
        date: eventData.date, // This is required by the database
        location: eventData.location,
        price: eventData.price,
        visibility: eventData.visibility,
        is_published: eventData.is_published,
        max_attendees: eventData.max_attendees || null,
        requires_registration: eventData.requires_registration,
        status: eventData.is_published ? 'published' : 'draft',
        image_url: eventData.image_url || null,
      };

      const { error } = await supabase
        .from('events')
        .insert(insertData);

      if (error) throw error;

      toast({
        title: "Event created",
        description: "Event has been created successfully",
      });

      await fetchEvents();
      return true;
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: "Error",
        description: "Failed to create event",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateEvent = async (eventId: string, eventData: Partial<EventInput>) => {
    try {
      const updateData: any = {
        ...eventData,
        status: eventData.is_published ? 'published' : 'draft',
      };

      const { error } = await supabase
        .from('events')
        .update(updateData)
        .eq('id', eventId);

      if (error) throw error;

      toast({
        title: "Event updated",
        description: "Event has been updated successfully",
      });

      await fetchEvents();
      return true;
    } catch (error) {
      console.error('Error updating event:', error);
      toast({
        title: "Error",
        description: "Failed to update event",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteEvent = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;

      toast({
        title: "Event deleted",
        description: "Event has been deleted successfully",
      });

      await fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive",
      });
    }
  };

  const togglePublishStatus = async (eventId: string, currentStatus: boolean) => {
    await updateEvent(eventId, { is_published: !currentStatus });
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return {
    events,
    loading,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    togglePublishStatus,
  };
};
