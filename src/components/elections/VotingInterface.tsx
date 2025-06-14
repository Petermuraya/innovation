
import React from 'react';
import { useVotingData } from './voting/useVotingData';
import { VotingHeader } from './voting/VotingHeader';
import { EmptyVotingState } from './voting/EmptyVotingState';
import { PositionVotingSection } from './voting/PositionVotingSection';
import { useToast } from '@/hooks/use-toast';

type PositionType = 'chairman' | 'vice_chairman' | 'treasurer' | 'secretary' | 'vice_secretary' | 'organizing_secretary' | 'auditor';

const VotingInterface = () => {
  const { toast } = useToast();
  const { activeElection, candidates, userVotes, isLoading, submitVote } = useVotingData();

  if (isLoading) {
    return <div className="text-center py-8">Loading voting interface...</div>;
  }

  if (!activeElection) {
    return <EmptyVotingState />;
  }

  const candidatesByPosition = candidates?.reduce((acc: any, candidate: any) => {
    if (!acc[candidate.position_type]) {
      acc[candidate.position_type] = [];
    }
    acc[candidate.position_type].push(candidate);
    return acc;
  }, {}) || {};

  const userVotesByPosition = userVotes?.reduce((acc: any, vote: any) => {
    acc[vote.position_type] = vote.candidate_id;
    return acc;
  }, {}) || {};

  const handleVote = (positionType: PositionType, candidateId: string) => {
    if (userVotesByPosition[positionType]) {
      toast({
        title: "Already Voted",
        description: `You have already voted for ${positionType.replace('_', ' ')}.`,
        variant: "destructive",
      });
      return;
    }

    submitVote.mutate({ candidateId, positionType });
  };

  return (
    <div className="space-y-6">
      <VotingHeader electionTitle={activeElection.title} />

      {Object.entries(candidatesByPosition).map(([positionType, positionCandidates]: [string, any]) => {
        const hasVoted = userVotesByPosition[positionType];
        
        return (
          <PositionVotingSection
            key={positionType}
            positionType={positionType}
            candidates={positionCandidates}
            hasVoted={hasVoted}
            userVotesByPosition={userVotesByPosition}
            onVote={handleVote}
            isLoading={submitVote.isPending}
          />
        );
      })}
    </div>
  );
};

export default VotingInterface;
