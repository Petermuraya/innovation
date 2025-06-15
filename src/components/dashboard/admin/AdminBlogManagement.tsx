
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Eye, MessageSquare, ThumbsUp } from 'lucide-react';

const AdminBlogManagement = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Blog Management
          </CardTitle>
          <CardDescription>
            Moderate and manage blog posts and content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">Total Blogs</span>
              </div>
              <p className="text-2xl font-bold text-blue-900 mt-2">-</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-600">Total Views</span>
              </div>
              <p className="text-2xl font-bold text-green-900 mt-2">-</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-600">Comments</span>
              </div>
              <p className="text-2xl font-bold text-purple-900 mt-2">-</p>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <ThumbsUp className="h-5 w-5 text-orange-600" />
                <span className="text-sm font-medium text-orange-600">Likes</span>
              </div>
              <p className="text-2xl font-bold text-orange-900 mt-2">-</p>
            </div>
          </div>
          
          <div className="text-center py-8">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">Blog Management</h3>
            <p className="text-muted-foreground">
              Blog moderation and management features will be available here.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBlogManagement;
