
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BlogCreator from './BlogCreator';
import BlogHeader from './BlogHeader';
import BlogTabs from './BlogTabs';
import { useBlogManagement } from './hooks/useBlogManagement';

const DashboardBlogging = () => {
  const { blogs, loading, refetchBlogs } = useBlogManagement();
  const [showCreator, setShowCreator] = useState(false);

  if (loading) {
    return <div className="text-center py-8">Loading your blogs...</div>;
  }

  if (showCreator) {
    return (
      <div className="space-y-4">
        <BlogHeader 
          showCreateForm={true}
          onCreateClick={() => setShowCreator(true)}
          onBackClick={() => setShowCreator(false)}
        />
        <BlogCreator />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <BlogHeader 
        showCreateForm={false}
        onCreateClick={() => setShowCreator(true)}
        onBackClick={() => setShowCreator(false)}
      />

      {blogs.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-600">You haven't written any blog posts yet.</p>
            <Button className="mt-4" onClick={() => setShowCreator(true)}>
              Write Your First Post
            </Button>
          </CardContent>
        </Card>
      ) : (
        <BlogTabs blogs={blogs} />
      )}
    </div>
  );
};

export default DashboardBlogging;
