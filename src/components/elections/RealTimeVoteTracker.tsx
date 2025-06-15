
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Vote } from 'lucide-react';

interface VoteCount {
  position_type: string;
  candidate_id: string;
  candidate_name: string;
  vote_count: number;
  total_position_votes: number;
}

interface VoteTracking {
  election_id: string;
  position_type: string;
  total_votes: number;
  last_updated: string;
}

interface RealTimeVoteTrackerProps {
  electionId?: string;
  showTitle?: boolean;
  compact?: boolean;
}

const RealTimeVoteTracker = ({ electionId, showTitle = true, compact = false }: RealTimeVoteTrackerProps) => {
  const [voteCounts, setVoteCounts] = useState<VoteCount[]>([]);
  const [voteTracking, setVoteTracking] = useState<VoteTracking[]>([]);
  const [activeElection, setActiveElection] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchActiveElection = async () => {
    if (electionId) {
      const { data } = await supabase
        .from('elections')
        .select('*')
        .eq('id', electionId)
        .single();
      setActiveElection(data);
      return data;
    } else {
      const { data } = await supabase
        .from('elections')
        .select('*')
        .eq('status', 'voting_open')
        .single();
      setActiveElection(data);
      return data;
    }
  };

  const fetchVoteCounts = async (election: any) => {
    if (!election) return;

    try {
      const { data, error } = await supabase.rpc('get_election_vote_counts', {
        election_id_param: election.id
      });

      if (error) throw error;
      setVoteCounts(data || []);
    } catch (error) {
      console.error('Error fetching vote counts:', error);
    }
  };

  const fetchVoteTracking = async (election: any) => {
    if (!election) return;

    try {
      const { data, error } = await supabase
        .from('election_vote_tracking')
        .select('*')
        .eq('election_id', election.id);

      if (error) throw error;
      setVoteTracking(data || []);
    } catch (error) {
      console.error('Error fetching vote tracking:', error);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      const election = await fetchActiveElection();
      if (election) {
        await Promise.all([
          fetchVoteCounts(election),
          fetchVoteTracking(election)
        ]);
      }
      setLoading(false);
    };

    initializeData();
  }, [electionId]);

  useEffect(() => {
    if (!activeElection) return;

    // Set up real-time subscription for vote tracking
    const channel = supabase
      .channel('vote-tracking-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'election_vote_tracking',
          filter: `election_id=eq.${activeElection.id}`
        },
        (payload) => {
          console.log('Vote tracking update:', payload);
          fetchVoteTracking(activeElection);
          fetchVoteCounts(activeElection);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeElection]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Live Vote Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i}>
                <div className="h-4 bg-gray-200 rounded mb-2" />
                <div className="h-2 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!activeElection || voteCounts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Vote className="w-5 h-5" />
            Live Vote Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-4">No active election or votes yet</p>
        </CardContent>
      </Card>
    );
  }

  const groupedVotes = voteCounts.reduce((acc, vote) => {
    if (!acc[vote.position_type]) {
      acc[vote.position_type] = [];
    }
    acc[vote.position_type].push(vote);
    return acc;
  }, {} as Record<string, VoteCount[]>);

  const totalVotes = voteTracking.reduce((sum, track) => sum + track.total_votes, 0);

  if (compact) {
    return (
      <Card className="border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-green-700">Live Votes</h4>
            <Badge variant="outline" className="bg-green-50">
              {totalVotes} votes
            </Badge>
          </div>
          <div className="space-y-2">
            {Object.entries(groupedVotes).slice(0, 2).map(([position, candidates]) => {
              const leadingCandidate = candidates[0];
              const totalForPosition = candidates[0]?.total_position_votes || 0;
              
              return (
                <div key={position} className="text-sm">
                  <div className="flex justify-between items-center">
                    <span className="font-medium capitalize">
                      {position.replace('_', ' ')}
                    </span>
                    <span className="text-gray-500">{totalForPosition} votes</span>
                  </div>
                  {leadingCandidate && (
                    <div className="text-xs text-green-600">
                      Leading: {leadingCandidate.candidate_name} ({leadingCandidate.vote_count})
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-600" />
          {showTitle && "Live Vote Tracker"}
          <Badge variant="outline" className="ml-auto">
            <Users className="w-3 h-3 mr-1" />
            {totalVotes} total votes
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(groupedVotes).map(([position, candidates]) => {
          const totalForPosition = candidates[0]?.total_position_votes || 0;
          
          return (
            <div key={position}>
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold capitalize text-gray-800">
                  {position.replace('_', ' ')}
                </h4>
                <Badge variant="secondary">
                  {totalForPosition} votes
                </Badge>
              </div>
              
              <div className="space-y-3">
                {candidates.map((candidate, index) => {
                  const percentage = totalForPosition > 0 
                    ? (candidate.vote_count / totalForPosition) * 100 
                    : 0;
                  
                  return (
                    <div key={candidate.candidate_id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{candidate.candidate_name}</span>
                          {index === 0 && totalForPosition > 0 && (
                            <Badge variant="default" className="bg-green-500">Leading</Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          {candidate.vote_count} votes ({percentage.toFixed(1)}%)
                        </div>
                      </div>
                      <Progress 
                        value={percentage} 
                        className="h-2"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        
        <div className="text-xs text-gray-400 border-t pt-2">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimeVoteTracker;
