
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, Heart, MessageCircle, Clock, CheckCircle, XCircle, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import BlogCreator from './BlogCreator';

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

const DashboardBlogging = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreator, setShowCreator] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserBlogs();
    }
  }, [user]);

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

  const getStatusIcon = (blog: Blog) => {
    if (blog.status === 'published' && blog.admin_verified) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    } else if (blog.status === 'rejected') {
      return <XCircle className="w-4 h-4 text-red-500" />;
    } else {
      return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusText = (blog: Blog) => {
    if (blog.status === 'published' && blog.admin_verified) {
      return 'Published';
    } else if (blog.status === 'rejected') {
      return 'Rejected';
    } else {
      return 'Pending Review';
    }
  };

  const getStatusColor = (blog: Blog) => {
    if (blog.status === 'published' && blog.admin_verified) {
      return 'default';
    } else if (blog.status === 'rejected') {
      return 'destructive';
    } else {
      return 'secondary';
    }
  };

  const pendingBlogs = blogs.filter(b => b.status === 'pending' || !b.admin_verified);
  const publishedBlogs = blogs.filter(b => b.status === 'published' && b.admin_verified);
  const rejectedBlogs = blogs.filter(b => b.status === 'rejected');

  if (loading) {
    return <div className="text-center py-8">Loading your blogs...</div>;
  }

  if (showCreator) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Create New Blog Post</h2>
          <Button 
            variant="outline" 
            onClick={() => setShowCreator(false)}
          >
            Back to Blogs
          </Button>
        </div>
        <BlogCreator />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">My Blog Posts</h2>
        <Button onClick={() => setShowCreator(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Write Blog Post
        </Button>
      </div>

      {blogs.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-600">You haven't written any blog posts yet.</p>
            <Button className="mt-4" onClick={() => setShowCreator(true)}>
              Write Your First Post
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All ({blogs.length})</TabsTrigger>
            <TabsTrigger value="pending">
              Pending ({pendingBlogs.length})
            </TabsTrigger>
            <TabsTrigger value="published">
              Published ({publishedBlogs.length})
            </TabsTrigger>
            {rejectedBlogs.length > 0 && (
              <TabsTrigger value="rejected">
                Rejected ({rejectedBlogs.length})
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="all">
            <BlogList blogs={blogs} />
          </TabsContent>

          <TabsContent value="pending">
            {pendingBlogs.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-600">No pending blog posts.</p>
                </CardContent>
              </Card>
            ) : (
              <BlogList blogs={pendingBlogs} />
            )}
          </TabsContent>

          <TabsContent value="published">
            {publishedBlogs.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-600">No published blog posts yet.</p>
                </CardContent>
              </Card>
            ) : (
              <BlogList blogs={publishedBlogs} />
            )}
          </TabsContent>

          {rejectedBlogs.length > 0 && (
            <TabsContent value="rejected">
              <BlogList blogs={rejectedBlogs} />
            </TabsContent>
          )}
        </Tabs>
      )}
    </div>
  );
};

const BlogList = ({ blogs }: { blogs: Blog[] }) => {
  const getStatusIcon = (blog: Blog) => {
    if (blog.status === 'published' && blog.admin_verified) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    } else if (blog.status === 'rejected') {
      return <XCircle className="w-4 h-4 text-red-500" />;
    } else {
      return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusText = (blog: Blog) => {
    if (blog.status === 'published' && blog.admin_verified) {
      return 'Published';
    } else if (blog.status === 'rejected') {
      return 'Rejected';
    } else {
      return 'Pending Review';
    }
  };

  const getStatusColor = (blog: Blog) => {
    if (blog.status === 'published' && blog.admin_verified) {
      return 'default';
    } else if (blog.status === 'rejected') {
      return 'destructive';
    } else {
      return 'secondary';
    }
  };

  return (
    <div className="grid gap-4">
      {blogs.map((blog) => (
        <Card key={blog.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle className="flex items-center gap-2">
                {blog.title}
                {getStatusIcon(blog)}
              </CardTitle>
              <Badge variant={getStatusColor(blog) as any}>
                {getStatusText(blog)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {blog.excerpt && (
              <p className="text-gray-600 font-medium">{blog.excerpt}</p>
            )}
            
            <p className="text-gray-600 line-clamp-2">
              {blog.content.length > 150 
                ? `${blog.content.substring(0, 150)}...` 
                : blog.content
              }
            </p>

            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {blog.view_count || 0}
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  {blog.likes_count}
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  {blog.comments_count}
                </div>
              </div>
              
              <div className="text-sm text-gray-500">
                {blog.published_at 
                  ? `Published: ${new Date(blog.published_at).toLocaleDateString()}`
                  : `Created: ${new Date(blog.created_at).toLocaleDateString()}`
                }
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardBlogging;
