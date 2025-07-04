
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface CommunityGroup {
  id: string;
  name: string;
  description: string;
  meeting_schedule: string;
  activities: string[] | null;
  focus_areas: string[] | null;
  meeting_days: string[] | null;
  member_count: number;
  is_member: boolean;
  is_admin: boolean;
}

export const useCommunityData = () => {
  const { member } = useAuth();
  const { toast } = useToast();
  const [communities, setCommunities] = useState<CommunityGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [userMembershipCount, setUserMembershipCount] = useState(0);

  useEffect(() => {
    if (member) {
      fetchCommunities();
      fetchUserMembershipCount();
    }
  }, [member]);

  const fetchUserMembershipCount = async () => {
    if (!member) return;

    try {
      const { count } = await supabase
        .from('community_memberships')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', member.id)
        .eq('status', 'active');

      setUserMembershipCount(count || 0);
    } catch (error) {
      console.error('Error fetching user membership count:', error);
    }
  };

  const fetchCommunities = async () => {
    try {
      const { data: groupsData, error } = await supabase
        .from('community_groups')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // For each group, get member count, check if user is a member, and check if user is admin
      const enrichedGroups = await Promise.all(
        (groupsData || []).map(async (group) => {
          // Get member count
          const { count: memberCount } = await supabase
            .from('community_memberships')
            .select('*', { count: 'exact', head: true })
            .eq('community_id', group.id)
            .eq('status', 'active');

          // Check if current user is a member
          let isMember = false;
          let isAdmin = false;
          if (member) {
            const { data: membership } = await supabase
              .from('community_memberships')
              .select('id')
              .eq('community_id', group.id)
              .eq('user_id', member.id)
              .eq('status', 'active')
              .single();
            isMember = !!membership;

            // Check if user is community admin
            const { data: adminRole } = await supabase
              .from('community_admins')
              .select('id')
              .eq('community_id', group.id)
              .eq('user_id', member.id)
              .eq('is_active', true)
              .single();
            isAdmin = !!adminRole;
          }

          return {
            ...group,
            member_count: memberCount || 0,
            is_member: isMember,
            is_admin: isAdmin,
          };
        })
      );

      setCommunities(enrichedGroups);
    } catch (error) {
      console.error('Error fetching communities:', error);
      toast({
        title: "Error",
        description: "Failed to load communities",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    await fetchCommunities();
    await fetchUserMembershipCount();
  };

  return {
    communities,
    loading,
    userMembershipCount,
    refreshData,
  };
};
