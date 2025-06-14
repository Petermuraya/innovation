
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Vote } from 'lucide-react';

interface VotingHeaderProps {
  electionTitle: string;
}

export const VotingHeader = ({ electionTitle }: VotingHeaderProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Vote className="w-5 h-5" />
          {electionTitle}
        </CardTitle>
        <CardDescription>
          Cast your vote for the leadership positions. You can vote once per position.
        </CardDescription>
      </CardHeader>
    </Card>
  );
};
