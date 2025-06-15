
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { UserStats } from '../types';

export const useUserStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats>({
    totalProjects: 0,
    eventsAttended: 0,
    certificatesEarned: 0,
    totalPoints: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserStats = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      // Fetch project count
      const { count: projectCount } = await supabase
        .from('project_submissions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Fetch events attended
      const { count: eventsCount } = await supabase
        .from('event_attendance')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Fetch certificates
      const { count: certificatesCount } = await supabase
        .from('certificates')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Fetch total points
      const { data: pointsData } = await supabase
        .from('member_points')
        .select('points')
        .eq('user_id', user.id);

      const totalPoints = pointsData?.reduce((sum, point) => sum + (point.points || 0), 0) || 0;

      setStats({
        totalProjects: projectCount || 0,
        eventsAttended: eventsCount || 0,
        certificatesEarned: certificatesCount || 0,
        totalPoints,
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserStats();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  return { stats, isLoading, refetchUserStats: fetchUserStats };
};
