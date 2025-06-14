
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface BlogHeaderProps {
  onCreateClick: () => void;
  onBackClick: () => void;
  showCreateForm: boolean;
}

const BlogHeader = ({ onCreateClick, onBackClick, showCreateForm }: BlogHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-semibold">
        {showCreateForm ? 'Create New Blog Post' : 'My Blog Posts'}
      </h2>
      {showCreateForm ? (
        <Button variant="outline" onClick={onBackClick}>
          Back to Blogs
        </Button>
      ) : (
        <Button onClick={onCreateClick}>
          <Plus className="w-4 h-4 mr-2" />
          Write Blog Post
        </Button>
      )}
    </div>
  );
};

export default BlogHeader;
