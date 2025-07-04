
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Users, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CommunityAttendanceTabProps {
  communityId: string;
}

interface Activity {
  id: string;
  title: string;
  scheduled_date: string;
  status: string;
  attendance_count?: number;
}

const CommunityAttendanceTab: React.FC<CommunityAttendanceTabProps> = ({ communityId }) => {
  const { member } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (member && communityId) {
      fetchActivities();
    }
  }, [member, communityId]);

  const fetchActivities = async () => {
    try {
      const { data, error } = await supabase
        .from('community_activities')
        .select('*')
        .eq('community_id', communityId)
        .order('scheduled_date', { ascending: false });

      if (error) throw error;
      setActivities(data || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch activities',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading activities...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Activity Attendance</h3>
        <p className="text-muted-foreground">Track attendance for community activities</p>
      </div>

      <div className="grid gap-4">
        {activities.map((activity) => (
          <Card key={activity.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    {activity.title}
                  </CardTitle>
                  <CardDescription>
                    {new Date(activity.scheduled_date).toLocaleDateString()}
                  </CardDescription>
                </div>
                <Badge variant={activity.status === 'completed' ? 'default' : 'secondary'}>
                  {activity.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  {activity.attendance_count || 0} attendees
                </div>
                {activity.status === 'completed' && (
                  <Button variant="outline" size="sm">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    View Attendance
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CommunityAttendanceTab;
