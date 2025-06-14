
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface CareerOpportunityFormData {
  title: string;
  company_name: string;
  type: string;
  location: string;
  remote: boolean;
  description: string;
  requirements: string;
  salary_range: string;
  application_url: string;
  application_email: string;
  expires_at: string;
}

interface UseCareerOpportunityFormProps {
  opportunity?: any;
  onSuccess: () => void;
}

export const useCareerOpportunityForm = ({ opportunity, onSuccess }: UseCareerOpportunityFormProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CareerOpportunityFormData>({
    title: '',
    company_name: '',
    type: '',
    location: '',
    remote: false,
    description: '',
    requirements: '',
    salary_range: '',
    application_url: '',
    application_email: '',
    expires_at: ''
  });

  useEffect(() => {
    if (opportunity) {
      setFormData({
        title: opportunity.title || '',
        company_name: opportunity.company_name || '',
        type: opportunity.type || '',
        location: opportunity.location || '',
        remote: opportunity.remote || false,
        description: opportunity.description || '',
        requirements: opportunity.requirements || '',
        salary_range: opportunity.salary_range || '',
        application_url: opportunity.application_url || '',
        application_email: opportunity.application_email || '',
        expires_at: opportunity.expires_at ? new Date(opportunity.expires_at).toISOString().split('T')[0] : ''
      });
    }
  }, [opportunity]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const submitData = {
        ...formData,
        posted_by: user.id,
        expires_at: formData.expires_at ? new Date(formData.expires_at).toISOString() : null
      };

      if (opportunity) {
        // Update existing opportunity
        const { error } = await supabase
          .from('career_opportunities')
          .update(submitData)
          .eq('id', opportunity.id);

        if (error) throw error;
        toast.success('Opportunity updated successfully!');
      } else {
        // Create new opportunity
        const { error } = await supabase
          .from('career_opportunities')
          .insert(submitData);

        if (error) throw error;
        toast.success('Opportunity posted successfully!');
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving opportunity:', error);
      toast.error('Error saving opportunity');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return {
    formData,
    loading,
    handleSubmit,
    handleChange
  };
};
