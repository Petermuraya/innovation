
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';

type PositionType = 'chairman' | 'vice_chairman' | 'treasurer' | 'secretary' | 'vice_secretary' | 'organizing_secretary' | 'auditor';

export const CreateElectionForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [newElection, setNewElection] = useState({
    title: '',
    description: '',
    nomination_start_date: '',
    nomination_end_date: '',
    voting_start_date: '',
    voting_end_date: '',
    positions: [] as PositionType[],
  });

  const positions: PositionType[] = [
    'chairman',
    'vice_chairman',
    'treasurer',
    'secretary',
    'vice_secretary',
    'organizing_secretary',
    'auditor'
  ];

  const createElection = useMutation({
    mutationFn: async (electionData: any) => {
      const { data: election, error: electionError } = await supabase
        .from('elections')
        .insert({
          title: electionData.title,
          description: electionData.description,
          nomination_start_date: electionData.nomination_start_date,
          nomination_end_date: electionData.nomination_end_date,
          voting_start_date: electionData.voting_start_date,
          voting_end_date: electionData.voting_end_date,
          created_by: user!.id,
        })
        .select()
        .single();

      if (electionError) throw electionError;

      const positionInserts = electionData.positions.map((position: PositionType) => ({
        election_id: election.id,
        position_type: position,
      }));

      const { error: positionsError } = await supabase
        .from('election_positions')
        .insert(positionInserts);

      if (positionsError) throw positionsError;

      return election;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-elections'] });
      setNewElection({
        title: '',
        description: '',
        nomination_start_date: '',
        nomination_end_date: '',
        voting_start_date: '',
        voting_end_date: '',
        positions: [],
      });
      toast({
        title: "Election Created",
        description: "New election has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create election. Please try again.",
        variant: "destructive",
      });
      console.error('Create election error:', error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newElection.title || !newElection.positions.length) {
      toast({
        title: "Incomplete Form",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    createElection.mutate(newElection);
  };

  const togglePosition = (position: PositionType) => {
    setNewElection(prev => ({
      ...prev,
      positions: prev.positions.includes(position)
        ? prev.positions.filter(p => p !== position)
        : [...prev.positions, position]
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Create New Election
        </CardTitle>
        <CardDescription>
          Set up a new election with nomination and voting periods.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Election Title *</Label>
              <Input
                id="title"
                value={newElection.title}
                onChange={(e) => setNewElection(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Annual Leadership Election 2025"
              />
            </div>
            <div>
              <Label>Available Positions *</Label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {positions.map((position) => (
                  <label key={position} className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={newElection.positions.includes(position)}
                      onChange={() => togglePosition(position)}
                      className="rounded"
                    />
                    <span className="capitalize">{position.replace('_', ' ')}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={newElection.description}
              onChange={(e) => setNewElection(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the election..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nomination_start">Nomination Start Date</Label>
              <Input
                id="nomination_start"
                type="datetime-local"
                value={newElection.nomination_start_date}
                onChange={(e) => setNewElection(prev => ({ ...prev, nomination_start_date: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="nomination_end">Nomination End Date</Label>
              <Input
                id="nomination_end"
                type="datetime-local"
                value={newElection.nomination_end_date}
                onChange={(e) => setNewElection(prev => ({ ...prev, nomination_end_date: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="voting_start">Voting Start Date</Label>
              <Input
                id="voting_start"
                type="datetime-local"
                value={newElection.voting_start_date}
                onChange={(e) => setNewElection(prev => ({ ...prev, voting_start_date: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="voting_end">Voting End Date</Label>
              <Input
                id="voting_end"
                type="datetime-local"
                value={newElection.voting_end_date}
                onChange={(e) => setNewElection(prev => ({ ...prev, voting_end_date: e.target.value }))}
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={createElection.isPending}
            className="w-full"
          >
            {createElection.isPending ? 'Creating...' : 'Create Election'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
