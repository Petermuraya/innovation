
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useUserDeletion = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const deleteUser = async (userId: string) => {
    setLoading(true);
    try {
      // Delete related data first (using existing tables only)
      
      // Delete member points
      const { error: pointsError } = await supabase
        .from('member_points')
        .delete()
        .eq('user_id', userId);

      if (pointsError) {
        console.error('Error deleting member points:', pointsError);
      }

      // Delete community visits
      const { error: visitsError } = await supabase
        .from('community_visits')
        .delete()
        .eq('user_id', userId);

      if (visitsError) {
        console.error('Error deleting community visits:', visitsError);
      }

      // Delete community memberships
      const { error: membershipsError } = await supabase
        .from('community_memberships')
        .delete()
        .eq('user_id', userId);

      if (membershipsError) {
        console.error('Error deleting community memberships:', membershipsError);
      }

      // Delete project submissions
      const { error: projectsError } = await supabase
        .from('project_submissions')
        .delete()
        .eq('user_id', userId);

      if (projectsError) {
        console.error('Error deleting project submissions:', projectsError);
      }

      // Delete blogs
      const { error: blogsError } = await supabase
        .from('blogs')
        .delete()
        .eq('user_id', userId);

      if (blogsError) {
        console.error('Error deleting blogs:', blogsError);
      }

      // Delete certificates
      const { error: certificatesError } = await supabase
        .from('certificates')
        .delete()
        .eq('user_id', userId);

      if (certificatesError) {
        console.error('Error deleting certificates:', certificatesError);
      }

      // Finally delete the member record
      const { error: memberError } = await supabase
        .from('members')
        .delete()
        .eq('user_id', userId);

      if (memberError) {
        throw memberError;
      }

      toast({
        title: "Success",
        description: "User deleted successfully",
      });

      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteUser, loading };
};
