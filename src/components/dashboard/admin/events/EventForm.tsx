
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import ImageUploader from '@/components/uploads/ImageUploader';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  price: number;
  status: string;
  visibility: string;
  is_published: boolean;
  max_attendees?: number;
  requires_registration: boolean;
  created_at: string;
  image_url?: string;
}

interface EventFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingEvent: Event | null;
  onEventSaved: () => void;
}

const EventForm = ({ open, onOpenChange, editingEvent, onEventSaved }: EventFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState(0);
  const [maxAttendees, setMaxAttendees] = useState<number | undefined>();
  const [requiresRegistration, setRequiresRegistration] = useState(false);
  const [visibility, setVisibility] = useState('members');
  const [isPublished, setIsPublished] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDate('');
    setLocation('');
    setPrice(0);
    setMaxAttendees(undefined);
    setRequiresRegistration(false);
    setVisibility('members');
    setIsPublished(false);
    setSelectedImage(null);
  };

  const uploadEventImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `event-banners/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('event-images')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        return null;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('event-images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!user || !title.trim() || !description.trim() || !date || !location.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      let imageUrl = editingEvent?.image_url || null;

      if (selectedImage) {
        const uploadedImageUrl = await uploadEventImage(selectedImage);
        if (uploadedImageUrl) {
          imageUrl = uploadedImageUrl;
        } else {
          toast({
            title: "Image upload failed",
            description: "The event will be saved without an image",
            variant: "destructive",
          });
        }
      }

      const eventData = {
        title: title.trim(),
        description: description.trim(),
        date: new Date(date).toISOString(),
        location: location.trim(),
        price: price,
        max_attendees: maxAttendees,
        requires_registration: requiresRegistration,
        visibility: visibility,
        is_published: isPublished,
        status: isPublished ? 'published' : 'draft',
        created_by: user.id,
        image_url: imageUrl,
      };

      let error;
      if (editingEvent) {
        ({ error } = await supabase
          .from('events')
          .update(eventData)
          .eq('id', editingEvent.id));
      } else {
        ({ error } = await supabase
          .from('events')
          .insert(eventData));
      }

      if (error) throw error;

      toast({
        title: editingEvent ? "Event updated" : "Event created",
        description: `Event has been ${editingEvent ? 'updated' : 'created'} successfully`,
      });

      resetForm();
      onOpenChange(false);
      onEventSaved();
    } catch (error) {
      console.error('Error saving event:', error);
      toast({
        title: "Error",
        description: "Failed to save event",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen && editingEvent) {
      setTitle(editingEvent.title);
      setDescription(editingEvent.description);
      setDate(new Date(editingEvent.date).toISOString().slice(0, 16));
      setLocation(editingEvent.location);
      setPrice(editingEvent.price);
      setMaxAttendees(editingEvent.max_attendees);
      setRequiresRegistration(editingEvent.requires_registration);
      setVisibility(editingEvent.visibility);
      setIsPublished(editingEvent.is_published);
      setSelectedImage(null);
    } else if (!newOpen) {
      resetForm();
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingEvent ? 'Edit Event' : 'Create New Event'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <ImageUploader
            onImageSelect={setSelectedImage}
            onImageRemove={() => setSelectedImage(null)}
            selectedImage={selectedImage}
            previewUrl={editingEvent?.image_url}
            maxSize={5}
            className="mb-4"
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Event title"
              />
            </div>
            <div>
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Event location"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Event description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date & Time *</Label>
              <Input
                id="date"
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="price">Price (KSh)</Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                min="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="maxAttendees">Max Attendees</Label>
              <Input
                id="maxAttendees"
                type="number"
                value={maxAttendees || ''}
                onChange={(e) => setMaxAttendees(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="Unlimited"
                min="1"
              />
            </div>
            <div>
              <Label htmlFor="visibility">Visibility</Label>
              <Select value={visibility} onValueChange={setVisibility}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="everyone">Everyone</SelectItem>
                  <SelectItem value="members">Members Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="requiresRegistration"
                checked={requiresRegistration}
                onCheckedChange={setRequiresRegistration}
              />
              <Label htmlFor="requiresRegistration">Requires Registration</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="isPublished"
                checked={isPublished}
                onCheckedChange={setIsPublished}
              />
              <Label htmlFor="isPublished">Publish Immediately</Label>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1"
            >
              {submitting ? 'Saving...' : editingEvent ? 'Update Event' : 'Create Event'}
            </Button>
            <Button
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventForm;
