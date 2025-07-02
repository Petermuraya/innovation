
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
      console.log('Fetching member rankings...');
      const { data, error } = await supabase
        .from('enhanced_member_leaderboard')
        .select('*')
        .order('rank')
        .limit(50);

      if (error) {
        console.error('Error fetching enhanced rankings:', error);
        throw error;
      }
      
      console.log('Fetched rankings data:', data);
      setRankings(data || []);
    } catch (error) {
      console.error('Error fetching enhanced rankings:', error);
      // Try fallback query to members table directly
      try {
        console.log('Trying fallback query to members table...');
        const { data: membersData, error: membersError } = await supabase
          .from('members')
          .select(`
            user_id,
            name,
            email,
            avatar_url,
            registration_status
          `)
          .eq('registration_status', 'approved')
          .order('created_at', { ascending: false })
          .limit(50);

        if (membersError) throw membersError;
        
        // Transform to expected format
        const transformedData = (membersData || []).map((member, index) => ({
          user_id: member.user_id,
          name: member.name,
          email: member.email,
          avatar_url: member.avatar_url,
          total_points: 0,
          event_points: 0,
          project_points: 0,
          blog_points: 0,
          visit_points: 0,
          subscription_points: 0,
          events_attended: 0,
          projects_created: 0,
          blogs_written: 0,
          visit_days: 0,
          subscriptions_made: 0,
          rank: index + 1
        }));
        
        console.log('Fallback data:', transformedData);
        setRankings(transformedData);
      } catch (fallbackError) {
        console.error('Fallback query also failed:', fallbackError);
        setRankings([]);
      }
    } finally {
      setLoading(false);
    }
  };

  return { rankings, loading };
};
