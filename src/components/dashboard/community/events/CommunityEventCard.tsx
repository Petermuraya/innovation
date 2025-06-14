
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin } from 'lucide-react';

interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  max_attendees?: number;
  status: string;
  created_at: string;
  image_url?: string;
}

interface CommunityEventCardProps {
  event: CommunityEvent;
}

const CommunityEventCard = ({ event }: CommunityEventCardProps) => {
  return (
    <div className="border rounded-lg p-4">
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
  );
};

export default CommunityEventCard;
