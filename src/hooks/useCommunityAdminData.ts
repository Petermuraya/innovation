
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Community {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  meeting_schedule?: string;
  meeting_time?: string;
  meeting_location?: string;
}

interface CommunityStats {
  total_members: number;
  total_events: number;
  total_projects: number;
  attended_last_meeting: number;
}

// Add explicit type for count queries
interface CountResult {
  count: number | null;
  data: any[] | null;
  error: any;
}

export const useCommunityAdminData = () => {
  const { user } = useAuth();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [stats, setStats] = useState<CommunityStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommunityAdminData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Check if user has general admin role or community admin role
        const { data: userRoles, error: rolesError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);

        if (rolesError) throw rolesError;

        // Check if user is a general admin (can manage all communities)
        const isGeneralAdmin = userRoles?.some(r => 
          r.role === 'general_admin' || r.role === 'super_admin'
        );

        if (isGeneralAdmin) {
          // Fetch all communities for general admins
          const { data: allCommunities, error: communitiesError } = await supabase
            .from('community_groups')
            .select('id, name, description, is_active, meeting_schedule, meeting_time, meeting_location')
            .eq('is_active', true)
            .order('name');

          if (communitiesError) throw communitiesError;
          setCommunities(allCommunities || []);
          
          // Set first community as selected by default
          if (allCommunities && allCommunities.length > 0) {
            setSelectedCommunity(allCommunities[0]);
          }
        } else {
          // Fetch only communities where user is admin
          const { data: adminCommunities, error: adminError } = await supabase
            .from('community_admin_roles')
            .select(`
              community_id,
              community_groups!inner(id, name, description, is_active, meeting_schedule, meeting_time, meeting_location)
            `)
            .eq('user_id', user.id)
            .eq('is_active', true);

          if (adminError) throw adminError;

          const formattedCommunities = adminCommunities?.map(ac => ({
            id: ac.community_groups.id,
            name: ac.community_groups.name,
            description: ac.community_groups.description,
            is_active: ac.community_groups.is_active,
            meeting_schedule: ac.community_groups.meeting_schedule,
            meeting_time: ac.community_groups.meeting_time,
            meeting_location: ac.community_groups.meeting_location
          })) || [];

          setCommunities(formattedCommunities);
          
          // Set first community as selected by default
          if (formattedCommunities.length > 0) {
            setSelectedCommunity(formattedCommunities[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching community admin data:', error);
        setCommunities([]);
        setSelectedCommunity(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunityAdminData();
  }, [user]);

  // Fetch stats when a community is selected
  useEffect(() => {
    const fetchCommunityStats = async () => {
      if (!selectedCommunity || !user) {
        setStats(null);
        return;
      }

      try {
        // Fetch community stats with explicit typing to avoid deep type instantiation
        const membersQuery = supabase
          .from('community_memberships')
          .select('id', { count: 'exact' })
          .eq('community_id', selectedCommunity.id)
          .eq('is_active', true);
        
        const eventsQuery = supabase
          .from('events')
          .select('id', { count: 'exact' })
          .eq('community_id', selectedCommunity.id);
        
        const projectsQuery = supabase
          .from('projects')
          .select('id', { count: 'exact' })
          .eq('community_id', selectedCommunity.id);

        // Execute queries with explicit typing
        const [membersResult, eventsResult, projectsResult] = await Promise.all([
          membersQuery as Promise<CountResult>,
          eventsQuery as Promise<CountResult>,
          projectsQuery as Promise<CountResult>
        ]);

        setStats({
          total_members: membersResult.count || 0,
          total_events: eventsResult.count || 0,
          total_projects: projectsResult.count || 0,
          attended_last_meeting: 0 // This would need a more complex query based on your attendance tracking
        });
      } catch (error) {
        console.error('Error fetching community stats:', error);
        setStats({
          total_members: 0,
          total_events: 0,
          total_projects: 0,
          attended_last_meeting: 0
        });
      }
    };

    fetchCommunityStats();
  }, [selectedCommunity, user]);

  const selectCommunity = (community: Community) => {
    setSelectedCommunity(community);
  };

  return {
    communities,
    selectedCommunity,
    stats,
    loading,
    selectCommunity
  };
};
