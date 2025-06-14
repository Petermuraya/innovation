
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Clock, MapPin, Users, Plus, CheckSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface CommunityActivity {
  id: string;
  title: string;
  description: string;
  activity_type: string;
  scheduled_date: string;
  duration_minutes: number;
  location: string;
  max_participants?: number;
  registration_required: boolean;
  status: string;
  created_at: string;
  attendance_count?: number;
}

interface CommunityActivitiesTabProps {
  communityId: string;
  isAdmin: boolean;
}

const CommunityActivitiesTab = ({ communityId, isAdmin }: CommunityActivitiesTabProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activities, setActivities] = useState<CommunityActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    activity_type: 'weekly',
    scheduled_date: '',
    duration_minutes: '60',
    location: '',
    max_participants: '',
    registration_required: false,
  });

  useEffect(() => {
    fetchActivities();
  }, [communityId]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      
      const { data: activitiesData, error } = await supabase
        .from('community_activities')
        .select('*')
        .eq('community_id', communityId)
        .order('scheduled_date', { ascending: false });

      if (error) throw error;

      // Get attendance counts for each activity
      const enrichedActivities = await Promise.all(
        (activitiesData || []).map(async (activity) => {
          const { count } = await supabase
            .from('community_activity_attendance')
            .select('*', { count: 'exact', head: true })
            .eq('activity_id', activity.id)
            .eq('attended', true);

          return {
            ...activity,
            attendance_count: count || 0,
          };
        })
      );

      setActivities(enrichedActivities);
    } catch (error) {
      console.error('Error fetching activities:', error);
      toast({
        title: "Error",
        description: "Failed to load community activities",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateActivity = async () => {
    if (!formData.title || !formData.scheduled_date) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('community_activities')
        .insert({
          community_id: communityId,
          title: formData.title,
          description: formData.description,
          activity_type: formData.activity_type,
          scheduled_date: formData.scheduled_date,
          duration_minutes: parseInt(formData.duration_minutes),
          location: formData.location,
          max_participants: formData.max_participants ? parseInt(formData.max_participants) : null,
          registration_required: formData.registration_required,
          created_by: user?.id,
        });

      if (error) throw error;

      toast({
        title: "Activity created",
        description: "Community activity has been created successfully",
      });

      setFormData({
        title: '',
        description: '',
        activity_type: 'weekly',
        scheduled_date: '',
        duration_minutes: '60',
        location: '',
        max_participants: '',
        registration_required: false,
      });
      setShowCreateForm(false);
      await fetchActivities();
    } catch (error) {
      console.error('Error creating activity:', error);
      toast({
        title: "Error",
        description: "Failed to create activity",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActivityTypeIcon = (type: string) => {
    switch (type) {
      case 'weekly': return <Calendar className="h-4 w-4" />;
      case 'workshop': return <Users className="h-4 w-4" />;
      case 'meeting': return <CheckSquare className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading activities...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Community Activities</h3>
          <p className="text-sm text-gray-600">Weekly meetings, workshops, and community events</p>
        </div>
        {isAdmin && (
          <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Activity
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Activity</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Activity title"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Activity description"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="activity_type">Activity Type</Label>
                  <Select value={formData.activity_type} onValueChange={(value) => setFormData({ ...formData, activity_type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly Meeting</SelectItem>
                      <SelectItem value="workshop">Workshop</SelectItem>
                      <SelectItem value="meeting">Special Meeting</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="scheduled_date">Scheduled Date & Time *</Label>
                  <Input
                    id="scheduled_date"
                    type="datetime-local"
                    value={formData.scheduled_date}
                    onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="duration_minutes">Duration (minutes)</Label>
                  <Input
                    id="duration_minutes"
                    type="number"
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
                    placeholder="60"
                  />
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Meeting location"
                  />
                </div>

                <div>
                  <Label htmlFor="max_participants">Max Participants</Label>
                  <Input
                    id="max_participants"
                    type="number"
                    value={formData.max_participants}
                    onChange={(e) => setFormData({ ...formData, max_participants: e.target.value })}
                    placeholder="Leave empty for unlimited"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={handleCreateActivity}
                    disabled={submitting}
                    className="flex-1"
                  >
                    {submitting ? 'Creating...' : 'Create Activity'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activities.map((activity) => (
          <Card key={activity.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getActivityTypeIcon(activity.activity_type)}
                  <CardTitle className="text-lg">{activity.title}</CardTitle>
                </div>
                <Badge className={getStatusColor(activity.status)}>
                  {activity.status}
                </Badge>
              </div>
              {activity.description && (
                <CardDescription>{activity.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(activity.scheduled_date).toLocaleString()}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{activity.duration_minutes} minutes</span>
                </div>

                {activity.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{activity.location}</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>
                    {activity.attendance_count || 0} attended
                    {activity.max_participants && ` / ${activity.max_participants} max`}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1 mt-3">
                  <Badge variant="outline" className="text-xs">
                    {activity.activity_type}
                  </Badge>
                  {activity.registration_required && (
                    <Badge variant="outline" className="text-xs">
                      Registration Required
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {activities.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No activities yet</h3>
          <p className="text-gray-500">
            {isAdmin ? 'Create your first community activity to get started.' : 'Activities will appear here when they are scheduled.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default CommunityActivitiesTab;
