
import { Card, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';

const ConstitutionEmptyState = () => {
  return (
    <Card>
      <CardContent className="text-center py-8">
        <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Constitution Documents Available</h3>
        <p className="text-gray-600">
          Constitution documents have not been uploaded yet. Please check back later.
        </p>
      </CardContent>
    </Card>
  );
};

export default ConstitutionEmptyState;
