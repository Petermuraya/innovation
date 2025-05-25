
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  price: number;
  status: string;
}

interface EventsManagementProps {
  events: Event[];
}

const EventsManagement = ({ events }: EventsManagementProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Management</CardTitle>
        <CardDescription>Create and manage events</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button className="bg-kic-green-500 hover:bg-kic-green-600">
            Create New Event
          </Button>
          {events.map((event) => (
            <div key={event.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-kic-gray">{event.title}</h4>
                  <p className="text-sm text-kic-gray/70">{event.description}</p>
                  <p className="text-sm text-kic-gray/70">📅 {new Date(event.date).toLocaleDateString()}</p>
                  <p className="text-sm text-kic-gray/70">📍 {event.location}</p>
                  <p className="text-sm text-kic-gray/70">💰 KSh {event.price}</p>
                </div>
                <Badge variant={event.status === 'published' ? 'default' : 'secondary'}>
                  {event.status}
                </Badge>
              </div>
            </div>
          ))}
          {events.length === 0 && (
            <p className="text-kic-gray/70">No events found</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EventsManagement;
