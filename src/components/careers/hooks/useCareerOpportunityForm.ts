
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CareerOpportunityFormData {
  title: string;
  company_name: string;
  type: 'internship' | 'full_time' | 'part_time' | 'contract';
  location: string;
  description: string;
  requirements: string;
  salary_range: string;
  application_url: string;
  application_email: string;
  remote: boolean;
  expires_at: string;
}

export const useCareerOpportunityForm = () => {
  const { member } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const submitOpportunity = async (formData: CareerOpportunityFormData) => {
    if (!member) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to post opportunities",
        variant: "destructive"
      });
      return false;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('career_opportunities')
        .insert({
          ...formData,
          posted_by: member.id,
          expires_at: formData.expires_at ? new Date(formData.expires_at).toISOString() : null
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Career opportunity posted successfully!",
      });
      
      return true;
    } catch (error) {
      console.error('Error posting opportunity:', error);
      toast({
        title: "Error",
        description: "Failed to post career opportunity",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    submitOpportunity,
    loading,
    isAuthenticated: !!member
  };
};
