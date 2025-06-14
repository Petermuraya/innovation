
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Users, CheckCircle, XCircle } from 'lucide-react';

export const CandidateReviewList = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: pendingCandidates } = useQuery({
    queryKey: ['pending-candidates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('election_candidates')
        .select(`
          *,
          elections(title)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get member details separately to avoid foreign key issues
      const candidatesWithMembers = await Promise.all(
        data.map(async (candidate) => {
          const { data: memberData } = await supabase
            .from('members')
            .select('name, email')
            .eq('user_id', candidate.user_id)
            .single();

          return {
            ...candidate,
            member: memberData
          };
        })
      );

      return candidatesWithMembers;
    },
  });

  const updateCandidateStatus = useMutation({
    mutationFn: async ({ candidateId, status }: { candidateId: string; status: 'approved' | 'rejected' }) => {
      const { error } = await supabase
        .from('election_candidates')
        .update({ 
          status,
          approved_by: user!.id,
          approved_at: new Date().toISOString(),
        })
        .eq('id', candidateId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-candidates'] });
      toast({
        title: "Candidate Status Updated",
        description: "Candidate application has been reviewed.",
      });
    },
  });

  return (
    <div className="space-y-4">
      {pendingCandidates?.map((candidate) => (
        <Card key={candidate.id}>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold">{candidate.member?.name || 'Unknown'}</h3>
                <p className="text-sm text-gray-600">{candidate.member?.email || 'No email'}</p>
                <p className="text-sm font-medium mt-1 capitalize">
                  Position: {candidate.position_type.replace('_', ' ')}
                </p>
                <p className="text-sm text-gray-600">
                  Election: {candidate.elections?.title}
                </p>
                {candidate.manifesto && (
                  <div className="mt-3">
                    <p className="text-sm font-medium mb-1">Manifesto:</p>
                    <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                      {candidate.manifesto}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex gap-2 ml-4">
                <Button
                  size="sm"
                  onClick={() => updateCandidateStatus.mutate({ candidateId: candidate.id, status: 'approved' })}
                  disabled={updateCandidateStatus.isPending}
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => updateCandidateStatus.mutate({ candidateId: candidate.id, status: 'rejected' })}
                  disabled={updateCandidateStatus.isPending}
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  Reject
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {!pendingCandidates?.length && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Pending Applications</h3>
            <p className="text-gray-500">All candidate applications have been reviewed.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
