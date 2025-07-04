import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useEventForm = (event?: any, onSuccess?: () => void) => {
  const { member } = useAuth();
  const { toast } = useToast();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState(0);
  const [maxAttendees, setMaxAttendees] = useState<number | undefined>();
  const [requiresRegistration, setRequiresRegistration] = useState(false);
  const [visibility, setVisibility] = useState('members');
  const [isPublished, setIsPublished] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDate('');
    setLocation('');
    setPrice(0);
    setMaxAttendees(undefined);
    setRequiresRegistration(false);
    setVisibility('members');
    setIsPublished(false);
    setSelectedImage(null);
  };

  const loadEventData = () => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description);
      setDate(new Date(event.date).toISOString().slice(0, 16));
      setLocation(event.location);
      setPrice(event.price);
      setMaxAttendees(event.max_attendees);
      setRequiresRegistration(event.requires_registration);
      setVisibility(event.visibility);
      setIsPublished(event.is_published);
      setSelectedImage(null);
    }
  };

  const uploadEventImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `event-banners/${fileName}`;

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!member) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to manage events",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);
    try {
      let imageUrl = event?.image_url || null;

      if (selectedImage) {
        const uploadedImageUrl = await uploadEventImage(selectedImage);
        if (uploadedImageUrl) {
          imageUrl = uploadedImageUrl;
        } else {
          toast({
            title: "Image upload failed",
            description: "The event will be saved without an image",
            variant: "destructive",
          });
        }
      }

      const eventData = {
        title: title.trim(),
        description: description.trim(),
        date: new Date(date).toISOString(),
        location: location.trim(),
        price: price,
        max_attendees: maxAttendees,
        requires_registration: requiresRegistration,
        visibility: visibility,
        is_published: isPublished,
        status: isPublished ? 'published' : 'draft',
        created_by: member.id,
        image_url: imageUrl,
      };

      let error;
      if (event) {
        ({ error } = await supabase
          .from('events')
          .update(eventData)
          .eq('id', event.id));
      } else {
        ({ error } = await supabase
          .from('events')
          .insert(eventData));
      }

      if (error) throw error;

      toast({
        title: event ? "Event updated" : "Event created",
        description: `Event has been ${event ? 'updated' : 'created'} successfully`,
      });

      resetForm();
      onSuccess?.();
    } catch (error) {
      console.error('Error saving event:', error);
      toast({
        title: "Error",
        description: "Failed to save event",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return {
    // Form state
    title, setTitle,
    description, setDescription,
    date, setDate,
    location, setLocation,
    price, setPrice,
    maxAttendees, setMaxAttendees,
    requiresRegistration, setRequiresRegistration,
    visibility, setVisibility,
    isPublished, setIsPublished,
    submitting,
    selectedImage, setSelectedImage,
    
    // Form actions
    resetForm,
    loadEventData,
    handleSubmit,
  };
};
