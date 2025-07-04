
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Trash2, Edit } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  user_name?: string;
}

interface BlogCommentsProps {
  blogId: string;
  commentsCount?: number;
  onCommentsUpdate?: (count: number) => void;
  onCommentsChange?: React.Dispatch<React.SetStateAction<number>>;
}

const BlogComments = ({ blogId, commentsCount = 0, onCommentsUpdate, onCommentsChange }: BlogCommentsProps) => {
  const { member } = useAuth();
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingComments, setLoadingComments] = useState(true);

  useEffect(() => {
    fetchComments();
  }, [blogId]);

  const fetchComments = async () => {
    try {
      setLoadingComments(true);
      const { data, error } = await supabase
        .from('blog_comments')
        .select('*')
        .eq('blog_id', blogId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setComments(data || []);
      const count = data?.length || 0;
      onCommentsUpdate?.(count);
      onCommentsChange?.(count);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast({
        title: "Error",
        description: "Failed to load comments",
        variant: "destructive",
      });
    } finally {
      setLoadingComments(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!member) {
      toast({
        title: "Authentication required",
        description: "Please log in to comment",
        variant: "destructive",
      });
      return;
    }

    if (!newComment.trim()) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from('blog_comments')
        .insert({
          blog_id: blogId,
          user_id: member.id,
          content: newComment.trim(),
        });

      if (error) throw error;

      setNewComment('');
      await fetchComments();
      
      toast({
        title: "Comment posted",
        description: "Your comment has been added successfully",
      });
    } catch (error) {
      console.error('Error posting comment:', error);
      toast({
        title: "Error",
        description: "Failed to post comment",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!member) return;

    try {
      const { error } = await supabase
        .from('blog_comments')
        .delete()
        .eq('id', commentId)
        .eq('user_id', member.id);

      if (error) throw error;

      await fetchComments();
      
      toast({
        title: "Comment deleted",
        description: "Your comment has been removed",
      });
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast({
        title: "Error",
        description: "Failed to delete comment",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Comments {comments.length > 0 && <Badge variant="secondary">{comments.length}</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Comment Form */}
        {member ? (
          <form onSubmit={handleSubmitComment} className="space-y-3">
            <Textarea
              placeholder="Share your thoughts..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={loading}
              rows={3}
            />
            <Button type="submit" disabled={loading || !newComment.trim()}>
              {loading ? 'Posting...' : 'Post Comment'}
            </Button>
          </form>
        ) : (
          <p className="text-muted-foreground text-center py-4">
            Please log in to leave a comment
          </p>
        )}

        {/* Comments List */}
        <div className="space-y-4">
          {loadingComments ? (
            <p className="text-center text-muted-foreground">Loading comments...</p>
          ) : comments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No comments yet. Be the first to share your thoughts!
            </p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="bg-muted/30 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-sm text-muted-foreground">
                    {comment.user_name || 'Anonymous'} • {new Date(comment.created_at).toLocaleDateString()}
                  </div>
                  {member?.id === comment.user_id && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <p className="text-sm">{comment.content}</p>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BlogComments;
