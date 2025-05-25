
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface MemberStatus {
  loading: boolean;
  isApproved: boolean;
  memberData: any;
}

export const useMemberStatus = () => {
  const { user } = useAuth();
  const [status, setStatus] = useState<MemberStatus>({
    loading: true,
    isApproved: false,
    memberData: null
  });

  useEffect(() => {
    const checkMemberStatus = async () => {
      if (!user) {
        setStatus({ loading: false, isApproved: false, memberData: null });
        return;
      }

      try {
        const { data: memberData, error } = await supabase
          .from('members')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error checking member status:', error);
          setStatus({ loading: false, isApproved: false, memberData: null });
          return;
        }

        const isApproved = memberData?.registration_status === 'approved';
        setStatus({ 
          loading: false, 
          isApproved, 
          memberData 
        });
      } catch (error) {
        console.error('Error checking member status:', error);
        setStatus({ loading: false, isApproved: false, memberData: null });
      }
    };

    checkMemberStatus();
  }, [user]);

  return status;
};
