
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, CheckCircle, Clock, XCircle } from 'lucide-react';

type PositionType = 'chairman' | 'vice_chairman' | 'treasurer' | 'secretary' | 'vice_secretary' | 'organizing_secretary' | 'auditor';

const CandidateApplication = () => {
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

  if (!activeElection) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <UserPlus className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Open Nominations</h3>
          <p className="text-gray-500">There are currently no elections accepting candidate applications.</p>
        </CardContent>
      </Card>
    );
  }

  const appliedPositions = userApplications?.map(app => app.position_type) || [];
  const availablePositions = activeElection.election_positions?.filter(
    (pos: any) => !appliedPositions.includes(pos.position_type)
  ) || [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Apply for Candidacy
          </CardTitle>
          <CardDescription>
            Submit your application to run for a leadership position in {activeElection.title}.
          </CardDescription>
        </CardHeader>
      </Card>

      {userApplications && userApplications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {userApplications.map((application) => (
                <div
                  key={application.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(application.status)}
                    <span className="font-medium capitalize">
                      {application.position_type.replace('_', ' ')}
                    </span>
                  </div>
                  <Badge className={getStatusColor(application.status)}>
                    {application.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {availablePositions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Apply for New Position</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Select value={selectedPosition} onValueChange={(value: PositionType) => setSelectedPosition(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a position to apply for" />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePositions.map((position: any) => (
                      <SelectItem key={position.id} value={position.position_type}>
                        {position.position_type.replace('_', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Textarea
                  placeholder="Write your manifesto and explain why you're the best candidate for this position..."
                  value={manifesto}
                  onChange={(e) => setManifesto(e.target.value)}
                  rows={6}
                  className="resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={applyForPosition.isPending || !selectedPosition || !manifesto.trim()}
                className="w-full"
              >
                {applyForPosition.isPending ? 'Submitting...' : 'Submit Application'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {availablePositions.length === 0 && userApplications && userApplications.length > 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">All Positions Applied</h3>
            <p className="text-gray-500">
              You have applied for all available positions in this election.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CandidateApplication;
