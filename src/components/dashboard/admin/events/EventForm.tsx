
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useEventForm } from './useEventForm';
import EventImageUpload from './EventImageUpload';
import EventFormFields from './EventFormFields';
import EventFormActions from './EventFormActions';

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
  const {
    title, setTitle,
    description, setDescription,
    date, setDate,
    location, setLocation,
    price, setPrice,
    maxAttendees, setMaxAttendees,
    requiresRegistration, setRequiresRegistration,
    visibility, setVisibility,
    isPublished, setIsPublished,
    submitting,
    selectedImage, setSelectedImage,
    resetForm,
    loadEventData,
    handleSubmit,
  } = useEventForm(editingEvent, onEventSaved, () => onOpenChange(false));

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen && editingEvent) {
      loadEventData();
    } else if (!newOpen) {
      resetForm();
    }
    onOpenChange(newOpen);
  };

  return (

    <Dialog open={open} onOpenChange={handleOpenChange}>

      <DialogContent className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6
       shadow-lg sm:max-w-lg max-h-[90vh] overflow-y-auto mt-14">
        <DialogHeader>
          <DialogTitle>
            {editingEvent ? 'Edit Event' : 'Create New Event'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <EventImageUpload
            selectedImage={selectedImage}
            onImageSelect={setSelectedImage}
            onImageRemove={() => setSelectedImage(null)}
            previewUrl={editingEvent?.image_url}
          />

          <EventFormFields
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            date={date}
            setDate={setDate}
            location={location}
            setLocation={setLocation}
            price={price}
            setPrice={setPrice}
            maxAttendees={maxAttendees}
            setMaxAttendees={setMaxAttendees}
            requiresRegistration={requiresRegistration}
            setRequiresRegistration={setRequiresRegistration}
            visibility={visibility}
            setVisibility={setVisibility}
            isPublished={isPublished}
            setIsPublished={setIsPublished}
          />

          <EventFormActions
            onSubmit={handleSubmit}
            onCancel={() => handleOpenChange(false)}
            submitting={submitting}
            isEditing={!!editingEvent}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventForm;
