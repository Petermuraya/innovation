
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Member {
  id: string;
  email: string;
  name: string;
  roles: string[];
  registration_status: string;
  phone?: string;
  course?: string;
  created_at: string;
}

export const useMemberDeletion = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const deleteMemberCompletely = async (member: Member) => {
    setLoading(true);
    
    try {
      console.log('Starting complete member deletion for:', member.name, member.id);

      // Delete member record (this will cascade to other tables via triggers)
      const { error: memberError } = await supabase
        .from('members')
        .delete()
        .eq('user_id', member.id);

      if (memberError) {
        console.error('Error deleting member record:', memberError);
        throw memberError;
      }

      console.log('Member deletion completed successfully');
      
      toast({
        title: "Member Deleted",
        description: `${member.name} has been permanently deleted from the system.`,
      });

      return true;
    } catch (error: any) {
      console.error('Error during member deletion:', error);
      toast({
        title: "Deletion Failed",
        description: error.message || "Failed to delete member. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteMemberCompletely,
    loading
  };
};
