
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useMemberData = () => {
  const { member } = useAuth();
  const [memberProfile, setMemberProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemberData = async () => {
      if (!member) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('members')
          .select('*')
          .eq('user_id', member.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching member data:', error);
        } else {
          setMemberProfile(data);
        }
      } catch (error) {
        console.error('Error fetching member data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMemberData();
  }, [member]);

  return { memberProfile, loading };
};
