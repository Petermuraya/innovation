
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';
import { CandidateCard } from './CandidateCard';

type PositionType = 'chairman' | 'vice_chairman' | 'treasurer' | 'secretary' | 'vice_secretary' | 'organizing_secretary' | 'auditor';

interface PositionVotingSectionProps {
  positionType: string;
  candidates: any[];
  hasVoted: boolean;
  userVotesByPosition: Record<string, string>;
  onVote: (positionType: PositionType, candidateId: string) => void;
  isLoading: boolean;
}

export const PositionVotingSection = ({
  positionType,
  candidates,
  hasVoted,
  userVotesByPosition,
  onVote,
  isLoading
}: PositionVotingSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="capitalize text-lg">
            {positionType.replace('_', ' ')}
          </CardTitle>
          {hasVoted && (
            <Badge className="bg-green-100 text-green-800">
              <CheckCircle className="w-3 h-3 mr-1" />
              Voted
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {candidates.map((candidate: any) => {
            const isVotedFor = userVotesByPosition[positionType] === candidate.id;
            
            return (
              <CandidateCard
                key={candidate.id}
                candidate={candidate}
                isVotedFor={isVotedFor}
                hasVoted={hasVoted}
                onVote={() => onVote(positionType as PositionType, candidate.id)}
                isLoading={isLoading}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
