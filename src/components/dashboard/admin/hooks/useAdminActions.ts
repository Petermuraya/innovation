
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useAdminActions = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const updateMemberStatus = async (memberId: string, status: string) => {
    console.log('Updating member status:', memberId, status);
    try {
      const { error } = await supabase
        .from('members')
        .update({ 
          registration_status: status,
          updated_at: new Date().toISOString()
        })
        .eq('id', memberId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Member status updated to ${status}`,
      });
    } catch (error) {
      console.error('Error updating member status:', error);
      toast({
        title: "Error",
        description: "Failed to update member status",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateProjectStatus = async (projectId: string, status: string, feedback?: string) => {
    console.log('Updating project status:', projectId, status);
    try {
      const updateData: any = {
        status,
        reviewed_by: user?.id,
        reviewed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (feedback?.trim()) {
        updateData.admin_feedback = feedback.trim();
      }

      const { error } = await supabase
        .from('project_submissions')
        .update(updateData)
        .eq('id', projectId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Project ${status} successfully`,
      });
    } catch (error) {
      console.error('Error updating project status:', error);
      toast({
        title: "Error",
        description: "Failed to update project status",
        variant: "destructive"
      });
      throw error;
    }
  };

  return {
    updateMemberStatus,
    updateProjectStatus
  };
};
