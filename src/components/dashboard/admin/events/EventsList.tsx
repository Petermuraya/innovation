
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
  onCreateEvent?: () => void;
}

const EventsList = ({ events, onEdit, onDelete, onTogglePublish, onCreateEvent }: EventsListProps) => {
  if (events.length === 0) {
    return <EventsEmptyState onCreateEvent={onCreateEvent} />;
  }

  // Sort events by date (upcoming first, then past events)
  const sortedEvents = [...events].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    const now = new Date();
    
    // Separate upcoming and past events
    const aIsUpcoming = dateA >= now;
    const bIsUpcoming = dateB >= now;
    
    if (aIsUpcoming && !bIsUpcoming) return -1;
    if (!aIsUpcoming && bIsUpcoming) return 1;
    
    // Within the same category (upcoming or past), sort by date
    if (aIsUpcoming) {
      return dateA.getTime() - dateB.getTime(); // Upcoming: nearest first
    } else {
      return dateB.getTime() - dateA.getTime(); // Past: most recent first
    }
  });

  return (
    <div className="space-y-6">
      {sortedEvents.map((event) => (
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
