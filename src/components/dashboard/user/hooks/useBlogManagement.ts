
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  tags: string[] | null;
  status: string;
  admin_verified: boolean;
  published_at: string | null;
  created_at: string;
  view_count: number;
  likes_count: number;
  comments_count: number;
}

export const useBlogManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUserBlogs = async () => {
    if (!user) return;

    try {
      // Get user's blogs
      const { data: blogsData, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Enrich with interaction counts
      const enrichedBlogs = await Promise.all(
        (blogsData || []).map(async (blog) => {
          // Get likes count
          const { count: likesCount } = await supabase
            .from('blog_likes')
            .select('*', { count: 'exact', head: true })
            .eq('blog_id', blog.id);

          // Get comments count
          const { count: commentsCount } = await supabase
            .from('blog_comments')
            .select('*', { count: 'exact', head: true })
            .eq('blog_id', blog.id);

          return {
            ...blog,
            likes_count: likesCount || 0,
            comments_count: commentsCount || 0,
          };
        })
      );

      setBlogs(enrichedBlogs);
    } catch (error) {
      console.error('Error fetching user blogs:', error);
      toast({
        title: "Error",
        description: "Failed to load your blogs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserBlogs();
    }
  }, [user]);

  return {
    blogs,
    loading,
    refetchBlogs: fetchUserBlogs
  };
};
