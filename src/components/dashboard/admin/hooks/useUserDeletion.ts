
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
  registration_status: string;
  phone?: string;
  course?: string;
  created_at: string;
}

export const useUserDeletion = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const deleteUserCompletely = async (user: User): Promise<boolean> => {
    try {
      setLoading(true);
      console.log('Starting complete user deletion for:', user.name, user.id);

      // Step 1: Delete all related data manually (more reliable than trigger)
      const deleteOperations = [
        // Delete user roles first
        supabase.from('user_roles').delete().eq('user_id', user.id),
        // Delete member points
        supabase.from('member_points').delete().eq('user_id', user.id),
        // Delete community memberships
        supabase.from('community_memberships').delete().eq('user_id', user.id),
        // Delete event attendance
        supabase.from('event_attendance').delete().eq('user_id', user.id),
        // Delete project submissions
        supabase.from('project_submissions').delete().eq('user_id', user.id),
        // Delete certificates
        supabase.from('certificates').delete().eq('user_id', user.id),
        // Delete blogs
        supabase.from('blogs').delete().eq('user_id', user.id),
        // Delete website visits
        supabase.from('user_website_visits').delete().eq('user_id', user.id),
        // Delete community visits
        supabase.from('community_visits').delete().eq('user_id', user.id),
        // Delete admin requests
        supabase.from('admin_requests').delete().eq('user_id', user.id),
        // Delete community admin roles
        supabase.from('community_admin_roles').delete().eq('user_id', user.id),
        // Delete community admins
        supabase.from('community_admins').delete().eq('user_id', user.id),
        // Delete project likes
        supabase.from('project_likes').delete().eq('user_id', user.id),
        // Delete project ratings
        supabase.from('project_ratings').delete().eq('user_id', user.id),
        // Delete project comments
        supabase.from('project_comments').delete().eq('user_id', user.id),
        // Delete blog likes
        supabase.from('blog_likes').delete().eq('user_id', user.id),
        // Delete blog comments
        supabase.from('blog_comments').delete().eq('user_id', user.id),
        // Delete election candidates
        supabase.from('election_candidates').delete().eq('user_id', user.id),
        // Delete mpesa payments
        supabase.from('mpesa_payments').delete().eq('user_id', user.id),
        // Delete payment requests
        supabase.from('payment_requests').delete().eq('user_id', user.id),
        // Delete meeting attendance
        supabase.from('meeting_link_attendance').delete().eq('user_id', user.id),
        // Delete community attendance tracking
        supabase.from('community_attendance_tracking').delete().eq('user_id', user.id),
        // Delete user submissions
        supabase.from('user_submissions').delete().eq('user_id', user.id),
        // Delete submission responses
        supabase.from('submission_responses').delete().eq('admin_id', user.id),
        // Delete chatbot conversations
        supabase.from('chatbot_conversations').delete().eq('user_id', user.id),
      ];

      // Execute all delete operations
      console.log('Deleting related data...');
      const deleteResults = await Promise.allSettled(deleteOperations);
      
      // Log any failures but don't stop the process
      deleteResults.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.warn(`Delete operation ${index} failed:`, result.reason);
        }
      });

      // Step 2: Delete the member record (this should be last)
      console.log('Deleting member record...');
      const { error: memberError } = await supabase
        .from('members')
        .delete()
        .eq('user_id', user.id);

      if (memberError) {
        console.error('Error deleting member record:', memberError);
        throw memberError;
      }

      // Step 3: Verify deletion by checking if user still exists
      console.log('Verifying deletion...');
      const { data: verifyData, error: verifyError } = await supabase
        .from('members')
        .select('user_id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (verifyError) {
        console.error('Error verifying deletion:', verifyError);
        throw verifyError;
      }

      if (verifyData) {
        console.error('User still exists after deletion attempt');
        throw new Error('User deletion verification failed - user still exists');
      }

      console.log('User deletion completed and verified successfully');
      
      toast({
        title: "Success",
        description: `User ${user.name} has been completely removed from the system`,
      });

      return true;

    } catch (error) {
      console.error('Error in complete user deletion:', error);
      toast({
        title: "Error",
        description: "Failed to delete user completely. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteUserCompletely,
    loading
  };
};
