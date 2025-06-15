
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { OnlineMeeting } from './types';

interface CreateMeetingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  communityId: string;
  onCreateMeeting: (meetingData: Omit<OnlineMeeting, 'id' | 'created_at' | 'updated_at'>) => Promise<any>;
}

const CreateMeetingDialog = ({ 
  open, 
  onOpenChange, 
  communityId, 
  onCreateMeeting 
}: CreateMeetingDialogProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    meeting_link: '',
    scheduled_date: '',
    duration_minutes: 60,
    max_participants: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const meetingData = {
        community_id: communityId,
        title: formData.title,
        description: formData.description || undefined,
        meeting_link: formData.meeting_link,
        scheduled_date: new Date(formData.scheduled_date).toISOString(),
        duration_minutes: formData.duration_minutes,
        max_participants: formData.max_participants ? parseInt(formData.max_participants) : undefined,
        created_by: user.id,
        status: 'scheduled' as const,
      };

      await onCreateMeeting(meetingData);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        meeting_link: '',
        scheduled_date: '',
        duration_minutes: 60,
        max_participants: '',
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating meeting:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateGoogleMeetLink = () => {
    // Generate a Google Meet link (this would typically integrate with Google Calendar API)
    const meetCode = Math.random().toString(36).substring(2, 12);
    setFormData(prev => ({
      ...prev,
      meeting_link: `https://meet.google.com/${meetCode}`
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule Online Meeting</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Meeting Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter meeting title"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Meeting description or agenda"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="meeting_link">Meeting Link</Label>
            <div className="flex gap-2">
              <Input
                id="meeting_link"
                value={formData.meeting_link}
                onChange={(e) => setFormData(prev => ({ ...prev, meeting_link: e.target.value }))}
                placeholder="https://meet.google.com/..."
                required
              />
              <Button
                type="button"
                variant="outline"
                onClick={generateGoogleMeetLink}
                className="whitespace-nowrap"
              >
                Generate
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="scheduled_date">Date & Time</Label>
            <Input
              id="scheduled_date"
              type="datetime-local"
              value={formData.scheduled_date}
              onChange={(e) => setFormData(prev => ({ ...prev, scheduled_date: e.target.value }))}
              required
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration_minutes}
                onChange={(e) => setFormData(prev => ({ ...prev, duration_minutes: parseInt(e.target.value) || 60 }))}
                min="15"
                max="480"
              />
            </div>

            <div>
              <Label htmlFor="max_participants">Max Participants</Label>
              <Input
                id="max_participants"
                type="number"
                value={formData.max_participants}
                onChange={(e) => setFormData(prev => ({ ...prev, max_participants: e.target.value }))}
                placeholder="No limit"
                min="1"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Scheduling...' : 'Schedule Meeting'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateMeetingDialog;
