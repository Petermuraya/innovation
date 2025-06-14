
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

type ElectionStatus = 'draft' | 'nomination_open' | 'voting_open' | 'completed' | 'cancelled';

export const ElectionManagementList = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: elections } = useQuery({
    queryKey: ['all-elections'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('elections')
        .select(`
          *,
          election_positions(*),
          election_candidates(*, members!inner(name))
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const updateElectionStatus = useMutation({
    mutationFn: async ({ electionId, status }: { electionId: string; status: ElectionStatus }) => {
      const { error } = await supabase
        .from('elections')
        .update({ status })
        .eq('id', electionId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-elections'] });
      toast({
        title: "Status Updated",
        description: "Election status has been updated.",
      });
    },
  });

  return (
    <div className="space-y-4">
      {elections?.map((election) => (
        <Card key={election.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{election.title}</CardTitle>
                <CardDescription>{election.description}</CardDescription>
              </div>
              <Badge>{election.status}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateElectionStatus.mutate({ electionId: election.id, status: 'nomination_open' })}
                disabled={election.status === 'nomination_open'}
              >
                Open Nominations
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateElectionStatus.mutate({ electionId: election.id, status: 'voting_open' })}
                disabled={election.status === 'voting_open'}
              >
                Open Voting
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateElectionStatus.mutate({ electionId: election.id, status: 'completed' })}
                disabled={election.status === 'completed'}
              >
                Complete
              </Button>
            </div>
            
            <div className="text-sm text-gray-600">
              <p>Positions: {election.election_positions?.length || 0}</p>
              <p>Candidates: {election.election_candidates?.length || 0}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
