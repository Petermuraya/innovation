
import { Card, CardContent } from '@/components/ui/card';

const CareerOpportunitiesEmptyState = () => {
  return (
    <Card>
      <CardContent className="text-center py-8">
        <p className="text-gray-600">No career opportunities posted yet.</p>
      </CardContent>
    </Card>
  );
};

export default CareerOpportunitiesEmptyState;
