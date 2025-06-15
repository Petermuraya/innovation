
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, Edit, Trash2, Eye, EyeOff, Clock, DollarSign } from 'lucide-react';
import { format } from 'date-fns';

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

interface EventCardProps {
  event: Event;
  onEdit: (event: Event) => void;
  onDelete: (eventId: string) => void;
  onTogglePublish: (event: Event) => void;
}

const EventCard = ({ event, onEdit, onDelete, onTogglePublish }: EventCardProps) => {
  const isUpcoming = new Date(event.date) >= new Date();
  const isPast = new Date(event.date) < new Date();

  return (
    <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex gap-6">
        {/* Event Image */}
        <div className="flex-shrink-0">
          {event.image_url ? (
            <img
              src={event.image_url}
              alt={event.title}
              className="w-24 h-24 object-cover rounded-lg border"
            />
          ) : (
            <div className="w-24 h-24 bg-gradient-to-br from-kic-green-100 to-kic-green-200 rounded-lg flex items-center justify-center border">
              <Calendar className="h-8 w-8 text-kic-green-600" />
            </div>
          )}
        </div>

        {/* Event Details */}
        <div className="flex-1 min-w-0">
          {/* Header with Title and Badges */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h4 className="text-lg font-semibold text-gray-900 truncate mb-2">{event.title}</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant={event.is_published ? 'default' : 'secondary'}>
                  {event.is_published ? 'Published' : 'Draft'}
                </Badge>
                <Badge variant="outline" className={event.visibility === 'everyone' ? 'border-blue-300 text-blue-700' : 'border-purple-300 text-purple-700'}>
                  {event.visibility === 'everyone' ? 'Public' : 'Members Only'}
                </Badge>
                {event.requires_registration && (
                  <Badge variant="outline" className="border-orange-300 text-orange-700">
                    Registration Required
                  </Badge>
                )}
                {isPast && (
                  <Badge variant="outline" className="border-gray-300 text-gray-600">
                    Past Event
                  </Badge>
                )}
                {isUpcoming && (
                  <Badge variant="outline" className="border-green-300 text-green-700">
                    Upcoming
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          {/* Description */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
          
          {/* Event Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-kic-green-600" />
              <span>{format(new Date(event.date), 'MMM dd, yyyy')}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-kic-green-600" />
              <span>{format(new Date(event.date), 'h:mm a')}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-kic-green-600" />
              <span className="truncate">{event.location}</span>
            </div>
            
            {event.max_attendees && (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-kic-green-600" />
                <span>Max {event.max_attendees} attendees</span>
              </div>
            )}
            
            {event.price > 0 && (
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-kic-green-600" />
                <span className="font-medium text-kic-green-700">KSh {event.price}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col gap-2 flex-shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onTogglePublish(event)}
            className="flex items-center gap-2 min-w-0"
          >
            {event.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span className="hidden sm:inline">
              {event.is_published ? 'Unpublish' : 'Publish'}
            </span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(event)}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            <span className="hidden sm:inline">Edit</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(event.id)}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:border-red-300"
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">Delete</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
