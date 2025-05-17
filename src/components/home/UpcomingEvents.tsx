
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Sample events data
const events = [
  {
    id: 1,
    title: "Web Development Bootcamp",
    date: "June 15, 2025",
    time: "10:00 AM - 3:00 PM",
    location: "Karatina University, Lab 4",
    description: "Learn the fundamentals of modern web development with HTML, CSS, and JavaScript.",
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?fit=crop&w=600&h=350",
    type: "Workshop",
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
  },
];

export default function UpcomingEvents() {
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
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
      </div>
    </section>
  );
}
