
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { EnhancedMemberRank } from '../types/memberRanking';

export const useMemberRankings = (timeFilter: string) => {
  const [rankings, setRankings] = useState<EnhancedMemberRank[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRankings();
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
