
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import BlogList from './BlogList';

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

interface BlogTabsProps {
  blogs: Blog[];
}

const BlogTabs = ({ blogs }: BlogTabsProps) => {
  const pendingBlogs = blogs.filter(b => b.status === 'pending' || !b.admin_verified);
  const publishedBlogs = blogs.filter(b => b.status === 'published' && b.admin_verified);
  const rejectedBlogs = blogs.filter(b => b.status === 'rejected');

  return (
    <Tabs defaultValue="all" className="space-y-4">
      <TabsList>
        <TabsTrigger value="all">All ({blogs.length})</TabsTrigger>
        <TabsTrigger value="pending">
          Pending ({pendingBlogs.length})
        </TabsTrigger>
        <TabsTrigger value="published">
          Published ({publishedBlogs.length})
        </TabsTrigger>
        {rejectedBlogs.length > 0 && (
          <TabsTrigger value="rejected">
            Rejected ({rejectedBlogs.length})
          </TabsTrigger>
        )}
      </TabsList>

      <TabsContent value="all">
        <BlogList blogs={blogs} />
      </TabsContent>

      <TabsContent value="pending">
        {pendingBlogs.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-600">No pending blog posts.</p>
            </CardContent>
          </Card>
        ) : (
          <BlogList blogs={pendingBlogs} />
        )}
      </TabsContent>

      <TabsContent value="published">
        {publishedBlogs.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-600">No published blog posts yet.</p>
            </CardContent>
          </Card>
        ) : (
          <BlogList blogs={publishedBlogs} />
        )}
      </TabsContent>

      {rejectedBlogs.length > 0 && (
        <TabsContent value="rejected">
          <BlogList blogs={rejectedBlogs} />
        </TabsContent>
      )}
    </Tabs>
  );
};

export default BlogTabs;
