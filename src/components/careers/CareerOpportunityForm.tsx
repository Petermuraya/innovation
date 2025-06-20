
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';
import { useCareerOpportunityForm } from './hooks/useCareerOpportunityForm';
import CareerOpportunityFormFields from './components/CareerOpportunityFormFields';

interface CareerOpportunityFormProps {
  opportunity?: any;
  onClose: () => void;
  onSuccess: () => void;
}

const CareerOpportunityForm = ({ opportunity, onClose, onSuccess }: CareerOpportunityFormProps) => {
  const { formData, loading, handleSubmit, handleChange } = useCareerOpportunityForm({
    opportunity,
    onSuccess
  });

  return (
    <div 
     className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
     >
      <Card 
      className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg sm:max-w-lg max-h-[90vh] overflow-y-auto mt-16"
      >
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{opportunity ? 'Edit' : 'Post'} Career Opportunity</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <CareerOpportunityFormFields
              formData={formData}
              handleChange={handleChange}
            />

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? (opportunity ? 'Updating...' : 'Posting...') : (opportunity ? 'Update Opportunity' : 'Post Opportunity')}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CareerOpportunityForm;
