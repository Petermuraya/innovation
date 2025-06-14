
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, Edit, Trash2, Eye, EyeOff } from 'lucide-react';

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
  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-start">
        <div className="flex gap-4 flex-1">
          {event.image_url && (
            <img
              src={event.image_url}
              alt={event.title}
              className="w-20 h-20 object-cover rounded-lg"
            />
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-medium text-kic-gray">{event.title}</h4>
              <Badge variant={event.is_published ? 'default' : 'secondary'}>
                {event.is_published ? 'Published' : 'Draft'}
              </Badge>
              <Badge variant="outline">
                {event.visibility === 'everyone' ? 'Public' : 'Members Only'}
              </Badge>
              {event.requires_registration && (
                <Badge variant="outline">Registration Required</Badge>
              )}
            </div>
            
            <p className="text-sm text-kic-gray/70 mb-2">{event.description}</p>
            
            <div className="flex items-center gap-4 text-sm text-kic-gray/70">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(event.date).toLocaleDateString()} at {new Date(event.date).toLocaleTimeString()}
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {event.location}
              </div>
              {event.max_attendees && (
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  Max {event.max_attendees}
                </div>
              )}
              {event.price > 0 && (
                <div className="font-medium text-kic-green-600">
                  KSh {event.price}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onTogglePublish(event)}
            className="flex items-center gap-1"
          >
            {event.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {event.is_published ? 'Unpublish' : 'Publish'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(event)}
            className="flex items-center gap-1"
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(event.id)}
            className="flex items-center gap-1 text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
