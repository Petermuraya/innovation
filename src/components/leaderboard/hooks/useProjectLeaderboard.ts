
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ProjectRank, SortBy } from '../types/projectLeaderboard';

export const useProjectLeaderboard = (sortBy: SortBy = 'engagement') => {
  const [projects, setProjects] = useState<ProjectRank[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, [sortBy]);

  const fetchProjects = async () => {
    try {
      let orderBy = 'engagement_score';
      if (sortBy === 'likes') orderBy = 'likes_count';
      if (sortBy === 'recent') orderBy = 'created_at';

      const { data, error } = await supabase
        .from('project_leaderboard')
        .select('*')
        .eq('status', 'approved')
        .order(orderBy, { ascending: false })
        .limit(50);

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching project leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  return { projects, loading };
};
