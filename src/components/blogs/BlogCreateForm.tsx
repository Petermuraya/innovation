
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface BlogCreateFormProps {
  onBlogCreated: () => void;
}

const BlogCreateForm = ({ onBlogCreated }: BlogCreateFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [tags, setTags] = useState('');

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
      onBlogCreated();
    } catch (error) {
      console.error('BlogCreateForm: Error creating blog:', error);
      toast({
        title: "Error",
        description: "Failed to create blog post",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
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
  );
};

export default BlogCreateForm;
