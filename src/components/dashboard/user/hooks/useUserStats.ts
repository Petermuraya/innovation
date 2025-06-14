
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

  const fetchUserStats = async () => {
    if (!user) return;

    try {
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
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserStats();
    }
  }, [user]);

  return { stats, refetchUserStats: fetchUserStats };
};
