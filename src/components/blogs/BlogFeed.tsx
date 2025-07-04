
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import BlogPost from './BlogPost';
import BlogFilters from './BlogFilters';
import { useBlogData } from './useBlogData';

interface BlogItem {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  featured_image?: string;
  video_url?: string;
  tags?: string[];
  status: string;
  admin_verified: boolean;
  view_count: number;
  created_at: string;
  published_at?: string;
  user_id: string;
  author_name?: string;
  likes_count?: number;
  comments_count?: number;
  user_has_liked?: boolean;
}

const BlogFeed = () => {
  const { blogs, loading, availableTags, likeBlog } = useBlogData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');

  // Only show published and admin-verified blogs
  const publishedBlogs = Array.isArray(blogs) ? blogs.filter((blog: BlogItem) => {
    return blog && blog.status === 'published' && blog.admin_verified === true;
  }) : [];

  // Filter published blogs
  const filteredBlogs = publishedBlogs.filter((blog: BlogItem) => {
    const titleMatch = blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const contentMatch = blog.content?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const authorMatch = blog.author_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const matchesSearch = titleMatch || contentMatch || authorMatch;
    
    const matchesTag = selectedTag === 'all' || 
                      (blog.tags && Array.isArray(blog.tags) && blog.tags.includes(selectedTag));
    
    return matchesSearch && matchesTag;
  });

  if (loading) {
    return <div className="text-center py-8">Loading blogs...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header - Read-only, no create button */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-kic-gray">Innovation Blog</h1>
        <p className="text-kic-gray/70">Discover insights and stories from our community</p>
      </div>

      {/* Filters */}
      <BlogFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
        allTags={availableTags}
      />

      {/* Blog Posts - Read-only */}
      <div className="grid gap-6">
        {filteredBlogs.map((blog: BlogItem) => (
          <BlogPost
            key={blog.id}
            blog={{
              ...blog,
              excerpt: blog.excerpt || '',
              featured_image: blog.featured_image || null,
              video_url: blog.video_url || null,
              tags: blog.tags || null,
              published_at: blog.published_at || null,
              is_liked: blog.user_has_liked || false
            }}
            onToggleLike={likeBlog}
          />
        ))}

        {filteredBlogs.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-600">No published blog posts available.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BlogFeed;
