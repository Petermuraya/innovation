import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, Clock, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  max_attendees?: number;
  is_published: boolean;
  image_url?: string;
  price?: number;
  created_at: string;
  created_by: string;
  registration_fields?: any;
  slug?: string;
  tags?: string[];
  updated_at: string;
  visibility: string;
}

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchEvents();
  }, []);

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-blue-50 py-12">
        <div className="container mx-auto px-6">
          <div className="text-center flex flex-col items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-4" />
            <p className="text-lg text-gray-600">Loading upcoming events...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-blue-50 py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div 
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <motion.h1 
              className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-amber-500 mb-4"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              Upcoming Events
            </motion.h1>
            
            <motion.p 
              className="text-lg text-gray-600 max-w-3xl mx-auto"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Join us for exciting events, workshops, and networking opportunities that will 
              enhance your skills and expand your network in the innovation community.
            </motion.p>
          </div>

          {/* Floating decorative elements */}
          <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
            <motion.div
              className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-200/20 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.1, 0.15, 0.1],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-amber-200/20 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.05, 0.1, 0.05],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
            />
          </div>

          <AnimatePresence>
            {events.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="max-w-md mx-auto bg-white/80 backdrop-blur-sm border border-emerald-200/50">
                  <CardContent className="text-center py-12">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Upcoming Events</h3>
                    <p className="text-gray-600">
                      Check back soon for exciting events and workshops!
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div 
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, staggerChildren: 0.1 }}
              >
                {events.map((event) => (
                  <motion.div
                    key={event.id}
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="hover:shadow-xl transition-all duration-300 border border-emerald-200/50 bg-white/80 backdrop-blur-sm overflow-hidden group">
                      {event.image_url && (
                        <div className="aspect-video w-full overflow-hidden relative">
                          <img 
                            src={event.image_url} 
                            alt={event.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      )}
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-xl text-emerald-800">{event.title}</CardTitle>
                          {event.price && event.price > 0 && (
                            <Badge variant="secondary" className="bg-gradient-to-r from-amber-500 to-amber-600 text-white">
                              KSH {event.price}
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-gray-600">{event.description}</p>
                        
                        <div className="space-y-3 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4 text-emerald-600" />
                            <span>{formatDate(event.date)}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="w-4 h-4 text-emerald-600" />
                            <span>{event.location}</span>
                          </div>
                          
                          {event.max_attendees && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <Users className="w-4 h-4 text-emerald-600" />
                              <span>Max {event.max_attendees} participants</span>
                            </div>
                          )}
                        </div>

                        <div className="pt-4">
                          <Button 
                            className="w-full bg-gradient-to-r from-emerald-600 to-amber-500 hover:from-emerald-700 hover:to-amber-600 text-white shadow-md transition-all duration-300 hover:shadow-lg"
                          >
                            {event.price && event.price > 0 ? 'Register Now' : 'Learn More'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Events;