
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Heart, MessageCircle, Clock, CheckCircle, XCircle } from 'lucide-react';

interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  tags: string[] | null;
  status: string;
  admin_verified: boolean;
  published_at: string | null;
  created_at: string;
  view_count: number;
  likes_count: number;
  comments_count: number;
}

interface BlogListProps {
  blogs: Blog[];
}

const BlogList = ({ blogs }: BlogListProps) => {
  const getStatusIcon = (blog: Blog) => {
    if (blog.status === 'published' && blog.admin_verified) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    } else if (blog.status === 'rejected') {
      return <XCircle className="w-4 h-4 text-red-500" />;
    } else {
      return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusText = (blog: Blog) => {
    if (blog.status === 'published' && blog.admin_verified) {
      return 'Published';
    } else if (blog.status === 'rejected') {
      return 'Rejected';
    } else {
      return 'Pending Review';
    }
  };

  const getStatusColor = (blog: Blog) => {
    if (blog.status === 'published' && blog.admin_verified) {
      return 'default';
    } else if (blog.status === 'rejected') {
      return 'destructive';
    } else {
      return 'secondary';
    }
  };

  return (
    <div className="grid gap-4">
      {blogs.map((blog) => (
        <Card key={blog.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle className="flex items-center gap-2">
                {blog.title}
                {getStatusIcon(blog)}
              </CardTitle>
              <Badge variant={getStatusColor(blog) as any}>
                {getStatusText(blog)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {blog.excerpt && (
              <p className="text-gray-600 font-medium">{blog.excerpt}</p>
            )}
            
            <p className="text-gray-600 line-clamp-2">
              {blog.content.length > 150 
                ? `${blog.content.substring(0, 150)}...` 
                : blog.content
              }
            </p>

            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {blog.view_count || 0}
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  {blog.likes_count}
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  {blog.comments_count}
                </div>
              </div>
              
              <div className="text-sm text-gray-500">
                {blog.published_at 
                  ? `Published: ${new Date(blog.published_at).toLocaleDateString()}`
                  : `Created: ${new Date(blog.created_at).toLocaleDateString()}`
                }
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BlogList;
