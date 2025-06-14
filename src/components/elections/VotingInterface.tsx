
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Vote, CheckCircle, AlertCircle } from 'lucide-react';

type PositionType = 'chairman' | 'vice_chairman' | 'treasurer' | 'secretary' | 'vice_secretary' | 'organizing_secretary' | 'auditor';

const VotingInterface = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCandidates, setSelectedCandidates] = useState<Record<string, string>>({});

  const { data: activeElection, isLoading: electionLoading } = useQuery({
    queryKey: ['active-election'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('elections')
        .select('*')
        .eq('status', 'voting_open')
        .gte('voting_end_date', new Date().toISOString())
        .lte('voting_start_date', new Date().toISOString())
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
  });

  const { data: candidates, isLoading: candidatesLoading } = useQuery({
    queryKey: ['election-candidates', activeElection?.id],
    queryFn: async () => {
      if (!activeElection?.id) return [];

      const { data, error } = await supabase
        .from('election_candidates')
        .select(`
          *,
          members!inner(name, bio, avatar_url)
        `)
        .eq('election_id', activeElection.id)
        .eq('status', 'approved');

      if (error) throw error;
      return data;
    },
    enabled: !!activeElection?.id,
  });

  const { data: userVotes } = useQuery({
    queryKey: ['user-votes', activeElection?.id],
    queryFn: async () => {
      if (!activeElection?.id || !user?.id) return [];

      const { data, error } = await supabase
        .from('election_votes')
        .select('*')
        .eq('election_id', activeElection.id)
        .eq('voter_id', user.id);

      if (error) throw error;
      return data;
    },
    enabled: !!activeElection?.id && !!user?.id,
  });

  const submitVote = useMutation({
    mutationFn: async ({ candidateId, positionType }: { candidateId: string; positionType: PositionType }) => {
      const { error } = await supabase
        .from('election_votes')
        .insert({
          election_id: activeElection!.id,
          candidate_id: candidateId,
          position_type: positionType,
          voter_id: user!.id,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-votes'] });
      toast({
        title: "Vote Submitted",
        description: "Your vote has been recorded successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit vote. Please try again.",
        variant: "destructive",
      });
      console.error('Vote submission error:', error);
    },
  });

  if (electionLoading || candidatesLoading) {
    return <div className="text-center py-8">Loading voting interface...</div>;
  }

  if (!activeElection) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Vote className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Active Voting</h3>
          <p className="text-gray-500">There are currently no elections open for voting.</p>
        </CardContent>
      </Card>
    );
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Vote className="w-5 h-5" />
            {activeElection.title}
          </CardTitle>
          <CardDescription>
            Cast your vote for the leadership positions. You can vote once per position.
          </CardDescription>
        </CardHeader>
      </Card>

      {Object.entries(candidatesByPosition).map(([positionType, positionCandidates]: [string, any]) => {
        const hasVoted = userVotesByPosition[positionType];
        
        return (
          <Card key={positionType}>
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
                {positionCandidates.map((candidate: any) => {
                  const isVotedFor = userVotesByPosition[positionType] === candidate.id;
                  
                  return (
                    <Card 
                      key={candidate.id} 
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
                                onClick={() => handleVote(positionType as PositionType, candidate.id)}
                                disabled={submitVote.isPending}
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
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default VotingInterface;
