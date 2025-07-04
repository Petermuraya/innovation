
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Blog {
  id: string;
  title: string;
  content: string;
  status: string;
  created_at: string;
  excerpt?: string;
  tags?: string[];
}

export const useBlogManagement = () => {
  const { member } = useAuth();
  const { toast } = useToast();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    if (!member) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('user_id', member.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBlogs(data || []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      toast({
        title: "Error",
        description: "Failed to load your blogs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const refetchBlogs = () => {
    fetchBlogs();
  };

  useEffect(() => {
    fetchBlogs();
  }, [member]);

  return {
    blogs,
    loading,
    refetchBlogs,
  };
};
