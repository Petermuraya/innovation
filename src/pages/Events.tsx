
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, MapPin } from 'lucide-react';

const Events = () => {
  const upcomingEvents = [
    {
      id: 1,
      title: "Tech Innovation Workshop",
      date: "2024-01-15",
      time: "2:00 PM - 5:00 PM",
      location: "Computer Lab A",
      description: "Join us for an intensive workshop on emerging technologies and innovation methodologies."
    },
    {
      id: 2,
      title: "Hackathon 2024",
      date: "2024-01-22",
      time: "9:00 AM - 6:00 PM",
      location: "Main Auditorium",
      description: "24-hour coding challenge to solve real-world problems with innovative solutions."
    },
    {
      id: 3,
      title: "Industry Networking Session",
      date: "2024-01-29",
      time: "3:00 PM - 6:00 PM",
      location: "Conference Hall",
      description: "Connect with industry professionals and explore career opportunities in tech."
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-kic-lightGray py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold text-kic-gray mb-8 text-center">
              Upcoming Events
            </h1>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <Card key={event.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-xl">{event.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                    <p className="text-gray-600 text-sm">
                      {event.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="mt-12">
              <CardHeader>
                <CardTitle>Stay Updated</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Don't miss out on our exciting events! Follow us on social media and 
                  check back regularly for updates on new workshops, competitions, and networking opportunities.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Events;
