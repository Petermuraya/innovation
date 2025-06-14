
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, MapPin, Clock, Plus } from 'lucide-react';
import ImageUploader from '@/components/uploads/ImageUploader';

interface CommunityEventsTabProps {
  communityId: string;
}

const CommunityEventsTab = ({ communityId }: CommunityEventsTabProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    max_attendees: '',
  });

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

  const createEvent = async () => {
    if (!eventForm.title || !eventForm.date) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      let imageUrl = null;

      // Upload image if selected
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

      // Create the event
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .insert({
          title: eventForm.title,
          description: eventForm.description,
          date: eventForm.date,
          location: eventForm.location,
          max_attendees: eventForm.max_attendees ? parseInt(eventForm.max_attendees) : null,
          created_by: user?.id,
          visibility: 'members',
          is_published: true,
          image_url: imageUrl,
        })
        .select()
        .single();

      if (eventError) throw eventError;

      // Link the event to the community
      const { error: linkError } = await supabase
        .from('community_events')
        .insert({
          community_id: communityId,
          event_id: eventData.id,
        });

      if (linkError) throw linkError;

      toast({
        title: "Success",
        description: "Event created successfully",
      });

      setShowCreateDialog(false);
      setEventForm({ title: '', description: '', date: '', location: '', max_attendees: '' });
      setSelectedImage(null);
      fetchCommunityEvents();
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: "Error",
        description: "Failed to create event",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchCommunityEvents();
  }, [communityId]);

  if (loading) {
    return <div className="text-center py-8">Loading events...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Community Events ({events.length})
        </CardTitle>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Community Event</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <ImageUploader
                onImageSelect={setSelectedImage}
                onImageRemove={() => setSelectedImage(null)}
                selectedImage={selectedImage}
                maxSize={5}
                className="mb-4"
              />

              <div>
                <Label htmlFor="title">Event Title *</Label>
                <Input
                  id="title"
                  value={eventForm.title}
                  onChange={(e) => setEventForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter event title"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={eventForm.description}
                  onChange={(e) => setEventForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Event description"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="date">Date & Time *</Label>
                <Input
                  id="date"
                  type="datetime-local"
                  value={eventForm.date}
                  onChange={(e) => setEventForm(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={eventForm.location}
                  onChange={(e) => setEventForm(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Event location"
                />
              </div>
              <div>
                <Label htmlFor="max_attendees">Max Attendees</Label>
                <Input
                  id="max_attendees"
                  type="number"
                  value={eventForm.max_attendees}
                  onChange={(e) => setEventForm(prev => ({ ...prev, max_attendees: e.target.value }))}
                  placeholder="Leave empty for unlimited"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => {
                  setShowCreateDialog(false);
                  setSelectedImage(null);
                }}>
                  Cancel
                </Button>
                <Button onClick={createEvent}>
                  Create Event
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex gap-4 flex-1">
                  {event.image_url && (
                    <img
                      src={event.image_url}
                      alt={event.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}
                  <div className="space-y-2 flex-1">
                    <h4 className="font-medium text-kic-gray">{event.title}</h4>
                    {event.description && (
                      <p className="text-sm text-gray-600">{event.description}</p>
                    )}
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {new Date(event.date).toLocaleString()}
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {event.location}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <Badge variant={event.status === 'upcoming' ? 'default' : 'secondary'}>
                  {event.status}
                </Badge>
              </div>
            </div>
          ))}
          {events.length === 0 && (
            <div className="text-center py-8">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Events</h3>
              <p className="text-gray-500">This community doesn't have any events yet.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CommunityEventsTab;
