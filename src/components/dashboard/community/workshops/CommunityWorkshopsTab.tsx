
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { BookOpen, Clock, MapPin, Users, Plus, DollarSign, Award } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface CommunityWorkshop {
  id: string;
  title: string;
  description: string;
  instructor_name: string;
  instructor_bio: string;
  start_date: string;
  end_date: string;
  location: string;
  max_participants: number;
  registration_fee: number;
  requirements: string[];
  learning_outcomes: string[];
  status: string;
  created_at: string;
  registration_count?: number;
  user_registered?: boolean;
}

interface CommunityWorkshopsTabProps {
  communityId: string;
  isAdmin: boolean;
}

const CommunityWorkshopsTab = ({ communityId, isAdmin }: CommunityWorkshopsTabProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [workshops, setWorkshops] = useState<CommunityWorkshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructor_name: '',
    instructor_bio: '',
    start_date: '',
    end_date: '',
    location: '',
    max_participants: '30',
    registration_fee: '0',
    requirements: '',
    learning_outcomes: '',
  });

  useEffect(() => {
    fetchWorkshops();
  }, [communityId]);

  const fetchWorkshops = async () => {
    try {
      setLoading(true);
      
      const { data: workshopsData, error } = await supabase
        .from('community_workshops')
        .select('*')
        .eq('community_id', communityId)
        .order('start_date', { ascending: false });

      if (error) throw error;

      // Get registration counts and user registration status for each workshop
      const enrichedWorkshops = await Promise.all(
        (workshopsData || []).map(async (workshop) => {
          const { count } = await supabase
            .from('workshop_registrations')
            .select('*', { count: 'exact', head: true })
            .eq('workshop_id', workshop.id)
            .eq('status', 'registered');

          const { data: userRegistration } = await supabase
            .from('workshop_registrations')
            .select('id')
            .eq('workshop_id', workshop.id)
            .eq('user_id', user?.id)
            .eq('status', 'registered')
            .single();

          return {
            ...workshop,
            registration_count: count || 0,
            user_registered: !!userRegistration,
          };
        })
      );

      setWorkshops(enrichedWorkshops);
    } catch (error) {
      console.error('Error fetching workshops:', error);
      toast({
        title: "Error",
        description: "Failed to load community workshops",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWorkshop = async () => {
    if (!formData.title || !formData.start_date || !formData.end_date) {
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
        .from('community_workshops')
        .insert({
          community_id: communityId,
          title: formData.title,
          description: formData.description,
          instructor_name: formData.instructor_name,
          instructor_bio: formData.instructor_bio,
          start_date: formData.start_date,
          end_date: formData.end_date,
          location: formData.location,
          max_participants: parseInt(formData.max_participants),
          registration_fee: parseFloat(formData.registration_fee),
          requirements: formData.requirements ? formData.requirements.split('\n').filter(r => r.trim()) : [],
          learning_outcomes: formData.learning_outcomes ? formData.learning_outcomes.split('\n').filter(o => o.trim()) : [],
          created_by: user?.id,
        });

      if (error) throw error;

      toast({
        title: "Workshop created",
        description: "Community workshop has been created successfully",
      });

      setFormData({
        title: '',
        description: '',
        instructor_name: '',
        instructor_bio: '',
        start_date: '',
        end_date: '',
        location: '',
        max_participants: '30',
        registration_fee: '0',
        requirements: '',
        learning_outcomes: '',
      });
      setShowCreateForm(false);
      await fetchWorkshops();
    } catch (error) {
      console.error('Error creating workshop:', error);
      toast({
        title: "Error",
        description: "Failed to create workshop",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegisterWorkshop = async (workshopId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('workshop_registrations')
        .insert({
          workshop_id: workshopId,
          user_id: user.id,
          status: 'registered',
        });

      if (error) throw error;

      toast({
        title: "Registration successful",
        description: "You have been registered for the workshop",
      });

      await fetchWorkshops();
    } catch (error) {
      console.error('Error registering for workshop:', error);
      toast({
        title: "Error",
        description: "Failed to register for workshop",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading workshops...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Community Workshops</h3>
          <p className="text-sm text-gray-600">Skill-building workshops and training sessions</p>
        </div>
        {isAdmin && (
          <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Workshop
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Workshop</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Workshop Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Workshop title"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Workshop description"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="instructor_name">Instructor Name</Label>
                    <Input
                      id="instructor_name"
                      value={formData.instructor_name}
                      onChange={(e) => setFormData({ ...formData, instructor_name: e.target.value })}
                      placeholder="Instructor name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Workshop location"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="instructor_bio">Instructor Bio</Label>
                  <Textarea
                    id="instructor_bio"
                    value={formData.instructor_bio}
                    onChange={(e) => setFormData({ ...formData, instructor_bio: e.target.value })}
                    placeholder="Brief instructor biography"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start_date">Start Date & Time *</Label>
                    <Input
                      id="start_date"
                      type="datetime-local"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="end_date">End Date & Time *</Label>
                    <Input
                      id="end_date"
                      type="datetime-local"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="max_participants">Max Participants</Label>
                    <Input
                      id="max_participants"
                      type="number"
                      value={formData.max_participants}
                      onChange={(e) => setFormData({ ...formData, max_participants: e.target.value })}
                      placeholder="30"
                    />
                  </div>
                  <div>
                    <Label htmlFor="registration_fee">Registration Fee (KSh)</Label>
                    <Input
                      id="registration_fee"
                      type="number"
                      step="0.01"
                      value={formData.registration_fee}
                      onChange={(e) => setFormData({ ...formData, registration_fee: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="requirements">Requirements (one per line)</Label>
                  <Textarea
                    id="requirements"
                    value={formData.requirements}
                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                    placeholder="Basic programming knowledge&#10;Laptop required&#10;etc."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="learning_outcomes">Learning Outcomes (one per line)</Label>
                  <Textarea
                    id="learning_outcomes"
                    value={formData.learning_outcomes}
                    onChange={(e) => setFormData({ ...formData, learning_outcomes: e.target.value })}
                    placeholder="Build a web application&#10;Understand React concepts&#10;etc."
                    rows={3}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={handleCreateWorkshop}
                    disabled={submitting}
                    className="flex-1"
                  >
                    {submitting ? 'Creating...' : 'Create Workshop'}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {workshops.map((workshop) => (
          <Card key={workshop.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg">{workshop.title}</CardTitle>
                </div>
                <Badge className={getStatusColor(workshop.status)}>
                  {workshop.status}
                </Badge>
              </div>
              {workshop.description && (
                <CardDescription>{workshop.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {workshop.instructor_name && (
                <div className="flex items-center gap-2 text-sm">
                  <Award className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{workshop.instructor_name}</span>
                </div>
              )}

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>
                    {new Date(workshop.start_date).toLocaleString()} - {new Date(workshop.end_date).toLocaleString()}
                  </span>
                </div>

                {workshop.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{workshop.location}</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>
                    {workshop.registration_count || 0} / {workshop.max_participants} registered
                  </span>
                </div>

                {workshop.registration_fee > 0 && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    <span>KSh {workshop.registration_fee.toLocaleString()}</span>
                  </div>
                )}
              </div>

              {workshop.requirements && workshop.requirements.length > 0 && (
                <div>
                  <h5 className="font-medium text-sm mb-1">Requirements:</h5>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {workshop.requirements.slice(0, 3).map((req, index) => (
                      <li key={index} className="flex items-start gap-1">
                        <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                        {req}
                      </li>
                    ))}
                    {workshop.requirements.length > 3 && (
                      <li className="text-gray-500">+{workshop.requirements.length - 3} more...</li>
                    )}
                  </ul>
                </div>
              )}

              {workshop.learning_outcomes && workshop.learning_outcomes.length > 0 && (
                <div>
                  <h5 className="font-medium text-sm mb-1">What you'll learn:</h5>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {workshop.learning_outcomes.slice(0, 3).map((outcome, index) => (
                      <li key={index} className="flex items-start gap-1">
                        <span className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                        {outcome}
                      </li>
                    ))}
                    {workshop.learning_outcomes.length > 3 && (
                      <li className="text-gray-500">+{workshop.learning_outcomes.length - 3} more...</li>
                    )}
                  </ul>
                </div>
              )}

              {workshop.status === 'upcoming' && !workshop.user_registered && (
                <Button
                  onClick={() => handleRegisterWorkshop(workshop.id)}
                  className="w-full"
                  disabled={workshop.registration_count >= workshop.max_participants}
                >
                  {workshop.registration_count >= workshop.max_participants ? 'Workshop Full' : 'Register Now'}
                </Button>
              )}

              {workshop.user_registered && (
                <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                  <Users className="h-4 w-4" />
                  You're registered for this workshop
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {workshops.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No workshops yet</h3>
          <p className="text-gray-500">
            {isAdmin ? 'Create your first workshop to get started.' : 'Workshops will appear here when they are scheduled.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default CommunityWorkshopsTab;
