
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AdminRequest {
  id: string;
  user_id?: string;
  name: string;
  email: string;
  justification: string;
  status: string;
  admin_type: string;
  admin_code?: string;
  community_id?: string;
  created_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  community_groups?: {
    name: string;
  };
}

interface Community {
  id: string;
  name: string;
}

export const useAdminRequests = () => {
  const { toast } = useToast();
  const [requests, setRequests] = useState<AdminRequest[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('admin_requests')
        .select(`
          *,
          community_groups:community_groups(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching admin requests:', error);
      toast({
        title: "Error",
        description: "Failed to load admin requests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCommunities = async () => {
    try {
      const { data, error } = await supabase
        .from('community_groups')
        .select('id, name')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setCommunities(data || []);
    } catch (error) {
      console.error('Error fetching communities:', error);
      toast({
        title: "Error",
        description: "Failed to load communities",
        variant: "destructive",
      });
    }
  };

  return {
    requests,
    communities,
    loading,
    fetchRequests,
    fetchCommunities,
  };
};
