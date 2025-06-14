
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

type PositionType = 'chairman' | 'vice_chairman' | 'treasurer' | 'secretary' | 'vice_secretary' | 'organizing_secretary' | 'auditor';

export const useVotingData = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  return {
    activeElection,
    candidates,
    userVotes,
    isLoading: electionLoading || candidatesLoading,
    submitVote,
  };
};
