
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Send, Plus } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import BlogAttachmentUpload from '@/components/blogs/BlogAttachmentUpload';

interface BlogAttachment {
  id: string;
  file_url: string;
  file_type: 'image' | 'video';
  file_name: string;
  file_size: number;
}

const BlogCreator = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [attachments, setAttachments] = useState<BlogAttachment[]>([]);

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create blog posts",
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

    try {
      setLoading(true);

      // Create the blog post
      const { data: blogData, error: blogError } = await supabase
        .from('blogs')
        .insert({
          title: title.trim(),
          content: content.trim(),
          excerpt: excerpt.trim() || null,
          tags: tags.length > 0 ? tags : null,
          user_id: user.id,
          status: 'pending',
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
      setExcerpt('');
      setContent('');
      setTags([]);
      setTagInput('');
      setAttachments([]);
    } catch (error) {
      console.error('Error creating blog:', error);
      toast({
        title: "Error",
        description: "Failed to submit blog post",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Blog Post</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            All blog posts require admin verification before being published to the community.
          </AlertDescription>
        </Alert>

        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your blog post title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Excerpt (Optional)</label>
          <Textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Brief description of your blog post"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Content</label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your blog post content here..."
            rows={12}
          />
        </div>

        <BlogAttachmentUpload
          attachments={attachments}
          onAttachmentsChange={setAttachments}
          disabled={loading}
        />

        <div>
          <label className="block text-sm font-medium mb-2">Tags</label>
          <div className="flex gap-2 mb-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Add a tag"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            />
            <Button onClick={addTag} variant="outline" size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="cursor-pointer"
                onClick={() => removeTag(tag)}
              >
                {tag} ×
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={loading}>
            <Send className="w-4 h-4 mr-2" />
            {loading ? 'Submitting...' : 'Submit for Review'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlogCreator;
