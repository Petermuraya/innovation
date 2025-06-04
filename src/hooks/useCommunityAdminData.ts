
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface CommunityAdminData {
  communities: any[];
  selectedCommunity: any;
  loading: boolean;
  stats: any;
}

export const useCommunityAdminData = () => {
  const { user } = useAuth();
  const [data, setData] = useState<CommunityAdminData>({
    communities: [],
    selectedCommunity: null,
    loading: true,
    stats: null,
  });

  const fetchCommunityAdminData = async () => {
    if (!user) return;

    try {
      // Fetch communities where user is admin
      const { data: adminCommunities, error: communitiesError } = await supabase
        .from('community_admins')
        .select(`
          community_id,
          community_groups (
            id,
            name,
            description,
            meeting_schedule,
            meeting_time,
            meeting_location,
            next_meeting_date,
            focus_areas,
            activities
          )
        `)
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (communitiesError) throw communitiesError;

      const communities = adminCommunities?.map(ac => ac.community_groups) || [];
      
      // Set the first community as selected by default
      const selectedCommunity = communities[0] || null;

      // Fetch stats for selected community
      let stats = null;
      if (selectedCommunity) {
        const { data: statsData } = await supabase
          .from('community_dashboard_stats')
          .select('*')
          .eq('community_id', selectedCommunity.id)
          .single();
        
        stats = statsData;
      }

      setData({
        communities,
        selectedCommunity,
        loading: false,
        stats,
      });
    } catch (error) {
      console.error('Error fetching community admin data:', error);
      setData(prev => ({ ...prev, loading: false }));
    }
  };

  const selectCommunity = async (community: any) => {
    setData(prev => ({ ...prev, selectedCommunity: community }));
    
    // Fetch stats for the selected community
    try {
      const { data: statsData } = await supabase
        .from('community_dashboard_stats')
        .select('*')
        .eq('community_id', community.id)
        .single();
      
      setData(prev => ({ ...prev, stats: statsData }));
    } catch (error) {
      console.error('Error fetching community stats:', error);
    }
  };

  useEffect(() => {
    fetchCommunityAdminData();
  }, [user]);

  return {
    ...data,
    selectCommunity,
    refreshData: fetchCommunityAdminData,
  };
};
