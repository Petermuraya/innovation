
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import ImageUploader from '@/components/uploads/ImageUploader';

interface CommunityEventCreateDialogProps {
  onCreateEvent: (eventData: {
    title: string;
    description: string;
    date: string;
    location: string;
    max_attendees: string;
  }, selectedImage: File | null) => Promise<boolean>;
}

const CommunityEventCreateDialog = ({ onCreateEvent }: CommunityEventCreateDialogProps) => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    max_attendees: '',
  });

  const handleCreateEvent = async () => {
    const success = await onCreateEvent(eventForm, selectedImage);
    if (success) {
      setShowCreateDialog(false);
      setEventForm({ title: '', description: '', date: '', location: '', max_attendees: '' });
      setSelectedImage(null);
    }
  };

  const handleClose = () => {
    setShowCreateDialog(false);
    setSelectedImage(null);
  };

  return (
    <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Event
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Community Event</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <ImageUploader
            onImageSelect={setSelectedImage}
            onImageRemove={() => setSelectedImage(null)}
            selectedImage={selectedImage}
            maxSize={5}
            className="mb-4"
          />

          <div>
            <Label htmlFor="title">Event Title *</Label>
            <Input
              id="title"
              value={eventForm.title}
              onChange={(e) => setEventForm(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter event title"
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={eventForm.description}
              onChange={(e) => setEventForm(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Event description"
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="date">Date & Time *</Label>
            <Input
              id="date"
              type="datetime-local"
              value={eventForm.date}
              onChange={(e) => setEventForm(prev => ({ ...prev, date: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={eventForm.location}
              onChange={(e) => setEventForm(prev => ({ ...prev, location: e.target.value }))}
              placeholder="Event location"
            />
          </div>
          <div>
            <Label htmlFor="max_attendees">Max Attendees</Label>
            <Input
              id="max_attendees"
              type="number"
              value={eventForm.max_attendees}
              onChange={(e) => setEventForm(prev => ({ ...prev, max_attendees: e.target.value }))}
              placeholder="Leave empty for unlimited"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleCreateEvent}>
              Create Event
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommunityEventCreateDialog;
