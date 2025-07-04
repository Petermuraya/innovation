
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface EventFormProps {
  onSuccess?: () => void;
}

const EventForm: React.FC<EventFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    max_attendees: '',
    registration_fee: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const eventDateTime = new Date(`${formData.date}T${formData.time}`);
      
      const { error } = await supabase
        .from('events')
        .insert({
          title: formData.title,
          description: formData.description,
          date: eventDateTime.toISOString(),
          location: formData.location,
          max_attendees: formData.max_attendees ? parseInt(formData.max_attendees) : null,
          registration_fee: formData.registration_fee ? parseFloat(formData.registration_fee) : null
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Event created successfully',
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        max_attendees: '',
        registration_fee: ''
      });

      onSuccess?.();
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: 'Error',
        description: 'Failed to create event',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Event</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="max_attendees">Max Attendees</Label>
              <Input
                id="max_attendees"
                type="number"
                value={formData.max_attendees}
                onChange={(e) => setFormData({ ...formData, max_attendees: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="registration_fee">Registration Fee</Label>
              <Input
                id="registration_fee"
                type="number"
                step="0.01"
                value={formData.registration_fee}
                onChange={(e) => setFormData({ ...formData, registration_fee: e.target.value })}
              />
            </div>
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Event'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EventForm;
