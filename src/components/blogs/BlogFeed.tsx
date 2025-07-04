
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import BlogPost from './BlogPost';
import BlogCreateForm from './BlogCreateForm';
import BlogFilters from './BlogFilters';
import { useBlogData } from './useBlogData';

interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
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
  const { blogs, loading, availableTags, likeBlog, fetchBlogs } = useBlogData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');

  // Safely filter blogs with defensive checks
  const filteredBlogs = Array.isArray(blogs) ? blogs.filter((blog: Blog) => {
    if (!blog) return false;
    
    const titleMatch = blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const contentMatch = blog.content?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const authorMatch = blog.author_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const matchesSearch = titleMatch || contentMatch || authorMatch;
    
    const matchesTag = selectedTag === 'all' || 
                      (blog.tags && Array.isArray(blog.tags) && blog.tags.includes(selectedTag));
    
    return matchesSearch && matchesTag;
  }) : [];

  if (loading) {
    return <div className="text-center py-8">Loading blogs...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-kic-gray">Innovation Blog</h1>
          <p className="text-kic-gray/70">Share your insights and learn from the community</p>
        </div>
        <BlogCreateForm />
      </div>

      {/* Filters */}
      <BlogFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
        allTags={availableTags}
      />

      {/* Blog Posts */}
      <div className="grid gap-6">
        {filteredBlogs.map((blog: Blog) => (
          <BlogPost
            key={blog.id}
            blog={blog}
            onToggleLike={likeBlog}
          />
        ))}

        {filteredBlogs.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-600">No blog posts match your search criteria.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BlogFeed;
