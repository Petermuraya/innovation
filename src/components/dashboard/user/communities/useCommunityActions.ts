
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useCommunityActions = (userMembershipCount: number, onDataUpdate: () => void) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [visitingCommunity, setVisitingCommunity] = useState<string | null>(null);

  const visitCommunity = async (communityId: string, communityName: string) => {
    if (!user) return;

    try {
      setVisitingCommunity(communityId);

      // Call the database function to track the visit
      const { data, error } = await supabase.rpc('track_community_visit', {
        user_id_param: user.id,
        community_id_param: communityId
      });

      if (error) throw error;

      // Show appropriate message based on whether points were awarded
      if (data) {
        toast({
          title: "Community visited!",
          description: `You visited ${communityName} and earned 5 points!`,
        });
      } else {
        toast({
          title: "Community visited!",
          description: `Welcome back to ${communityName}!`,
        });
      }
    } catch (error) {
      console.error('Error tracking community visit:', error);
      toast({
        title: "Visit recorded",
        description: `You visited ${communityName}`,
      });
    } finally {
      setVisitingCommunity(null);
    }
  };

  const toggleMembership = async (groupId: string, groupName: string, isMember: boolean) => {
    if (!user) return;

    try {
      if (isMember) {
        // Check if user would have less than 1 community after leaving
        if (userMembershipCount <= 1) {
          toast({
            title: "Cannot leave community",
            description: "You must be a member of at least one community",
            variant: "destructive",
          });
          return;
        }

        // Leave group
        await supabase
          .from('community_memberships')
          .delete()
          .eq('community_id', groupId)
          .eq('user_id', user.id);

        toast({
          title: "Left community",
          description: `You have left ${groupName}`,
        });
      } else {
        // Check membership limit before joining
        if (userMembershipCount >= 3) {
          toast({
            title: "Membership limit reached",
            description: "You can only join up to 3 communities",
            variant: "destructive",
          });
          return;
        }

        // Join group
        await supabase
          .from('community_memberships')
          .insert({
            community_id: groupId,
            user_id: user.id,
            status: 'active'
          });

        toast({
          title: "Joined community",
          description: `Welcome to ${groupName}!`,
        });
      }

      // Refresh data
      onDataUpdate();
    } catch (error) {
      console.error('Error toggling membership:', error);
      toast({
        title: "Error",
        description: "Failed to update membership",
        variant: "destructive",
      });
    }
  };

  return {
    visitingCommunity,
    visitCommunity,
    toggleMembership,
  };
};
