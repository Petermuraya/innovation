
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useCareerManagement = () => {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOpportunities = async () => {
    try {
      const { data, error } = await supabase
        .from('career_opportunities')
        .select(`
          *,
          members!inner(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOpportunities(data || []);
    } catch (error) {
      console.error('Error fetching opportunities:', error);
      toast.error('Error loading career opportunities');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOpportunity = async (opportunityId: string) => {
    if (!confirm('Are you sure you want to delete this opportunity?')) return;

    try {
      const { error } = await supabase
        .from('career_opportunities')
        .delete()
        .eq('id', opportunityId);

      if (error) throw error;

      toast.success('Opportunity deleted successfully');
      fetchOpportunities();
    } catch (error) {
      console.error('Error deleting opportunity:', error);
      toast.error('Error deleting opportunity');
    }
  };

  const handleStatusToggle = async (opportunityId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

    try {
      const { error } = await supabase
        .from('career_opportunities')
        .update({ status: newStatus })
        .eq('id', opportunityId);

      if (error) throw error;

      toast.success(`Opportunity ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
      fetchOpportunities();
    } catch (error) {
      console.error('Error updating opportunity status:', error);
      toast.error('Error updating opportunity status');
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);

  return {
    opportunities,
    loading,
    fetchOpportunities,
    handleDeleteOpportunity,
    handleStatusToggle
  };
};
