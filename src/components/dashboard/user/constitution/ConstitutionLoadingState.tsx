
import { Card, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';

const ConstitutionLoadingState = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <FileText className="w-6 h-6 text-kic-green-600" />
        <h2 className="text-2xl font-bold">Constitution</h2>
      </div>
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-600">Loading constitution documents...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConstitutionLoadingState;
