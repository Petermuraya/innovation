
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import EventForm from './EventForm';
import EventCard from './EventCard';
import { useEventManagement } from './useEventManagement';

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

const EventsManagementRefactored = () => {
  const { events, loading, fetchEvents, deleteEvent, togglePublishStatus } = useEventManagement();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setShowCreateForm(true);
  };

  const handleFormClose = () => {
    setShowCreateForm(false);
    setEditingEvent(null);
  };

  if (loading) {
    return <div className="text-center py-8">Loading events...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Event Management
          <Button 
            className="flex items-center gap-2"
            onClick={() => setShowCreateForm(true)}
          >
            <Plus className="h-4 w-4" />
            Create Event
          </Button>
        </CardTitle>
        <CardDescription>Create and manage events with advanced controls</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onEdit={handleEditEvent}
              onDelete={deleteEvent}
              onTogglePublish={togglePublishStatus}
            />
          ))}
          
          {events.length === 0 && (
            <p className="text-kic-gray/70 text-center py-8">No events found. Create your first event!</p>
          )}
        </div>
      </CardContent>
      
      <EventForm
        open={showCreateForm}
        onOpenChange={handleFormClose}
        editingEvent={editingEvent}
        onEventSaved={fetchEvents}
      />
    </Card>
  );
};

export default EventsManagementRefactored;
