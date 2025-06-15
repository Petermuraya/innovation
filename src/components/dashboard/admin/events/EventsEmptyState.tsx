
import { Calendar, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EventsEmptyStateProps {
  onCreateEvent?: () => void;
}

const EventsEmptyState = ({ onCreateEvent }: EventsEmptyStateProps) => {
  return (
    <div className="text-center py-12">
      <div className="max-w-md mx-auto">
        <div className="bg-gradient-to-br from-kic-green-100 to-kic-green-200 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <Calendar className="h-10 w-10 text-kic-green-600" />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
        <p className="text-gray-600 mb-6">
          Get started by creating your first event to engage with your community members.
        </p>
        
        {onCreateEvent && (
          <Button 
            onClick={onCreateEvent}
            className="bg-kic-green-500 hover:bg-kic-green-600 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Event
          </Button>
        )}
        
        <div className="mt-8 text-sm text-gray-500">
          <p>Events help you:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Engage with community members</li>
            <li>Share knowledge through workshops</li>
            <li>Build networking opportunities</li>
            <li>Track attendance and participation</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EventsEmptyState;
