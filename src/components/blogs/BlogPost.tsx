
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Eye, Calendar, User, CheckCircle, Image, Video } from 'lucide-react';
import BlogComments from './BlogComments';

interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  featured_image: string | null;
  video_url: string | null;
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

interface BlogPostProps {
  blog: Blog;
  onToggleLike: (blogId: string) => void;
  showFull?: boolean;
}

const BlogPost = ({ blog, onToggleLike, showFull = false }: BlogPostProps) => {
  const [showComments, setShowComments] = useState(false);
  const [currentCommentsCount, setCurrentCommentsCount] = useState(blog.comments_count || 0);

  const displayContent = showFull || !blog.content || blog.content.length <= 300 
    ? blog.content 
    : `${blog.content.substring(0, 300)}...`;

  return (
    <div className="space-y-4">
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            {blog.title}
            {blog.admin_verified && (
              <span title="Admin Verified">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </span>
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

          {/* Featured image */}
          {blog.featured_image && (
            <div className="relative">
              <img 
                src={blog.featured_image} 
                alt={blog.title}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Video */}
          {blog.video_url && (
            <div className="relative">
              <video 
                src={blog.video_url} 
                controls
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}
          
          <div className="prose max-w-none">
            <p className="text-gray-600 whitespace-pre-wrap">
              {displayContent || ''}
            </p>
          </div>

          {blog.tags && Array.isArray(blog.tags) && blog.tags.length > 0 && (
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
              onClick={() => onToggleLike(blog.id)}
              className={`flex items-center gap-1 ${blog.is_liked ? 'text-red-500' : ''}`}
            >
              <Heart className={`h-4 w-4 ${blog.is_liked ? 'fill-current' : ''}`} />
              {blog.likes_count || 0}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={() => setShowComments(!showComments)}
            >
              <MessageCircle className="h-4 w-4" />
              {currentCommentsCount}
            </Button>
          </div>
        </CardContent>
      </Card>

      {showComments && (
        <BlogComments
          blogId={blog.id}
          commentsCount={currentCommentsCount}
          onCommentsChange={setCurrentCommentsCount}
        />
      )}
    </div>
  );
};

export default BlogPost;
