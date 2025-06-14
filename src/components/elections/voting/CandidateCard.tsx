
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';

interface CandidateCardProps {
  candidate: {
    id: string;
    manifesto?: string;
    members: {
      name: string;
      bio?: string;
      avatar_url?: string;
    };
  };
  isVotedFor: boolean;
  hasVoted: boolean;
  onVote: () => void;
  isLoading: boolean;
}

export const CandidateCard = ({ 
  candidate, 
  isVotedFor, 
  hasVoted, 
  onVote, 
  isLoading 
}: CandidateCardProps) => {
  return (
    <Card 
      className={`transition-all duration-200 ${
        isVotedFor ? 'ring-2 ring-green-500 bg-green-50' : 'hover:shadow-md'
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <img
            src={candidate.members.avatar_url || '/placeholder.svg'}
            alt={candidate.members.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex-1">
            <h4 className="font-semibold">{candidate.members.name}</h4>
            {candidate.members.bio && (
              <p className="text-sm text-gray-600 mb-2">{candidate.members.bio}</p>
            )}
            {candidate.manifesto && (
              <p className="text-sm text-gray-700 mb-3">{candidate.manifesto}</p>
            )}
            {!hasVoted ? (
              <Button
                size="sm"
                onClick={onVote}
                disabled={isLoading}
              >
                Vote
              </Button>
            ) : isVotedFor ? (
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                Your Vote
              </Badge>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
