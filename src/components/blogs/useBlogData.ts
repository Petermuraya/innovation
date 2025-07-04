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
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('blogs')
        .select(`*, author_name:members(name)`)
        .order('created_at', { ascending: false });

      if (selectedTags.length > 0) {
        query = query.contains('tags', selectedTags);
      }

      if (searchTerm) {
        query = query.ilike('title', `%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setBlogs(data || []);
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
  }, [selectedTags, searchTerm]);

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
      const { data, error } = await supabase.rpc('like_blog', {
        blog_id: blogId,
        user_id: member.id,
      });

      if (error) {
        throw error;
      }

      // Optimistically update the like count
      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) =>
          blog.id === blogId
            ? {
                ...blog,
                likes_count: (blog.likes_count || 0) + (blog.user_has_liked ? -1 : 1),
                user_has_liked: !blog.user_has_liked,
              }
            : blog
        )
      );

      toast({
        title: "Blog Liked",
        description: "You have liked this blog",
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
    selectedTags,
    setSelectedTags,
    searchTerm,
    setSearchTerm,
    fetchBlogs,
    likeBlog,
    availableTags: [...new Set(blogs.flatMap(blog => blog.tags || []))],
  };
};
