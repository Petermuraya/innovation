
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Plus, Settings, Users, CheckCircle, XCircle } from 'lucide-react';

const AdminElectionManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // State for creating new election
  const [newElection, setNewElection] = useState({
    title: '',
    description: '',
    nomination_start_date: '',
    nomination_end_date: '',
    voting_start_date: '',
    voting_end_date: '',
    positions: [] as string[],
  });

  const positions = [
    'chairman',
    'vice_chairman',
    'treasurer',
    'secretary',
    'vice_secretary',
    'organizing_secretary',
    'auditor'
  ];

  const { data: elections } = useQuery({
    queryKey: ['all-elections'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('elections')
        .select(`
          *,
          election_positions(*),
          election_candidates(*, members(name))
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const { data: pendingCandidates } = useQuery({
    queryKey: ['pending-candidates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('election_candidates')
        .select(`
          *,
          members(name, email),
          elections(title)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

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

      // Create election positions
      const positionInserts = electionData.positions.map((position: string) => ({
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

  const updateElectionStatus = useMutation({
    mutationFn: async ({ electionId, status }: { electionId: string; status: string }) => {
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

  const handleCreateElection = (e: React.FormEvent) => {
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

  const togglePosition = (position: string) => {
    setNewElection(prev => ({
      ...prev,
      positions: prev.positions.includes(position)
        ? prev.positions.filter(p => p !== position)
        : [...prev.positions, position]
    }));
  };

  return (
    <Tabs defaultValue="create" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="create">Create Election</TabsTrigger>
        <TabsTrigger value="manage">Manage Elections</TabsTrigger>
        <TabsTrigger value="candidates">Review Candidates</TabsTrigger>
      </TabsList>

      <TabsContent value="create">
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
            <form onSubmit={handleCreateElection} className="space-y-4">
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
      </TabsContent>

      <TabsContent value="manage">
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
      </TabsContent>

      <TabsContent value="candidates">
        <div className="space-y-4">
          {pendingCandidates?.map((candidate) => (
            <Card key={candidate.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold">{candidate.members.name}</h3>
                    <p className="text-sm text-gray-600">{candidate.members.email}</p>
                    <p className="text-sm font-medium mt-1 capitalize">
                      Position: {candidate.position_type.replace('_', ' ')}
                    </p>
                    <p className="text-sm text-gray-600">
                      Election: {candidate.elections.title}
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
      </TabsContent>
    </Tabs>
  );
};

export default AdminElectionManagement;
