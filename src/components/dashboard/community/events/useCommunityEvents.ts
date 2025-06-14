
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  max_attendees?: number;
  status: string;
  created_at: string;
  image_url?: string;
}

export const useCommunityEvents = (communityId: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCommunityEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('community_events')
        .select(`
          event_id,
          events (
            id,
            title,
            description,
            date,
            location,
            max_attendees,
            status,
            created_at,
            image_url
          )
        `)
        .eq('community_id', communityId);

      if (error) throw error;
      setEvents(data?.map(ce => ce.events) || []);
    } catch (error) {
      console.error('Error fetching community events:', error);
      toast({
        title: "Error",
        description: "Failed to load community events",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadEventImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `community-event-banners/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('event-images')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        return null;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('event-images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const createEvent = async (eventData: {
    title: string;
    description: string;
    date: string;
    location: string;
    max_attendees: string;
  }, selectedImage: File | null) => {
    if (!eventData.title || !eventData.date) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return false;
    }

    try {
      let imageUrl = null;

      if (selectedImage) {
        imageUrl = await uploadEventImage(selectedImage);
        if (!imageUrl) {
          toast({
            title: "Image upload failed",
            description: "The event will be created without an image",
            variant: "destructive",
          });
        }
      }

      const { data: eventResult, error: eventError } = await supabase
        .from('events')
        .insert({
          title: eventData.title,
          description: eventData.description,
          date: eventData.date,
          location: eventData.location,
          max_attendees: eventData.max_attendees ? parseInt(eventData.max_attendees) : null,
          created_by: user?.id,
          visibility: 'members',
          is_published: true,
          image_url: imageUrl,
        })
        .select()
        .single();

      if (eventError) throw eventError;

      const { error: linkError } = await supabase
        .from('community_events')
        .insert({
          community_id: communityId,
          event_id: eventResult.id,
        });

      if (linkError) throw linkError;

      toast({
        title: "Success",
        description: "Event created successfully",
      });

      await fetchCommunityEvents();
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

  useEffect(() => {
    fetchCommunityEvents();
  }, [communityId]);

  return {
    events,
    loading,
    createEvent,
    refreshEvents: fetchCommunityEvents,
  };
};
