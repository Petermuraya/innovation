
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEventsManagement } from '@/hooks/useEventsManagement';

interface EventFormFixedProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingEvent?: any;
  onEventSaved: () => void;
}

const EventFormFixed = ({ open, onOpenChange, editingEvent, onEventSaved }: EventFormFixedProps) => {
  const { createEvent, updateEvent } = useEventsManagement();
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    price: 0,
    max_attendees: '',
    requires_registration: true,
    visibility: 'members',
    is_published: false,
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      location: '',
      price: 0,
      max_attendees: '',
      requires_registration: true,
      visibility: 'members',
      is_published: false,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.date || !formData.location) {
      return;
    }

    setSubmitting(true);
    
    const eventData = {
      ...formData,
      max_attendees: formData.max_attendees ? parseInt(formData.max_attendees) : null,
      date: new Date(formData.date).toISOString(),
    };

    try {
      let success = false;
      if (editingEvent) {
        success = await updateEvent(editingEvent.id, eventData);
      } else {
        success = await createEvent(eventData);
      }

      if (success) {
        resetForm();
        onOpenChange(false);
        onEventSaved();
      }
    } catch (error) {
      console.error('Error saving event:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRequiresRegistrationChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, requires_registration: checked }));
  };

  const handleIsPublishedChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, is_published: checked }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingEvent ? 'Edit Event' : 'Create New Event'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter event title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Event description"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date & Time *</Label>
              <Input
                id="date"
                type="datetime-local"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Event location"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (KSh)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max_attendees">Max Attendees</Label>
              <Input
                id="max_attendees"
                type="number"
                min="1"
                value={formData.max_attendees}
                onChange={(e) => setFormData(prev => ({ ...prev, max_attendees: e.target.value }))}
                placeholder="Leave empty for unlimited"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="visibility">Visibility</Label>
            <Select value={formData.visibility} onValueChange={(value) => setFormData(prev => ({ ...prev, visibility: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="everyone">Public</SelectItem>
                <SelectItem value="members">Members Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="requires_registration"
              checked={formData.requires_registration}
              onCheckedChange={handleRequiresRegistrationChange}
            />
            <Label htmlFor="requires_registration">Requires Registration</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_published"
              checked={formData.is_published}
              onCheckedChange={handleIsPublishedChange}
            />
            <Label htmlFor="is_published">Publish Event</Label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="flex-1"
            >
              {submitting ? 'Saving...' : (editingEvent ? 'Update Event' : 'Create Event')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EventFormFixed;
