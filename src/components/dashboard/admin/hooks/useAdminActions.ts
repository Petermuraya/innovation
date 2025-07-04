
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAdminActions = () => {
  const { member } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const performAdminAction = async (action: string, targetId: string) => {
    if (!member) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to perform admin actions",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      let success = false;
      switch (action) {
        case 'verifyBlog':
          const { error: verifyError } = await supabase
            .from('blogs')
            .update({ admin_verified: true })
            .eq('id', targetId);
          if (verifyError) throw verifyError;
          success = true;
          break;
        case 'rejectBlog':
          const { error: blogRejectError } = await supabase
            .from('blogs')
            .update({ status: 'rejected' })
            .eq('id', targetId);
          if (blogRejectError) throw blogRejectError;
          success = true;
          break;
        case 'approveProject':
          const { error: approveError } = await supabase
            .from('project_submissions')
            .update({ status: 'approved' })
            .eq('id', targetId);
          if (approveError) throw approveError;
          success = true;
          break;
        case 'rejectProject':
          const { error: projectRejectError } = await supabase
            .from('project_submissions')
            .update({ status: 'rejected' })
            .eq('id', targetId);
          if (projectRejectError) throw projectRejectError;
          success = true;
          break;
        // Add more cases as needed
        default:
          toast({
            title: "Error",
            description: "Invalid action",
            variant: "destructive"
          });
          break;
      }

      if (success) {
        toast({
          title: "Success",
          description: `Action "${action}" performed successfully`,
        });
      }
    } catch (error) {
      console.error(`Error performing action "${action}":`, error);
      toast({
        title: "Error",
        description: `Failed to perform action "${action}"`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { performAdminAction, loading };
};
