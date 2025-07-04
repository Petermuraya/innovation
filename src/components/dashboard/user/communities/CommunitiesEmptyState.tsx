
import { Card, CardContent } from '@/components/ui/card';
import { Users, ArrowRight } from 'lucide-react';

const CommunitiesEmptyState = () => {
  return (
    <Card className="text-center py-12">
      <CardContent>
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Communities Available</h3>
        <p className="text-gray-600 mb-6">
          Communities are being set up. Check back soon to join exciting innovation groups!
        </p>
        <div className="flex items-center justify-center text-sm text-gray-500">
          <span>Stay tuned for updates</span>
          <ArrowRight className="w-4 h-4 ml-2" />
        </div>
      </CardContent>
    </Card>
  );
};

export default CommunitiesEmptyState;
