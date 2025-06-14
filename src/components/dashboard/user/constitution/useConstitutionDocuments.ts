
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ConstitutionDocument {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  file_name: string;
  file_size: number | null;
  version: string;
  is_active: boolean;
  uploaded_by: string | null;
  created_at: string;
  updated_at: string;
}

export const useConstitutionDocuments = () => {
  const [documents, setDocuments] = useState<ConstitutionDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchConstitutionDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('constitution_documents')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching constitution documents:', error);
      toast({
        title: "Error",
        description: "Failed to load constitution documents",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConstitutionDocuments();
  }, []);

  return {
    documents,
    loading,
    refetch: fetchConstitutionDocuments
  };
};
