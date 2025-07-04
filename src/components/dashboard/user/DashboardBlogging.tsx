
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Eye, MessageSquare, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Blog {
  id: string;
  title: string;
  content: string;
  status: string;
  created_at: string;
  admin_verified: boolean;
  published_at?: string;
  view_count: number;
  likes_count?: number;
  comments_count?: number;
}

const DashboardBlogging: React.FC = () => {
  const { member } = useAuth();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (member) {
      fetchBlogs();
    }
  }, [member]);

  const fetchBlogs = async () => {
    if (!member) return;

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
        title: 'Error',
        description: 'Failed to fetch blogs',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading blogs...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Blog Posts</h3>
          <p className="text-muted-foreground">Write and manage your blog content</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Post
        </Button>
      </div>

      <div className="grid gap-6">
        {blogs.map((blog) => (
          <Card key={blog.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{blog.title}</CardTitle>
                  <CardDescription>
                    Created on {new Date(blog.created_at).toLocaleDateString()}
                    {blog.published_at && (
                      <span> • Published on {new Date(blog.published_at).toLocaleDateString()}</span>
                    )}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge variant={
                    blog.status === 'published' && blog.admin_verified ? 'default' :
                    blog.status === 'pending' ? 'secondary' : 'destructive'
                  }>
                    {blog.status === 'published' && blog.admin_verified ? 'Published' :
                     blog.status === 'pending' ? 'Pending Review' : blog.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                {blog.content.substring(0, 150)}...
              </p>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {blog.view_count || 0} views
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  {blog.likes_count || 0} likes
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="w-4 h-4" />
                  {blog.comments_count || 0} comments
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                {blog.status === 'published' && blog.admin_verified && (
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {blogs.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground mb-4">No blog posts yet</p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Write Your First Post
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DashboardBlogging;
