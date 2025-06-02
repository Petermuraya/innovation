
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Calendar, MapPin, Users, Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
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
}

const EnhancedEventsManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  // Form state
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

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: false });

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
    setEditingEvent(null);
  };

  const handleCreateEvent = async () => {
    if (!user || !title.trim() || !description.trim() || !date || !location.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
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
        created_by: user.id,
      };

      let error;
      if (editingEvent) {
        ({ error } = await supabase
          .from('events')
          .update(eventData)
          .eq('id', editingEvent.id));
      } else {
        ({ error } = await supabase
          .from('events')
          .insert(eventData));
      }

      if (error) throw error;

      toast({
        title: editingEvent ? "Event updated" : "Event created",
        description: `Event has been ${editingEvent ? 'updated' : 'created'} successfully`,
      });

      resetForm();
      setShowCreateForm(false);
      await fetchEvents();
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

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setTitle(event.title);
    setDescription(event.description);
    setDate(new Date(event.date).toISOString().slice(0, 16));
    setLocation(event.location);
    setPrice(event.price);
    setMaxAttendees(event.max_attendees);
    setRequiresRegistration(event.requires_registration);
    setVisibility(event.visibility);
    setIsPublished(event.is_published);
    setShowCreateForm(true);
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

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

  const togglePublishStatus = async (event: Event) => {
    try {
      const newStatus = !event.is_published;
      const { error } = await supabase
        .from('events')
        .update({ 
          is_published: newStatus,
          status: newStatus ? 'published' : 'draft'
        })
        .eq('id', event.id);

      if (error) throw error;

      toast({
        title: newStatus ? "Event published" : "Event unpublished",
        description: `Event is now ${newStatus ? 'visible to members' : 'hidden from members'}`,
      });

      await fetchEvents();
    } catch (error) {
      console.error('Error updating event status:', error);
      toast({
        title: "Error",
        description: "Failed to update event status",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading events...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Event Management
          <Dialog open={showCreateForm} onOpenChange={(open) => {
            setShowCreateForm(open);
            if (!open) {
              resetForm();
            }
          }}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingEvent ? 'Edit Event' : 'Create New Event'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Event title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Event location"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Event description"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Date & Time *</Label>
                    <Input
                      id="date"
                      type="datetime-local"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Price (KSh)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      min="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="maxAttendees">Max Attendees</Label>
                    <Input
                      id="maxAttendees"
                      type="number"
                      value={maxAttendees || ''}
                      onChange={(e) => setMaxAttendees(e.target.value ? Number(e.target.value) : undefined)}
                      placeholder="Unlimited"
                      min="1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="visibility">Visibility</Label>
                    <Select value={visibility} onValueChange={setVisibility}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="everyone">Everyone</SelectItem>
                        <SelectItem value="members">Members Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="requiresRegistration"
                      checked={requiresRegistration}
                      onCheckedChange={setRequiresRegistration}
                    />
                    <Label htmlFor="requiresRegistration">Requires Registration</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isPublished"
                      checked={isPublished}
                      onCheckedChange={setIsPublished}
                    />
                    <Label htmlFor="isPublished">Publish Immediately</Label>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={handleCreateEvent}
                    disabled={submitting}
                    className="flex-1"
                  >
                    {submitting ? 'Saving...' : editingEvent ? 'Update Event' : 'Create Event'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      resetForm();
                      setShowCreateForm(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
        <CardDescription>Create and manage events with advanced controls</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium text-kic-gray">{event.title}</h4>
                    <Badge variant={event.is_published ? 'default' : 'secondary'}>
                      {event.is_published ? 'Published' : 'Draft'}
                    </Badge>
                    <Badge variant="outline">
                      {event.visibility === 'everyone' ? 'Public' : 'Members Only'}
                    </Badge>
                    {event.requires_registration && (
                      <Badge variant="outline">Registration Required</Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-kic-gray/70 mb-2">{event.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-kic-gray/70">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(event.date).toLocaleDateString()} at {new Date(event.date).toLocaleTimeString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {event.location}
                    </div>
                    {event.max_attendees && (
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        Max {event.max_attendees}
                      </div>
                    )}
                    {event.price > 0 && (
                      <div className="font-medium text-kic-green-600">
                        KSh {event.price}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => togglePublishStatus(event)}
                    className="flex items-center gap-1"
                  >
                    {event.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    {event.is_published ? 'Unpublish' : 'Publish'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditEvent(event)}
                    className="flex items-center gap-1"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteEvent(event.id)}
                    className="flex items-center gap-1 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
          
          {events.length === 0 && (
            <p className="text-kic-gray/70 text-center py-8">No events found. Create your first event!</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedEventsManagement;
