
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { EnhancedMemberRank } from '../types/memberRanking';

export const useMemberRankings = (timeFilter: string) => {
  const [rankings, setRankings] = useState<EnhancedMemberRank[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRankings();

    // Set up real-time subscriptions for automatic updates
    const memberPointsChannel = supabase
      .channel('rankings-member-points-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'member_points'
        },
        (payload) => {
          console.log('Member points changed (rankings):', payload);
          fetchRankings();
        }
      )
      .subscribe();

    const membersChannel = supabase
      .channel('rankings-members-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'members'
        },
        (payload) => {
          console.log('Members table changed (rankings):', payload);
          fetchRankings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(memberPointsChannel);
      supabase.removeChannel(membersChannel);
    };
  }, [timeFilter]);

  const fetchRankings = async () => {
    try {
      const { data, error } = await supabase
        .from('enhanced_member_leaderboard')
        .select('*')
        .order('rank')
        .limit(50);

      if (error) throw error;
      setRankings(data || []);
    } catch (error) {
      console.error('Error fetching enhanced rankings:', error);
    } finally {
      setLoading(false);
    }
  };

  return { rankings, loading };
};
