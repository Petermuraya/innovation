
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import EventForm from './EventForm';
import EventsManagementHeader from './EventsManagementHeader';
import EventsList from './EventsList';
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

  const handleCreateEvent = () => {
    setShowCreateForm(true);
  };

  if (loading) {
    return <div className="text-center py-8">Loading events...</div>;
  }

  return (
    <Card>
      <EventsManagementHeader onCreateEvent={handleCreateEvent} />
      <CardContent>
        <EventsList
          events={events}
          onEdit={handleEditEvent}
          onDelete={deleteEvent}
          onTogglePublish={togglePublishStatus}
        />
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
