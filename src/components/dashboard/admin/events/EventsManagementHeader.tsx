
import { Button } from '@/components/ui/button';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';

interface EventsManagementHeaderProps {
  onCreateEvent: () => void;
}

const EventsManagementHeader = ({ onCreateEvent }: EventsManagementHeaderProps) => {
  return (
    <CardHeader>
      <CardTitle className="flex items-center justify-between">
        Event Management
        <Button 
          className="flex items-center gap-2"
          onClick={onCreateEvent}
        >
          <Plus className="h-4 w-4" />
          Create Event
        </Button>
      </CardTitle>
      <CardDescription>Create and manage events with advanced controls</CardDescription>
    </CardHeader>
  );
};

export default EventsManagementHeader;
