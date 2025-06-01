import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SEOHead from "@/components/seo/SEOHead";
import StructuredData from "@/components/seo/StructuredData";

// Sample events data
const eventsData = [
  // Upcoming Events
  {
    id: 1,
    title: "Web Development Bootcamp",
    date: "June 15, 2025",
    time: "10:00 AM - 3:00 PM",
    location: "Karatina University, Lab 4",
    description: "Learn the fundamentals of modern web development with HTML, CSS, and JavaScript.",
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?fit=crop&w=600&h=350",
    type: "Workshop",
    status: "upcoming",
  },
  {
    id: 2,
    title: "AI Hackathon 2025",
    date: "July 8-10, 2025",
    time: "9:00 AM - 5:00 PM",
    location: "Innovation Hub, Main Campus",
    description: "Build innovative AI solutions to solve real-world problems in this 3-day hackathon.",
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?fit=crop&w=600&h=350",
    type: "Hackathon",
    status: "upcoming",
  },
  {
    id: 3,
    title: "Tech Career Fair",
    date: "July 20, 2025",
    time: "11:00 AM - 4:00 PM",
    location: "University Auditorium",
    description: "Connect with tech companies for internships and job opportunities.",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?fit=crop&w=600&h=350",
    type: "Career",
    status: "upcoming",
  },
  
  // Past Events
  {
    id: 4,
    title: "Introduction to Cloud Computing",
    date: "May 5, 2025",
    time: "2:00 PM - 5:00 PM",
    location: "Virtual Event",
    description: "Learn the basics of cloud computing and get started with AWS.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?fit=crop&w=600&h=350",
    type: "Workshop",
    status: "past",
  },
  {
    id: 5,
    title: "Mobile App Design Challenge",
    date: "April 12-13, 2025",
    time: "9:00 AM - 6:00 PM",
    location: "Design Lab, Main Campus",
    description: "Design innovative mobile app interfaces and compete for prizes.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?fit=crop&w=600&h=350",
    type: "Competition",
    status: "past",
  },
  {
    id: 6,
    title: "Open Source Contribution Day",
    date: "March 28, 2025",
    time: "10:00 AM - 4:00 PM",
    location: "Computer Lab 2",
    description: "Learn how to contribute to open-source projects and make your first contribution.",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?fit=crop&w=600&h=350",
    type: "Workshop",
    status: "past",
  },
];

const upcomingEvents = eventsData.filter(event => event.status === "upcoming");
const pastEvents = eventsData.filter(event => event.status === "past");

const Events = () => {
  const [activeTab, setActiveTab] = useState("upcoming");

  return (
    <div>
      <SEOHead
        title="Events & Workshops"
        description="Join our upcoming tech events, workshops, hackathons, and networking sessions. Learn, build, and connect with fellow innovators at Karatina University."
        canonical="/events"
        keywords={["tech events", "workshops", "hackathons", "networking", "programming bootcamp", "innovation meetups"]}
      />
      
      <StructuredData type="events" events={upcomingEvents} />

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
                <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
                <TabsTrigger value="past">Past Events</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="upcoming">
              {upcomingEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingEvents.map((event) => (
                    <Card key={event.id} className="card-hover overflow-hidden">
                      <div className="relative">
                        <img 
                          src={event.image} 
                          alt={event.title} 
                          className="w-full h-48 object-cover"
                        />
                        <Badge className="absolute top-3 right-3">
                          {event.type}
                        </Badge>
                      </div>
                      <CardHeader>
                        <CardTitle className="text-xl">{event.title}</CardTitle>
                        <CardDescription className="flex flex-col">
                          <span>{event.date} • {event.time}</span>
                          <span className="mt-1">{event.location}</span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">{event.description}</p>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full" asChild>
                          <Link to={`/events/${event.id}`}>Register Now</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
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
                        <img 
                          src={event.image} 
                          alt={event.title} 
                          className="w-full h-48 object-cover filter grayscale-[30%]"
                        />
                        <Badge className="absolute top-3 right-3" variant="outline">
                          {event.type}
                        </Badge>
                      </div>
                      <CardHeader>
                        <CardTitle className="text-xl">{event.title}</CardTitle>
                        <CardDescription className="flex flex-col">
                          <span>{event.date} • {event.time}</span>
                          <span className="mt-1">{event.location}</span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">{event.description}</p>
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
