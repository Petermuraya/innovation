
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Community {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
}

export const useCommunityAdminData = () => {
  const { user } = useAuth();
  const [communities, setCommunities] = useState<Community[]>([]);
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
            .select('id, name, description, is_active')
            .eq('is_active', true)
            .order('name');

          if (communitiesError) throw communitiesError;
          setCommunities(allCommunities || []);
        } else {
          // Fetch only communities where user is admin
          const { data: adminCommunities, error: adminError } = await supabase
            .from('community_admin_roles')
            .select(`
              community_id,
              community_groups!inner(id, name, description, is_active)
            `)
            .eq('user_id', user.id)
            .eq('is_active', true);

          if (adminError) throw adminError;

          const formattedCommunities = adminCommunities?.map(ac => ({
            id: ac.community_groups.id,
            name: ac.community_groups.name,
            description: ac.community_groups.description,
            is_active: ac.community_groups.is_active
          })) || [];

          setCommunities(formattedCommunities);
        }
      } catch (error) {
        console.error('Error fetching community admin data:', error);
        setCommunities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunityAdminData();
  }, [user]);

  return {
    communities,
    loading
  };
};
