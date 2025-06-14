
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

type PositionType = 'chairman' | 'vice_chairman' | 'treasurer' | 'secretary' | 'vice_secretary' | 'organizing_secretary' | 'auditor';

export const useCandidateApplication = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPosition, setSelectedPosition] = useState<PositionType | ''>('');
  const [manifesto, setManifesto] = useState('');

  const { data: activeElection } = useQuery({
    queryKey: ['nomination-election'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('elections')
        .select(`
          *,
          election_positions(*)
        `)
        .eq('status', 'nomination_open')
        .gte('nomination_end_date', new Date().toISOString())
        .lte('nomination_start_date', new Date().toISOString())
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
  });

  const { data: userApplications } = useQuery({
    queryKey: ['user-applications', activeElection?.id],
    queryFn: async () => {
      if (!activeElection?.id || !user?.id) return [];

      const { data, error } = await supabase
        .from('election_candidates')
        .select('*')
        .eq('election_id', activeElection.id)
        .eq('user_id', user.id);

      if (error) throw error;
      return data;
    },
    enabled: !!activeElection?.id && !!user?.id,
  });

  const applyForPosition = useMutation({
    mutationFn: async ({ positionType, manifesto }: { positionType: PositionType; manifesto: string }) => {
      const { error } = await supabase
        .from('election_candidates')
        .insert({
          election_id: activeElection!.id,
          position_type: positionType,
          user_id: user!.id,
          manifesto,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-applications'] });
      setSelectedPosition('');
      setManifesto('');
      toast({
        title: "Application Submitted",
        description: "Your candidate application has been submitted for review.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
      console.error('Application error:', error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPosition || !manifesto.trim()) {
      toast({
        title: "Incomplete Form",
        description: "Please select a position and provide your manifesto.",
        variant: "destructive",
      });
      return;
    }

    applyForPosition.mutate({ positionType: selectedPosition as PositionType, manifesto });
  };

  const appliedPositions = userApplications?.map(app => app.position_type) || [];
  const availablePositions = activeElection?.election_positions?.filter(
    (pos: any) => !appliedPositions.includes(pos.position_type)
  ) || [];

  return {
    activeElection,
    userApplications,
    selectedPosition,
    setSelectedPosition,
    manifesto,
    setManifesto,
    handleSubmit,
    applyForPosition,
    availablePositions,
    appliedPositions,
  };
};
