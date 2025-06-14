
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CheckCircle, XCircle, Clock, Eye, FileText, User, Calendar, Image, Video, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface BlogAttachment {
  id: string;
  file_url: string;
  file_type: 'image' | 'video';
  file_name: string | null;
  file_size: number;
}

interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  status: string;
  user_id: string;
  created_at: string;
  featured_image?: string;
  video_url?: string;
  tags?: string[];
  view_count?: number;
  verified_by?: string;
  verified_at?: string;
  author_name?: string;
  verifier_name?: string;
  attachments?: BlogAttachment[];
}

const BlogManagement = () => {
  const { toast } = useToast();
  const { user } = useAuth();
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
      
      // Fetch blogs with basic info
      const { data: blogsData, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Enrich blogs with author names, verifier names, and attachments
      const enrichedBlogs = await Promise.all(
        (blogsData || []).map(async (blog) => {
          // Get author name
          const { data: author } = await supabase
            .from('members')
            .select('name')
            .eq('user_id', blog.user_id)
            .single();

          // Get verifier name if blog is verified
          let verifierName = null;
          if (blog.verified_by) {
            const { data: verifier } = await supabase
              .from('members')
              .select('name')
              .eq('user_id', blog.verified_by)
              .single();
            verifierName = verifier?.name;
          }

          // Get attachments with proper type casting
          const { data: attachments } = await supabase
            .from('blog_attachments')
            .select('*')
            .eq('blog_id', blog.id);

          // Cast attachments to proper type
          const typedAttachments: BlogAttachment[] = (attachments || []).map(attachment => ({
            ...attachment,
            file_type: attachment.file_type as 'image' | 'video'
          }));

          return {
            ...blog,
            author_name: author?.name || 'Unknown Author',
            verifier_name: verifierName,
            attachments: typedAttachments,
          };
        })
      );

      setBlogs(enrichedBlogs);
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
    if (!user) return;
    
    setReviewing(true);
    try {
      const { error } = await supabase
        .from('blogs')
        .update({ 
          status,
          admin_verified: status === 'published',
          verified_by: user.id,
          verified_at: new Date().toISOString(),
          published_at: status === 'published' ? new Date().toISOString() : null,
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

  const handleDeleteBlog = async (blogId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', blogId);

      if (error) throw error;

      toast({
        title: "Blog deleted",
        description: "Blog has been permanently removed",
      });

      setSelectedBlog(null);
      await fetchBlogs();
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast({
        title: "Error",
        description: "Failed to delete blog",
        variant: "destructive",
      });
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

  const formatFileSize = (bytes: number) => {
    return (bytes / 1024 / 1024).toFixed(1) + 'MB';
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
        <CardDescription>Review and manage blog posts submitted by members</CardDescription>
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
                  
                  <div className="flex items-center gap-1 mb-2 text-sm text-muted-foreground">
                    <User className="h-3 w-3" />
                    <span>By {blog.author_name}</span>
                  </div>
                  
                  {blog.excerpt && (
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {blog.excerpt}
                    </p>
                  )}

                  {/* Show attachments info */}
                  {blog.attachments && blog.attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {blog.attachments.map((attachment) => (
                        <div key={attachment.id} className="flex items-center gap-1 text-xs bg-gray-100 rounded px-2 py-1">
                          {attachment.file_type === 'image' ? (
                            <Image className="h-3 w-3 text-blue-500" />
                          ) : (
                            <Video className="h-3 w-3 text-green-500" />
                          )}
                          <span>{attachment.file_name}</span>
                          <span className="text-gray-500">({formatFileSize(attachment.file_size)})</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span>Views: {blog.view_count || 0}</span>
                    <span>Created: {new Date(blog.created_at).toLocaleDateString()}</span>
                    {blog.tags && blog.tags.length > 0 && (
                      <span>Tags: {blog.tags.join(', ')}</span>
                    )}
                  </div>

                  {/* Show verification info for published/rejected blogs */}
                  {(blog.status === 'published' || blog.status === 'rejected') && blog.verifier_name && blog.verified_at && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground bg-muted p-2 rounded">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {blog.status === 'published' ? 'Approved' : 'Rejected'} by {blog.verifier_name} on{' '}
                        {new Date(blog.verified_at).toLocaleDateString()} at{' '}
                        {new Date(blog.verified_at).toLocaleTimeString()}
                      </span>
                    </div>
                  )}
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
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Blog Post Details</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <strong>Title:</strong> {blog.title}
                        </div>
                        <div>
                          <strong>Author:</strong> {blog.author_name}
                        </div>
                        {blog.excerpt && (
                          <div>
                            <strong>Excerpt:</strong>
                            <p className="mt-1 text-sm text-muted-foreground">{blog.excerpt}</p>
                          </div>
                        )}

                        {/* Display attachments */}
                        {blog.attachments && blog.attachments.length > 0 && (
                          <div>
                            <strong>Attachments:</strong>
                            <div className="mt-2 space-y-2">
                              {blog.attachments.map((attachment) => (
                                <div key={attachment.id} className="border rounded p-2">
                                  {attachment.file_type === 'image' ? (
                                    <img 
                                      src={attachment.file_url} 
                                      alt={attachment.file_name || 'Attachment'}
                                      className="max-h-64 w-auto rounded"
                                    />
                                  ) : (
                                    <video 
                                      src={attachment.file_url} 
                                      controls
                                      className="max-h-64 w-auto rounded"
                                    />
                                  )}
                                  <p className="text-xs text-gray-500 mt-1">
                                    {attachment.file_name} ({formatFileSize(attachment.file_size)})
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div>
                          <strong>Content:</strong>
                          <div className="mt-1 p-3 bg-muted rounded-md text-sm max-h-60 overflow-y-auto whitespace-pre-wrap">
                            {blog.content}
                          </div>
                        </div>
                        {blog.tags && blog.tags.length > 0 && (
                          <div>
                            <strong>Tags:</strong> {blog.tags.join(', ')}
                          </div>
                        )}
                        
                        {/* Show verification details in dialog */}
                        {(blog.status === 'published' || blog.status === 'rejected') && blog.verifier_name && blog.verified_at && (
                          <div className="border-t pt-4">
                            <strong>Verification Details:</strong>
                            <div className="mt-1 text-sm text-muted-foreground">
                              {blog.status === 'published' ? 'Approved' : 'Rejected'} by <span className="font-medium">{blog.verifier_name}</span>
                              <br />
                              Date: {new Date(blog.verified_at).toLocaleDateString()}
                              <br />
                              Time: {new Date(blog.verified_at).toLocaleTimeString()}
                            </div>
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

                        {/* Delete option for all blogs */}
                        <div className="border-t pt-4">
                          <Button
                            onClick={() => handleDeleteBlog(blog.id)}
                            variant="destructive"
                            size="sm"
                            className="flex items-center gap-1"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete Blog
                          </Button>
                        </div>
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
