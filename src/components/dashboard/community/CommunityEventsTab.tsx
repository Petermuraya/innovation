import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { useCommunityEvents } from './events/useCommunityEvents';
import CommunityEventCreateDialog from './events/CommunityEventCreateDialog';
import CommunityEventCard from './events/CommunityEventCard';
import CommunityEventsEmptyState from './events/CommunityEventsEmptyState';
import BackToDashboard from './BackToDashboard';

interface CommunityEventsTabProps {
  communityId: string;
  isAdmin?: boolean;
}

const CommunityEventsTab = ({ communityId, isAdmin = false }: CommunityEventsTabProps) => {
  const { events, loading, createEvent } = useCommunityEvents(communityId);

  if (loading) {
    return <div className="text-center py-8">Loading events...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <BackToDashboard />
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Community Events ({events.length})
          </CardTitle>
          {isAdmin && <CommunityEventCreateDialog onCreateEvent={createEvent} />}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {events.map((event) => (
              <CommunityEventCard key={event.id} event={event} />
            ))}
            {events.length === 0 && <CommunityEventsEmptyState />}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunityEventsTab;
