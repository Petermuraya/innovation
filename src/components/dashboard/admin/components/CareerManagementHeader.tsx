
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface CareerManagementHeaderProps {
  onPostNew: () => void;
}

const CareerManagementHeader = ({ onPostNew }: CareerManagementHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h3 className="text-xl font-semibold">Career Opportunities Management</h3>
      <Button onClick={onPostNew} className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Post New Opportunity
      </Button>
    </div>
  );
};

export default CareerManagementHeader;
