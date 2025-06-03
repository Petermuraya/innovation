
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  featured_image: string | null;
  status: string;
  tags: string[] | null;
  published_at: string | null;
  created_at: string;
  view_count: number | null;
  user_id: string;
  admin_verified: boolean;
  author_name?: string;
  likes_count?: number;
  comments_count?: number;
  is_liked?: boolean;
}

export const useBlogData = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [allTags, setAllTags] = useState<string[]>([]);

  const fetchBlogs = async () => {
    console.log('useBlogData: Starting fetchBlogs');
    try {
      // Get blogs with basic info first - only show published and verified blogs
      const { data: blogsData, error } = await supabase
        .from('blogs')
        .select(`*`)
        .eq('status', 'published')
        .eq('admin_verified', true)
        .order('published_at', { ascending: false });

      if (error) {
        console.error('useBlogData: Error fetching blogs:', error);
        throw error;
      }

      console.log('useBlogData: Fetched blogs data:', blogsData?.length || 0, 'blogs');

      // Safely handle empty data
      if (!blogsData || !Array.isArray(blogsData)) {
        console.log('useBlogData: No blogs data or invalid format, setting empty array');
        setBlogs([]);
        setLoading(false);
        return;
      }

      // Enrich blogs with author names and interaction counts
      const enrichedBlogs = await Promise.all(
        blogsData.map(async (blog, index) => {
          console.log(`useBlogData: Processing blog ${index + 1}/${blogsData.length}: ${blog.id}`);
          
          try {
            // Get author name from members table
            const { data: member } = await supabase
              .from('members')
              .select('name')
              .eq('user_id', blog.user_id)
              .single();

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

            // Check if current user liked this blog
            let isLiked = false;
            if (user) {
              const { data: like } = await supabase
                .from('blog_likes')
                .select('id')
                .eq('blog_id', blog.id)
                .eq('user_id', user.id)
                .single();
              isLiked = !!like;
            }

            return {
              ...blog,
              author_name: member?.name || 'Anonymous',
              likes_count: likesCount || 0,
              comments_count: commentsCount || 0,
              is_liked: isLiked,
            };
          } catch (enrichError) {
            console.error(`useBlogData: Error enriching blog ${blog.id}:`, enrichError);
            // Return blog with default values if enrichment fails
            return {
              ...blog,
              author_name: 'Anonymous',
              likes_count: 0,
              comments_count: 0,
              is_liked: false,
            };
          }
        })
      );

      console.log('useBlogData: Successfully enriched blogs:', enrichedBlogs.length);
      setBlogs(enrichedBlogs);
    } catch (error) {
      console.error('useBlogData: Error in fetchBlogs:', error);
      toast({
        title: "Error",
        description: "Failed to load blogs",
        variant: "destructive",
      });
      // Set empty array on error to prevent undefined issues
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTags = async () => {
    console.log('useBlogData: Starting fetchTags');
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('tags')
        .eq('status', 'published')
        .eq('admin_verified', true);

      if (error) {
        console.error('useBlogData: Error fetching tags:', error);
        throw error;
      }

      const tagSet = new Set<string>();
      if (data && Array.isArray(data)) {
        data.forEach(blog => {
          if (blog.tags && Array.isArray(blog.tags)) {
            blog.tags.forEach((tag: string) => {
              if (tag && typeof tag === 'string') {
                tagSet.add(tag);
              }
            });
          }
        });
      }

      const tagsArray = Array.from(tagSet);
      console.log('useBlogData: Fetched tags:', tagsArray.length);
      setAllTags(tagsArray);
    } catch (error) {
      console.error('useBlogData: Error fetching tags:', error);
      setAllTags([]);
    }
  };

  const toggleLike = async (blogId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to like posts",
        variant: "destructive",
      });
      return;
    }

    try {
      const blog = blogs.find(b => b.id === blogId);
      if (!blog) return;

      if (blog.is_liked) {
        // Unlike
        await supabase
          .from('blog_likes')
          .delete()
          .eq('blog_id', blogId)
          .eq('user_id', user.id);
      } else {
        // Like
        await supabase
          .from('blog_likes')
          .insert({
            blog_id: blogId,
            user_id: user.id,
          });
      }

      // Refresh blogs to update counts
      await fetchBlogs();
    } catch (error) {
      console.error('useBlogData: Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like",
        variant: "destructive",
      });
    }
  };

  const refreshData = async () => {
    await Promise.all([fetchBlogs(), fetchTags()]);
  };

  useEffect(() => {
    console.log('useBlogData: Hook mounted, starting data fetch');
    refreshData();
  }, []);

  return {
    blogs,
    loading,
    allTags,
    toggleLike,
    refreshData,
  };
};
