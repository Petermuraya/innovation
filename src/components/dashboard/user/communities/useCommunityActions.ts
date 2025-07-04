
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useCommunityActions = (
  userMembershipCount: number, 
  refreshData: () => Promise<void>
) => {
  const { member } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [visitingCommunity, setVisitingCommunity] = useState<string | null>(null);

  const visitCommunity = async (communityId: string) => {
    setVisitingCommunity(communityId);
    
    // Small delay for UX
    setTimeout(() => {
      navigate(`/community/${communityId}`);
      setVisitingCommunity(null);
    }, 500);
  };

  const toggleMembership = async (communityId: string, isJoining: boolean) => {
    if (!member) {
      toast({
        title: "Authentication required",
        description: "Please log in to join communities",
        variant: "destructive",
      });
      return;
    }

    if (isJoining && userMembershipCount >= 3) {
      toast({
        title: "Membership limit reached",
        description: "You can only be a member of up to 3 communities",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isJoining) {
        const { error } = await supabase
          .from('community_memberships')
          .insert({
            user_id: member.id,
            community_id: communityId,
            status: 'active'
          });

        if (error) throw error;

        toast({
          title: "Success",
          description: "You've successfully joined the community!",
        });
      } else {
        const { error } = await supabase
          .from('community_memberships')
          .delete()
          .eq('user_id', member.id)
          .eq('community_id', communityId);

        if (error) throw error;

        toast({
          title: "Success",
          description: "You've left the community",
        });
      }

      await refreshData();
    } catch (error) {
      console.error('Error toggling community membership:', error);
      toast({
        title: "Error",
        description: `Failed to ${isJoining ? 'join' : 'leave'} community`,
        variant: "destructive",
      });
    }
  };

  return {
    visitingCommunity,
    visitCommunity,
    toggleMembership
  };
};
