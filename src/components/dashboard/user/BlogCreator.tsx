import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const BlogCreator = () => {
  const { member } = useAuth();
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!member) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to create a blog post",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('blogs')
        .insert({
          title: title,
          content: content,
          user_id: member.id,
          status: 'draft',
          admin_verified: false,
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Blog post created successfully!",
      });

      setTitle('');
      setContent('');
    } catch (error) {
      console.error("Error creating blog post:", error);
      toast({
        title: "Error",
        description: "Failed to create blog post",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Blog Post</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Blog Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <Textarea
              placeholder="Blog Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              required
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Blog Post'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BlogCreator;
