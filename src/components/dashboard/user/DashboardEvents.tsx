
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DashboardEventsProps {
  upcomingEvents: any[];
}

const DashboardEvents = ({ upcomingEvents }: DashboardEventsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Events</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {upcomingEvents.map((event) => (
            <div key={event.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-kic-gray">{event.title}</h4>
                  <p className="text-sm text-kic-gray/70 mt-1">{event.description}</p>
                  <p className="text-sm text-kic-gray/70">📅 {new Date(event.date).toLocaleDateString()}</p>
                  <p className="text-sm text-kic-gray/70">📍 {event.location}</p>
                  {event.price > 0 && (
                    <p className="text-sm font-medium text-kic-green-600">KSh {event.price}</p>
                  )}
                </div>
                <Button className="bg-kic-green-500 hover:bg-kic-green-600">
                  Register
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardEvents;
