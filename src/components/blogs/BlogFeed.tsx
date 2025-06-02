
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Heart, MessageCircle, Eye, Calendar, User, Plus, Search, Filter, CheckCircle } from 'lucide-react';
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

const BlogFeed = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [allTags, setAllTags] = useState<string[]>([]);

  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [tags, setTags] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchBlogs();
    fetchTags();
  }, []);

  const fetchBlogs = async () => {
    try {
      // Get blogs with basic info first - only show published and verified blogs
      const { data: blogsData, error } = await supabase
        .from('blogs')
        .select(`*`)
        .eq('status', 'published')
        .eq('admin_verified', true)
        .order('published_at', { ascending: false });

      if (error) throw error;

      // Enrich blogs with author names and interaction counts
      const enrichedBlogs = await Promise.all(
        (blogsData || []).map(async (blog) => {
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

  const fetchTags = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('tags')
        .eq('status', 'published')
        .eq('admin_verified', true);

      if (error) throw error;

      const tagSet = new Set<string>();
      data?.forEach(blog => {
        if (blog.tags) {
          blog.tags.forEach((tag: string) => tagSet.add(tag));
        }
      });

      setAllTags(Array.from(tagSet));
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const handleCreateBlog = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create a blog post",
        variant: "destructive",
      });
      return;
    }

    if (!title.trim() || !content.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both title and content",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      const { error } = await supabase
        .from('blogs')
        .insert({
          title: title.trim(),
          content: content.trim(),
          excerpt: excerpt.trim() || null,
          tags: tagsArray.length > 0 ? tagsArray : null,
          user_id: user.id,
          status: 'pending', // Requires admin verification
          admin_verified: false,
        });

      if (error) throw error;

      toast({
        title: "Blog submitted",
        description: "Your blog post has been submitted for admin review",
      });

      // Reset form
      setTitle('');
      setContent('');
      setExcerpt('');
      setTags('');
      setShowCreateForm(false);

      // Refresh blogs
      await fetchBlogs();
      await fetchTags();
    } catch (error) {
      console.error('Error creating blog:', error);
      toast({
        title: "Error",
        description: "Failed to create blog post",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
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
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like",
        variant: "destructive",
      });
    }
  };

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (blog.author_name && blog.author_name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTag = selectedTag === 'all' || 
                      (blog.tags && blog.tags.includes(selectedTag));
    
    return matchesSearch && matchesTag;
  });

  if (loading) {
    return <div className="text-center py-8">Loading blogs...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-kic-gray">Innovation Blog</h1>
          <p className="text-kic-gray/70">Share your insights and learn from the community</p>
        </div>
        {user && (
          <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Blog Post</DialogTitle>
                <p className="text-sm text-gray-600">
                  All blog posts require admin verification before being published.
                </p>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Blog title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <Textarea
                  placeholder="Brief excerpt (optional)"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={3}
                />
                <Textarea
                  placeholder="Write your blog content..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={10}
                />
                <Input
                  placeholder="Tags (comma-separated)"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleCreateBlog}
                    disabled={submitting}
                    className="flex-1"
                  >
                    {submitting ? 'Submitting...' : 'Submit for Review'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <Select value={selectedTag} onValueChange={setSelectedTag}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tags</SelectItem>
              {allTags.map((tag) => (
                <SelectItem key={tag} value={tag}>{tag}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Blog Posts */}
      <div className="grid gap-6">
        {filteredBlogs.map((blog) => (
          <Card key={blog.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                {blog.title}
                {blog.admin_verified && (
                  <CheckCircle className="h-5 w-5 text-green-500" title="Admin Verified" />
                )}
              </CardTitle>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {blog.author_name}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {blog.published_at ? new Date(blog.published_at).toLocaleDateString() : 'Draft'}
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {blog.view_count || 0} views
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {blog.excerpt && (
                <p className="text-gray-700 font-medium">{blog.excerpt}</p>
              )}
              
              <div className="prose max-w-none">
                <p className="text-gray-600">
                  {blog.content.length > 300 
                    ? `${blog.content.substring(0, 300)}...` 
                    : blog.content
                  }
                </p>
              </div>

              {blog.tags && blog.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-4 pt-2 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleLike(blog.id)}
                  className={`flex items-center gap-1 ${blog.is_liked ? 'text-red-500' : ''}`}
                >
                  <Heart className={`h-4 w-4 ${blog.is_liked ? 'fill-current' : ''}`} />
                  {blog.likes_count}
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  {blog.comments_count}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredBlogs.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-600">No blog posts match your search criteria.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BlogFeed;
