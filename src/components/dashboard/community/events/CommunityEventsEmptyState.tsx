
import { Calendar } from 'lucide-react';

const CommunityEventsEmptyState = () => {
  return (
    <div className="text-center py-8">
      <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">No Events</h3>
      <p className="text-gray-500">This community doesn't have any events yet.</p>
    </div>
  );
};

export default CommunityEventsEmptyState;
