
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { UserPlus } from 'lucide-react';

export const EmptyNominationState = () => {
  return (
    <Card>
      <CardContent className="text-center py-12">
        <UserPlus className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No Open Nominations</h3>
        <p className="text-gray-500">There are currently no elections accepting candidate applications.</p>
      </CardContent>
    </Card>
  );
};
