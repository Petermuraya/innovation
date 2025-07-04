
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useMemberStatus = () => {
  const { member } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isApproved, setIsApproved] = useState(false);

  useEffect(() => {
    const checkMemberStatus = async () => {
      if (!member) {
        setIsApproved(false);
        setLoading(false);
        return;
      }

      try {
        // Check if members table exists and get member status
        const { data, error } = await supabase
          .from('members')
          .select('registration_status')
          .eq('user_id', member.id)
          .single();

        if (error) {
          console.log('Member not found in members table, defaulting to approved');
          setIsApproved(true);
        } else {
          setIsApproved(data?.registration_status === 'approved');
        }
      } catch (error) {
        console.error('Error checking member status:', error);
        setIsApproved(true); // Default to approved if there's an error
      } finally {
        setLoading(false);
      }
    };

    checkMemberStatus();
  }, [member]);

  return { loading, isApproved };
};
