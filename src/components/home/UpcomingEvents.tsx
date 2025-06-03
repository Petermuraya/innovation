
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEventsData } from "@/components/events/useEventsData";

export default function UpcomingEvents() {
  const { events, loading } = useEventsData();
  
  // Get only upcoming events and limit to 3 for the homepage
  const now = new Date();
  const upcomingEvents = events
    .filter(event => new Date(event.date) >= now)
    .slice(0, 3);

  const getEventType = (event: any) => {
    const title = event.title.toLowerCase();
    if (title.includes('workshop')) return 'Workshop';
    if (title.includes('hackathon')) return 'Hackathon';
    if (title.includes('career') || title.includes('job')) return 'Career';
    if (title.includes('meetup')) return 'Meetup';
    if (title.includes('conference')) return 'Conference';
    return 'Event';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-12">
            <div>
              <h2 className="font-bold mb-2">Upcoming Events</h2>
              <p className="text-gray-600">Join our workshops, hackathons, and tech talks</p>
            </div>
            <Button variant="outline" asChild className="mt-4 sm:mt-0">
              <Link to="/events">View All Events</Link>
            </Button>
          </div>
          
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-kic-green-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading events...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-12">
          <div>
            <h2 className="font-bold mb-2">Upcoming Events</h2>
            <p className="text-gray-600">Join our workshops, hackathons, and tech talks</p>
          </div>
          <Button variant="outline" asChild className="mt-4 sm:mt-0">
            <Link to="/events">View All Events</Link>
          </Button>
        </div>
        
        {upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="card-hover overflow-hidden">
                <div className="relative">
                  <div className="w-full h-48 bg-gradient-to-r from-kic-green-500 to-kic-green-600 flex items-center justify-center">
                    <h3 className="text-white text-xl font-bold text-center px-4">
                      {event.title}
                    </h3>
                  </div>
                  <Badge className="absolute top-3 right-3">
                    {getEventType(event)}
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{event.title}</CardTitle>
                  <CardDescription className="flex flex-col">
                    <span>{formatDate(event.date)} • {formatTime(event.date)}</span>
                    <span className="mt-1">{event.location}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{event.description}</p>
                  {event.price > 0 && (
                    <div className="mt-2 font-semibold text-kic-green-600">
                      KSh {event.price}
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link to={`/events/${event.id}`}>
                      {event.requires_registration ? 'Register Now' : 'Learn More'}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📅</div>
            <p className="text-xl text-gray-600 mb-4">No upcoming events at the moment.</p>
            <p className="text-gray-500">Check back soon for exciting announcements!</p>
          </div>
        )}
      </div>
    </section>
  );
}
