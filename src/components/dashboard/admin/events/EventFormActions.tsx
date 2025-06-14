
import { Button } from '@/components/ui/button';

interface EventFormActionsProps {
  onSubmit: () => void;
  onCancel: () => void;
  submitting: boolean;
  isEditing: boolean;
}

const EventFormActions = ({ onSubmit, onCancel, submitting, isEditing }: EventFormActionsProps) => {
  return (
    <div className="flex gap-2 pt-4">
      <Button
        onClick={onSubmit}
        disabled={submitting}
        className="flex-1"
      >
        {submitting ? 'Saving...' : isEditing ? 'Update Event' : 'Create Event'}
      </Button>
      <Button
        variant="outline"
        onClick={onCancel}
      >
        Cancel
      </Button>
    </div>
  );
};

export default EventFormActions;
