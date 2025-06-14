
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus } from 'lucide-react';

interface CandidateApplicationHeaderProps {
  electionTitle: string;
}

export const CandidateApplicationHeader = ({ electionTitle }: CandidateApplicationHeaderProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="w-5 h-5" />
          Apply for Candidacy
        </CardTitle>
        <CardDescription>
          Submit your application to run for a leadership position in {electionTitle}.
        </CardDescription>
      </CardHeader>
    </Card>
  );
};
