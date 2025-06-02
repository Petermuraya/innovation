
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface WeeklyMeeting {
  id: string;
  day_of_week: string;
  time: string;
  location: string | null;
  description: string | null;
  is_active: boolean;
}

const WeeklyMeetings = () => {
  const { toast } = useToast();
  const [meetings, setMeetings] = useState<WeeklyMeeting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      const { data, error } = await supabase
        .from('weekly_meetings')
        .select('*')
        .eq('is_active', true)
        .order('day_of_week');

      if (error) throw error;

      // Sort by day of week (Monday first)
      const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      const sortedMeetings = (data || []).sort((a, b) => 
        dayOrder.indexOf(a.day_of_week) - dayOrder.indexOf(b.day_of_week)
      );

      setMeetings(sortedMeetings);
    } catch (error) {
      console.error('Error fetching meetings:', error);
      toast({
        title: "Error",
        description: "Failed to load weekly meetings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getDayColor = (day: string) => {
    const colors: {[key: string]: string} = {
      'Monday': 'bg-blue-100 text-blue-800',
      'Tuesday': 'bg-green-100 text-green-800',
      'Wednesday': 'bg-yellow-100 text-yellow-800',
      'Thursday': 'bg-purple-100 text-purple-800',
      'Friday': 'bg-pink-100 text-pink-800',
      'Saturday': 'bg-indigo-100 text-indigo-800',
      'Sunday': 'bg-red-100 text-red-800',
    };
    return colors[day] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <div className="text-center py-8">Loading weekly meetings...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-kic-gray mb-4">Weekly Meetings</h2>
        <p className="text-kic-gray/70 max-w-2xl mx-auto">
          Join our regular community meetings to connect, learn, and collaborate with fellow innovators.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {meetings.map((meeting) => (
          <Card key={meeting.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-lg">{meeting.day_of_week} Meeting</span>
                <Badge className={getDayColor(meeting.day_of_week)}>
                  {meeting.day_of_week}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-gray-500" />
                <span>{meeting.time}</span>
              </div>

              {meeting.location && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span>{meeting.location}</span>
                </div>
              )}

              {meeting.description && (
                <p className="text-gray-700 text-sm">{meeting.description}</p>
              )}

              <div className="pt-2 border-t">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Users className="w-3 h-3" />
                  <span>Open to all members</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {meetings.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No meetings scheduled</h3>
          <p className="text-gray-500">Weekly meetings will be announced soon.</p>
        </div>
      )}
    </div>
  );
};

export default WeeklyMeetings;
