
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

interface UseCareerOpportunityFormProps {
  opportunity?: any;
  onSuccess: () => void;
}

export const useCareerOpportunityForm = ({ opportunity, onSuccess }: UseCareerOpportunityFormProps) => {
  const { member } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<CareerOpportunityFormData>({
    title: opportunity?.title || '',
    company_name: opportunity?.company_name || '',
    type: opportunity?.type || 'full_time',
    location: opportunity?.location || '',
    description: opportunity?.description || '',
    requirements: opportunity?.requirements || '',
    salary_range: opportunity?.salary_range || '',
    application_url: opportunity?.application_url || '',
    application_email: opportunity?.application_email || '',
    remote: opportunity?.remote || false,
    expires_at: opportunity?.expires_at || '',
  });

  const handleChange = (field: keyof CareerOpportunityFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!member) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to post opportunities",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      if (opportunity) {
        // Update existing opportunity
        const { error } = await supabase
          .from('career_opportunities')
          .update({
            ...formData,
            expires_at: formData.expires_at ? new Date(formData.expires_at).toISOString() : null
          })
          .eq('id', opportunity.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Career opportunity updated successfully!",
        });
      } else {
        // Create new opportunity
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
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error saving opportunity:', error);
      toast({
        title: "Error",
        description: "Failed to save career opportunity",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    handleSubmit,
    handleChange,
  };
};
