
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  video_url?: string;
  tags?: string[];
  status: string;
  admin_verified: boolean;
  view_count: number;
  created_at: string;
  published_at?: string;
  user_id: string;
  author_name?: string;
  likes_count?: number;
  comments_count?: number;
  user_has_liked?: boolean;
}

export const useBlogData = () => {
  const { member } = useAuth();
  const { toast } = useToast();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      // Fetch published and admin-verified blogs
      const { data: blogsData, error: blogsError } = await supabase
        .from('blogs')
        .select('*')
        .eq('status', 'published')
        .eq('admin_verified', true)
        .order('published_at', { ascending: false });

      if (blogsError) {
        throw blogsError;
      }

      // Get unique user IDs from blogs
      const userIds = [...new Set(blogsData?.map(blog => blog.user_id) || [])];
      
      // Fetch member information for these user IDs
      const { data: membersData, error: membersError } = await supabase
        .from('members')
        .select('user_id, name')
        .in('user_id', userIds);

      if (membersError) {
        console.error('Error fetching member data:', membersError);
      }

      // Create a map of user_id to member name
      const memberMap = new Map(
        membersData?.map(member => [member.user_id, member.name]) || []
      );

      // Process the blogs data with author names
      const processedData = blogsData?.map(blog => ({
        ...blog,
        author_name: memberMap.get(blog.user_id) || 'Anonymous'
      })) || [];

      setBlogs(processedData);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      toast({
        title: "Error",
        description: "Failed to load blogs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const likeBlog = async (blogId: string) => {
    if (!member) {
      toast({
        title: "Authentication required",
        description: "Please log in to like this blog",
        variant: "destructive",
      });
      return;
    }

    try {
      // Check if user already liked this blog
      const { data: existingLike } = await supabase
        .from('blog_likes')
        .select('id')
        .eq('blog_id', blogId)
        .eq('user_id', member.id)
        .single();

      if (existingLike) {
        // Unlike the blog
        await supabase
          .from('blog_likes')
          .delete()
          .eq('blog_id', blogId)
          .eq('user_id', member.id);
      } else {
        // Like the blog
        await supabase
          .from('blog_likes')
          .insert({
            blog_id: blogId,
            user_id: member.id,
          });
      }

      // Refresh blogs to get updated like counts
      await fetchBlogs();

      toast({
        title: existingLike ? "Blog Unliked" : "Blog Liked",
        description: existingLike ? "You have unliked this blog" : "You have liked this blog",
      });
    } catch (error) {
      console.error('Error liking blog:', error);
      toast({
        title: "Error",
        description: "Failed to like this blog",
        variant: "destructive",
      });
    }
  };

  return {
    blogs,
    loading,
    fetchBlogs,
    likeBlog,
    availableTags: [...new Set(blogs.flatMap(blog => blog.tags || []))],
  };
};
