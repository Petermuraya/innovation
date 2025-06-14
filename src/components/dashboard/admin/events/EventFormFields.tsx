
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface EventFormFieldsProps {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  date: string;
  setDate: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
  price: number;
  setPrice: (value: number) => void;
  maxAttendees: number | undefined;
  setMaxAttendees: (value: number | undefined) => void;
  requiresRegistration: boolean;
  setRequiresRegistration: (value: boolean) => void;
  visibility: string;
  setVisibility: (value: string) => void;
  isPublished: boolean;
  setIsPublished: (value: boolean) => void;
}

const EventFormFields = ({
  title, setTitle,
  description, setDescription,
  date, setDate,
  location, setLocation,
  price, setPrice,
  maxAttendees, setMaxAttendees,
  requiresRegistration, setRequiresRegistration,
  visibility, setVisibility,
  isPublished, setIsPublished,
}: EventFormFieldsProps) => {
  return (
    <div className="space-y-4">
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
    </div>
  );
};

export default EventFormFields;
