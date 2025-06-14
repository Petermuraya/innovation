
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { MemberData } from '../types';

export const useMemberData = () => {
  const { user } = useAuth();
  const [memberData, setMemberData] = useState<MemberData | null>(null);

  const fetchMemberData = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching member data:', error);
        return;
      }

      setMemberData(data);
    } catch (error) {
      console.error('Error fetching member data:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMemberData();
    }
  }, [user]);

  return { memberData, refetchMemberData: fetchMemberData };
};
