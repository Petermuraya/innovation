
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, TrendingUp, Users } from 'lucide-react';

const ElectionResults = () => {
  const { data: completedElections, isLoading } = useQuery({
    queryKey: ['completed-elections'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('elections')
        .select('*')
        .eq('status', 'completed')
        .order('voting_end_date', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const { data: electionResults, isLoading: resultsLoading } = useQuery({
    queryKey: ['election-results', completedElections],
    queryFn: async () => {
      if (!completedElections?.length) return {};

      const results: Record<string, any> = {};
      
      for (const election of completedElections) {
        const { data, error } = await supabase.rpc('get_election_results', {
          election_id_param: election.id
        });

        if (error) {
          console.error('Error fetching results for election:', election.id, error);
          continue;
        }

        results[election.id] = data;
      }

      return results;
    },
    enabled: !!completedElections?.length,
  });

  if (isLoading || resultsLoading) {
    return <div className="text-center py-8">Loading election results...</div>;
  }

  if (!completedElections?.length) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Results Available</h3>
          <p className="text-gray-500">No completed elections to show results for.</p>
        </CardContent>
      </Card>
    );
  }

  const groupResultsByPosition = (results: any[]) => {
    return results.reduce((acc: any, result: any) => {
      if (!acc[result.position_type]) {
        acc[result.position_type] = [];
      }
      acc[result.position_type].push(result);
      return acc;
    }, {});
  };

  const getTotalVotes = (positionResults: any[]) => {
    return positionResults.reduce((total, result) => total + parseInt(result.vote_count), 0);
  };

  const getWinner = (positionResults: any[]) => {
    return positionResults.reduce((winner, candidate) => 
      parseInt(candidate.vote_count) > parseInt(winner.vote_count) ? candidate : winner
    );
  };

  return (
    <div className="space-y-8">
      {completedElections.map((election) => {
        const results = electionResults?.[election.id] || [];
        const groupedResults = groupResultsByPosition(results);

        return (
          <Card key={election.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                {election.title} - Results
              </CardTitle>
              <CardDescription>
                Election completed on {new Date(election.voting_end_date).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {Object.keys(groupedResults).length === 0 ? (
                <p className="text-center text-gray-500 py-8">No votes were cast in this election.</p>
              ) : (
                <div className="space-y-6">
                  {Object.entries(groupedResults).map(([positionType, positionResults]: [string, any]) => {
                    const totalVotes = getTotalVotes(positionResults);
                    const winner = getWinner(positionResults);

                    return (
                      <div key={positionType} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold capitalize">
                            {positionType.replace('_', ' ')}
                          </h3>
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {totalVotes} votes
                          </Badge>
                        </div>

                        <div className="space-y-3">
                          {positionResults
                            .sort((a: any, b: any) => parseInt(b.vote_count) - parseInt(a.vote_count))
                            .map((result: any, index: number) => {
                              const percentage = totalVotes > 0 ? (parseInt(result.vote_count) / totalVotes) * 100 : 0;
                              const isWinner = result.candidate_id === winner.candidate_id;

                              return (
                                <div key={result.candidate_id} className="space-y-2">
                                  <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                      {isWinner && (
                                        <Trophy className="w-4 h-4 text-yellow-500" />
                                      )}
                                      <span className={`font-medium ${isWinner ? 'text-yellow-700' : ''}`}>
                                        {result.candidate_name}
                                      </span>
                                      {index === 0 && (
                                        <Badge className="bg-yellow-100 text-yellow-800">
                                          Winner
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm text-gray-600">
                                        {result.vote_count} votes ({percentage.toFixed(1)}%)
                                      </span>
                                    </div>
                                  </div>
                                  <Progress value={percentage} className="h-2" />
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ElectionResults;
