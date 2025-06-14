
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

export const AllPositionsAppliedState = () => {
  return (
    <Card>
      <CardContent className="text-center py-8">
        <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">All Positions Applied</h3>
        <p className="text-gray-500">
          You have applied for all available positions in this election.
        </p>
      </CardContent>
    </Card>
  );
};
