
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageSquare } from 'lucide-react';
import { useProjectInteractions } from '@/hooks/useProjectInteractions';
import { useAuth } from '@/contexts/AuthContext';

interface ProjectInteractionsProps {
  projectId: string;
}

const ProjectInteractions = ({ projectId }: ProjectInteractionsProps) => {
  const { user } = useAuth();
  const { likes, comments, hasLiked, loading, toggleLike, addComment, likesCount } = useProjectInteractions(projectId);
  const [newComment, setNewComment] = useState('');

  const handleAddComment = async () => {
    if (newComment.trim()) {
      await addComment(newComment);
      setNewComment('');
    }
  };

  if (loading) {
    return <div>Loading interactions...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Like/Comment Stats */}
      <div className="flex items-center gap-4">
        <Button
          variant={hasLiked ? "default" : "outline"}
          onClick={toggleLike}
          className="flex items-center gap-2"
        >
          <Heart className={`h-4 w-4 ${hasLiked ? 'fill-current' : ''}`} />
          {likesCount} {likesCount === 1 ? 'Like' : 'Likes'}
        </Button>
        <Badge variant="secondary" className="flex items-center gap-1">
          <MessageSquare className="h-4 w-4" />
          {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
        </Badge>
      </div>

      {/* Add Comment */}
      {user && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Add a Comment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Share your thoughts about this project..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
            />
            <Button onClick={handleAddComment} disabled={!newComment.trim()}>
              Post Comment
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Comments List */}
      {comments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Comments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="border-b pb-4 last:border-b-0">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-sm">{comment.members?.name || 'Anonymous'}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700">{comment.content}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProjectInteractions;
