
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SEOHead from "@/components/seo/SEOHead";
import StructuredData from "@/components/seo/StructuredData";
import { useEventsData } from "@/components/events/useEventsData";

const Events = () => {
  const { events, loading } = useEventsData();
  const [activeTab, setActiveTab] = useState("upcoming");

  // Separate upcoming and past events
  const now = new Date();
  const upcomingEvents = events.filter(event => new Date(event.date) >= now);
  const pastEvents = events.filter(event => new Date(event.date) < now);

  // Convert database events to the format expected by StructuredData
  const structuredDataEvents = upcomingEvents.map(event => ({
    ...event,
    time: formatTime(event.date),
    type: getEventType(event)
  }));

  const getEventType = (event: any) => {
    // Extract type from title or description, or default to "Event"
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-kic-green-500 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <SEOHead
        title="Events & Workshops"
        description="Join our upcoming tech events, workshops, hackathons, and networking sessions. Learn, build, and connect with fellow innovators at Karatina University."
        canonical="/events"
        keywords={["tech events", "workshops", "hackathons", "networking", "programming bootcamp", "innovation meetups"]}
      />
      
      <StructuredData type="events" events={structuredDataEvents} />

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-bold mb-6">
              <span className="gradient-text">Events</span>
            </h1>
            <p className="text-xl text-gray-600">
              Join our workshops, hackathons, and tech talks to learn and network
            </p>
          </div>
        </div>
      </section>

      {/* Events Listing */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab}>
            <div className="flex justify-center mb-8">
              <TabsList>
                <TabsTrigger value="upcoming">
                  Upcoming Events ({upcomingEvents.length})
                </TabsTrigger>
                <TabsTrigger value="past">
                  Past Events ({pastEvents.length})
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="upcoming">
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
                          {event.max_attendees && (
                            <span className="mt-1 text-sm">Max attendees: {event.max_attendees}</span>
                          )}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">{event.description}</p>
                        {event.price > 0 && (
                          <div className="mt-2 font-semibold text-kic-green-600">
                            Price: KSh {event.price}
                          </div>
                        )}
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full" asChild>
                          <Link to={`/events/${event.id}`}>
                            {event.requires_registration ? 'Register Now' : 'View Details'}
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
                  <p className="text-gray-500">Check back soon for new event announcements!</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="past">
              {pastEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pastEvents.map((event) => (
                    <Card key={event.id} className="card-hover overflow-hidden opacity-90">
                      <div className="relative">
                        <div className="w-full h-48 bg-gradient-to-r from-gray-400 to-gray-500 flex items-center justify-center">
                          <h3 className="text-white text-xl font-bold text-center px-4">
                            {event.title}
                          </h3>
                        </div>
                        <Badge className="absolute top-3 right-3" variant="outline">
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
                          <div className="mt-2 text-gray-500">
                            Price: KSh {event.price}
                          </div>
                        )}
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full" asChild>
                          <Link to={`/events/${event.id}`}>View Details</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📚</div>
                  <p className="text-xl text-gray-600">No past events to display.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default Events;
