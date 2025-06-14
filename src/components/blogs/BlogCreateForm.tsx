
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import BlogAttachmentUpload from './BlogAttachmentUpload';

interface BlogAttachment {
  id: string;
  file_url: string;
  file_type: 'image' | 'video';
  file_name: string;
  file_size: number;
}

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
  const [attachments, setAttachments] = useState<BlogAttachment[]>([]);

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
      
      // Create the blog post
      const { data: blogData, error: blogError } = await supabase
        .from('blogs')
        .insert({
          title: title.trim(),
          content: content.trim(),
          excerpt: excerpt.trim() || null,
          tags: tagsArray.length > 0 ? tagsArray : null,
          user_id: user.id,
          status: 'pending',
          admin_verified: false,
          featured_image: attachments.find(a => a.file_type === 'image')?.file_url || null,
          video_url: attachments.find(a => a.file_type === 'video')?.file_url || null,
        })
        .select()
        .single();

      if (blogError) throw blogError;

      // Create attachment records
      if (attachments.length > 0 && blogData) {
        const attachmentRecords = attachments.map(attachment => ({
          blog_id: blogData.id,
          file_url: attachment.file_url,
          file_type: attachment.file_type,
          file_size: attachment.file_size,
          file_name: attachment.file_name,
        }));

        const { error: attachmentError } = await supabase
          .from('blog_attachments')
          .insert(attachmentRecords);

        if (attachmentError) {
          console.error('Error creating attachment records:', attachmentError);
        }
      }

      toast({
        title: "Blog submitted",
        description: "Your blog post has been submitted for admin review",
      });

      // Reset form
      setTitle('');
      setContent('');
      setExcerpt('');
      setTags('');
      setAttachments([]);
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
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
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
          
          <BlogAttachmentUpload
            attachments={attachments}
            onAttachmentsChange={setAttachments}
            disabled={submitting}
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
