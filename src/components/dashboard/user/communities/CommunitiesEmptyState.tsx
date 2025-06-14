
import { Users } from 'lucide-react';

const CommunitiesEmptyState = () => {
  return (
    <div className="text-center py-12">
      <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">No communities available</h3>
      <p className="text-gray-500">Communities will be available soon.</p>
    </div>
  );
};

export default CommunitiesEmptyState;
