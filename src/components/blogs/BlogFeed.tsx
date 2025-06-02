
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Eye, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Blog {
  id: string;
  title: string;
  excerpt: string;
  featured_image: string | null;
  tags: string[];
  published_at: string;
  view_count: number;
  author_name: string;
  likes_count: number;
  comments_count: number;
  user_has_liked: boolean;
}

const BlogFeed = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, [user]);

  const fetchBlogs = async () => {
    try {
      // Fetch published blogs with author info
      const { data: blogsData, error: blogsError } = await supabase
        .from('blogs')
        .select(`
          *,
          members!inner(name)
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(10);

      if (blogsError) throw blogsError;

      // For each blog, get likes and comments count
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

          // Check if current user has liked this blog
          let userHasLiked = false;
          if (user) {
            const { data: userLike } = await supabase
              .from('blog_likes')
              .select('id')
              .eq('blog_id', blog.id)
              .eq('user_id', user.id)
              .single();
            userHasLiked = !!userLike;
          }

          return {
            ...blog,
            author_name: blog.members.name,
            likes_count: likesCount || 0,
            comments_count: commentsCount || 0,
            user_has_liked: userHasLiked,
          };
        })
      );

      setBlogs(enrichedBlogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      toast({
        title: "Error",
        description: "Failed to load blog posts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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

      if (blog.user_has_liked) {
        // Remove like
        await supabase
          .from('blog_likes')
          .delete()
          .eq('blog_id', blogId)
          .eq('user_id', user.id);
      } else {
        // Add like
        await supabase
          .from('blog_likes')
          .insert({
            blog_id: blogId,
            user_id: user.id
          });
      }

      // Update local state
      setBlogs(prevBlogs =>
        prevBlogs.map(blog =>
          blog.id === blogId
            ? {
                ...blog,
                user_has_liked: !blog.user_has_liked,
                likes_count: blog.user_has_liked ? blog.likes_count - 1 : blog.likes_count + 1
              }
            : blog
        )
      );
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like",
        variant: "destructive",
      });
    }
  };

  const incrementViewCount = async (blogId: string) => {
    try {
      await supabase
        .from('blogs')
        .update({ view_count: supabase.sql`view_count + 1` })
        .eq('id', blogId);
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading blog posts...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-kic-gray mb-4">Latest Blog Posts</h2>
        <p className="text-kic-gray/70 max-w-2xl mx-auto">
          Stay updated with the latest insights, tutorials, and stories from our innovation community.
        </p>
      </div>

      <div className="space-y-6">
        {blogs.map((blog) => (
          <Card key={blog.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle 
                    className="text-2xl hover:text-kic-green-600 cursor-pointer"
                    onClick={() => incrementViewCount(blog.id)}
                  >
                    {blog.title}
                  </CardTitle>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>by {blog.author_name}</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(blog.published_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{blog.view_count} views</span>
                    </div>
                  </div>
                </div>
                {blog.featured_image && (
                  <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden ml-4">
                    <img 
                      src={blog.featured_image} 
                      alt={blog.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {blog.excerpt && (
                <p className="text-gray-700 leading-relaxed">{blog.excerpt}</p>
              )}
              
              <div className="flex flex-wrap gap-2">
                {blog.tags?.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleLike(blog.id)}
                    className={`flex items-center gap-1 hover:text-red-600 ${
                      blog.user_has_liked ? 'text-red-600' : 'text-gray-600'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${blog.user_has_liked ? 'fill-current' : ''}`} />
                    <span>{blog.likes_count}</span>
                  </button>
                  <div className="flex items-center gap-1 text-gray-600">
                    <MessageCircle className="w-5 h-5" />
                    <span>{blog.comments_count}</span>
                  </div>
                </div>
                <Button variant="outline" onClick={() => incrementViewCount(blog.id)}>
                  Read More
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BlogFeed;
