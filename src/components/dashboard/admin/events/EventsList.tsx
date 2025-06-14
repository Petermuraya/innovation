
import EventCard from './EventCard';
import EventsEmptyState from './EventsEmptyState';

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

interface EventsListProps {
  events: Event[];
  onEdit: (event: Event) => void;
  onDelete: (eventId: string) => void;
  onTogglePublish: (event: Event) => void;
}

const EventsList = ({ events, onEdit, onDelete, onTogglePublish }: EventsListProps) => {
  if (events.length === 0) {
    return <EventsEmptyState />;
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          onEdit={onEdit}
          onDelete={onDelete}
          onTogglePublish={onTogglePublish}
        />
      ))}
    </div>
  );
};

export default EventsList;
