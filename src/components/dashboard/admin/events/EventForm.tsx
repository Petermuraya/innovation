import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export interface EventFormProps {
  editingEvent?: any;
  onEventSaved: () => Promise<void>;
}

const EventForm: React.FC<EventFormProps> = ({ editingEvent, onEventSaved }) => {
  const [title, setTitle] = React.useState(editingEvent?.title || '');
  const [description, setDescription] = React.useState(editingEvent?.description || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    await onEventSaved();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Event Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter event title"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter event description"
          rows={4}
        />
      </div>

      <Button type="submit">
        {editingEvent ? 'Update Event' : 'Create Event'}
      </Button>
    </form>
  );
};

export default EventForm;
