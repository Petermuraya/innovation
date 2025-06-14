
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, Vote } from 'lucide-react';
import { format } from 'date-fns';

const ElectionsList = () => {
  const { data: elections, isLoading } = useQuery({
    queryKey: ['elections'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('elections')
        .select(`
          *,
          election_positions(*)
        `)
        .in('status', ['nomination_open', 'voting_open', 'completed'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!elections?.length) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Vote className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Active Elections</h3>
          <p className="text-gray-500">There are currently no elections available.</p>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'nomination_open':
        return 'bg-blue-100 text-blue-800';
      case 'voting_open':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'nomination_open':
        return 'Nominations Open';
      case 'voting_open':
        return 'Voting Open';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {elections.map((election) => (
          <Card key={election.id} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{election.title}</CardTitle>
                <Badge className={getStatusColor(election.status)}>
                  {getStatusText(election.status)}
                </Badge>
              </div>
              {election.description && (
                <CardDescription>{election.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>
                  Nominations: {format(new Date(election.nomination_start_date), 'MMM d')} - {format(new Date(election.nomination_end_date), 'MMM d')}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Vote className="w-4 h-4" />
                <span>
                  Voting: {format(new Date(election.voting_start_date), 'MMM d')} - {format(new Date(election.voting_end_date), 'MMM d')}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>{election.election_positions?.length || 0} positions available</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {election.election_positions?.map((position: any) => (
                  <Badge key={position.id} variant="outline" className="text-xs">
                    {position.position_type.replace('_', ' ')}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ElectionsList;
