
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface MemberData {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  course?: string;
  registration_status: string;
  avatar_url?: string;
  bio?: string;
  year_of_study?: string;
  skills?: string[];
  github_username?: string;
  linkedin_url?: string;
  created_at: string;
  updated_at: string;
}

export const useMemberStatus = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isApproved, setIsApproved] = useState(false);
  const [memberData, setMemberData] = useState<MemberData | null>(null);

  useEffect(() => {
    const checkMemberStatus = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Check if user has any admin role
        const { data: roles, error: rolesError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);

        if (rolesError) throw rolesError;

        const hasAdminRole = roles?.some(r => 
          r.role === 'super_admin' || 
          r.role === 'general_admin' ||
          r.role === 'community_admin' ||
          r.role === 'events_admin' ||
          r.role === 'projects_admin' ||
          r.role === 'finance_admin' ||
          r.role === 'content_admin' ||
          r.role === 'technical_admin' ||
          r.role === 'marketing_admin'
        );

        // Fetch member data
        const { data: member, error: memberError } = await supabase
          .from('members')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (memberError && memberError.code !== 'PGRST116') {
          throw memberError;
        }

        setMemberData(member);

        // Admins are always approved, or check member registration status
        if (hasAdminRole) {
          setIsApproved(true);
        } else if (member) {
          setIsApproved(member.registration_status === 'approved');
        } else {
          setIsApproved(false);
        }
      } catch (error) {
        console.error('Error checking member status:', error);
        setIsApproved(false);
        setMemberData(null);
      } finally {
        setLoading(false);
      }
    };

    checkMemberStatus();
  }, [user]);

  return {
    loading,
    isApproved,
    memberData
  };
};
