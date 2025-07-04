
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, MapPin, Users, Edit, Trash2, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import EventForm from './EventForm';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  max_attendees: number;
  is_published: boolean;
  created_by: string;
  created_at: string;
  // Adding these to match the expected interface
  start_date?: string;
  end_date?: string;
  max_participants?: number;
  registration_required?: boolean;
  status?: string;
}

const EventsManagementRefactored: React.FC = () => {
  const { member } = useAuth();
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    if (member) {
      fetchEvents();
    }
  }, [member]);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match our Event interface
      const transformedEvents = (data || []).map(event => ({
        ...event,
        start_date: event.date,
        end_date: event.date,
        max_participants: event.max_attendees,
        registration_required: true,
        status: event.is_published ? 'active' : 'draft'
      }));
      
      setEvents(transformedEvents);
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

  const handleEventSaved = async () => {
    await fetchEvents();
    setIsFormOpen(false);
    setEditingEvent(null);
    toast({
      title: "Success",
      description: "Event saved successfully",
    });
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setIsFormOpen(true);
  };

  const handleDelete = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;

      await fetchEvents();
      toast({
        title: "Success",
        description: "Event deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading events...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Events Management</h3>
          <p className="text-muted-foreground">Create and manage club events</p>
        </div>
        
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingEvent(null)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingEvent ? 'Edit Event' : 'Create New Event'}
              </DialogTitle>
              <DialogDescription>
                {editingEvent 
                  ? 'Update the event details below.'
                  : 'Fill in the details to create a new event.'
                }
              </DialogDescription>
            </DialogHeader>
            <EventForm editingEvent={editingEvent} onEventSaved={handleEventSaved} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {events.map((event) => (
          <Card key={event.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarDays className="w-5 h-5" />
                    {event.title}
                  </CardTitle>
                  <CardDescription>{event.description}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEdit(event)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDelete(event.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <CalendarDays className="w-4 h-4" />
                  {new Date(event.date).toLocaleDateString()}
                </div>
                {event.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {event.location}
                  </div>
                )}
                {event.max_attendees && (
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    Max {event.max_attendees} attendees
                  </div>
                )}
                <Badge variant={event.is_published ? 'default' : 'secondary'}>
                  {event.is_published ? 'Published' : 'Draft'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}

        {events.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <CalendarDays className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No events found</p>
              <Button onClick={() => setIsFormOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Event
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EventsManagementRefactored;
