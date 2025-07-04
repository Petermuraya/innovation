
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Clock, Users } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;
  location?: string;
  max_attendees?: number;
  registration_fee?: number;
  status: string;
}

const DashboardEvents: React.FC = () => {
  const { member } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (member) {
      fetchEvents();
    }
  }, [member]);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .gte('date', new Date().toISOString())
        .order('date', { ascending: true })
        .limit(10);

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading events...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Upcoming Events</h3>
        <p className="text-muted-foreground">Events you can register for and attend</p>
      </div>

      <div className="grid gap-6">
        {events.map((event) => (
          <Card key={event.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    {event.title}
                  </CardTitle>
                  <CardDescription>
                    {new Date(event.date).toLocaleDateString()} at{' '}
                    {new Date(event.date).toLocaleTimeString()}
                  </CardDescription>
                </div>
                <Badge variant="secondary">
                  {event.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {event.description && (
                <p className="text-sm text-muted-foreground mb-4">
                  {event.description}
                </p>
              )}
              
              <div className="space-y-2 mb-4">
                {event.location && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {event.location}
                  </div>
                )}
                {event.max_attendees && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    Max {event.max_attendees} attendees
                  </div>
                )}
                {event.registration_fee && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="font-medium">Fee: KES {event.registration_fee}</span>
                  </div>
                )}
              </div>

              <Button variant="default" size="sm">
                Register
              </Button>
            </CardContent>
          </Card>
        ))}

        {events.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No upcoming events at the moment. Check back later!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DashboardEvents;
