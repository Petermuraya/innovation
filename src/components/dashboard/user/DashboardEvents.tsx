
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, DollarSign } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  price: number;
  max_attendees?: number;
  requires_registration: boolean;
  visibility: string;
}

const DashboardEvents = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [registeredEvents, setRegisteredEvents] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchEvents();
    if (user) {
      fetchUserRegistrations();
    }
  }, [user]);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_published', true)
        .gte('date', new Date().toISOString())
        .order('date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: "Error",
        description: "Failed to load events",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRegistrations = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('event_registrations')
        .select('event_id')
        .eq('user_id', user.id);

      if (error) throw error;

      const registeredIds = new Set(data?.map(reg => reg.event_id) || []);
      setRegisteredEvents(registeredIds);
    } catch (error) {
      console.error('Error fetching user registrations:', error);
    }
  };

  const handleRegister = async (eventId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to register for events",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('event_registrations')
        .insert({
          event_id: eventId,
          user_id: user.id,
          payment_status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Registration successful",
        description: "You have been registered for the event",
      });

      await fetchUserRegistrations();
    } catch (error) {
      console.error('Error registering for event:', error);
      toast({
        title: "Error",
        description: "Failed to register for event",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading events...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Events</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {events.map((event) => (
            <div key={event.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium text-kic-gray">{event.title}</h4>
                    {event.visibility === 'members' && (
                      <Badge variant="secondary">Members Only</Badge>
                    )}
                    {event.requires_registration && (
                      <Badge variant="outline">Registration Required</Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-kic-gray/70 mb-3">{event.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-kic-gray/70 mb-3">
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
                  </div>
                  
                  {event.price > 0 && (
                    <div className="flex items-center gap-1 text-sm font-medium text-kic-green-600 mb-3">
                      <DollarSign className="h-4 w-4" />
                      KSh {event.price}
                    </div>
                  )}
                </div>
                
                <div className="ml-4">
                  {registeredEvents.has(event.id) ? (
                    <Badge className="bg-green-500">Registered</Badge>
                  ) : (
                    <Button 
                      className="bg-kic-green-500 hover:bg-kic-green-600"
                      onClick={() => handleRegister(event.id)}
                    >
                      Register
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {events.length === 0 && (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-kic-gray/70">No upcoming events at the moment.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardEvents;
