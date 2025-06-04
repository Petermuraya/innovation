
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CheckCircle, XCircle, Clock, Eye, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  status: string;
  user_id: string;
  created_at: string;
  featured_image?: string;
  tags?: string[];
  view_count?: number;
}

const BlogManagement = () => {
  const { toast } = useToast();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [reviewing, setReviewing] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
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

  const handleReviewBlog = async (blogId: string, status: 'published' | 'rejected') => {
    setReviewing(true);
    try {
      const { error } = await supabase
        .from('blogs')
        .update({ 
          status,
          admin_verified: status === 'published',
          verified_at: status === 'published' ? new Date().toISOString() : null
        })
        .eq('id', blogId);

      if (error) throw error;

      toast({
        title: status === 'published' ? "Blog approved" : "Blog rejected",
        description: `Blog has been ${status}`,
      });

      setSelectedBlog(null);
      await fetchBlogs();
    } catch (error) {
      console.error('Error reviewing blog:', error);
      toast({
        title: "Error",
        description: `Failed to ${status} blog`,
        variant: "destructive",
      });
    } finally {
      setReviewing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="flex items-center gap-1"><Clock className="h-3 w-3" />Pending</Badge>;
      case 'published':
        return <Badge className="flex items-center gap-1 bg-green-500 hover:bg-green-600"><CheckCircle className="h-3 w-3" />Published</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="flex items-center gap-1"><XCircle className="h-3 w-3" />Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading blogs...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Blog Management
        </CardTitle>
        <CardDescription>Review and manage blog posts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {blogs.map((blog) => (
            <div key={blog.id} className="border rounded-lg p-4">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h4 className="font-medium truncate">{blog.title}</h4>
                    {getStatusBadge(blog.status)}
                  </div>
                  
                  {blog.excerpt && (
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {blog.excerpt}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span>Views: {blog.view_count || 0}</span>
                    <span>Created: {new Date(blog.created_at).toLocaleDateString()}</span>
                    {blog.tags && blog.tags.length > 0 && (
                      <span>Tags: {blog.tags.join(', ')}</span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setSelectedBlog(blog)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        {blog.status === 'pending' ? 'Review' : 'View'}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Blog Post Details</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <strong>Title:</strong> {blog.title}
                        </div>
                        {blog.excerpt && (
                          <div>
                            <strong>Excerpt:</strong>
                            <p className="mt-1 text-sm text-muted-foreground">{blog.excerpt}</p>
                          </div>
                        )}
                        <div>
                          <strong>Content:</strong>
                          <div className="mt-1 p-3 bg-muted rounded-md text-sm max-h-60 overflow-y-auto">
                            {blog.content}
                          </div>
                        </div>
                        {blog.tags && blog.tags.length > 0 && (
                          <div>
                            <strong>Tags:</strong> {blog.tags.join(', ')}
                          </div>
                        )}
                        
                        {blog.status === 'pending' && (
                          <div className="flex gap-2 pt-4">
                            <Button
                              onClick={() => handleReviewBlog(blog.id, 'published')}
                              disabled={reviewing}
                              className="flex-1 bg-green-600 hover:bg-green-700"
                            >
                              {reviewing ? 'Processing...' : 'Approve & Publish'}
                            </Button>
                            <Button
                              onClick={() => handleReviewBlog(blog.id, 'rejected')}
                              disabled={reviewing}
                              variant="destructive"
                              className="flex-1"
                            >
                              {reviewing ? 'Processing...' : 'Reject'}
                            </Button>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          ))}
          
          {blogs.length === 0 && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted" />
              <p className="text-muted-foreground">No blog posts found.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BlogManagement;
