
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Clock, CheckCircle, XCircle } from 'lucide-react';

const AdminSubmissionsManagement = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Submissions Management
          </CardTitle>
          <CardDescription>
            Review and moderate user submissions and content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">Total Submissions</span>
              </div>
              <p className="text-2xl font-bold text-blue-900 mt-2">-</p>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-600">Pending Review</span>
              </div>
              <p className="text-2xl font-bold text-yellow-900 mt-2">-</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-600">Approved</span>
              </div>
              <p className="text-2xl font-bold text-green-900 mt-2">-</p>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-600" />
                <span className="text-sm font-medium text-red-600">Rejected</span>
              </div>
              <p className="text-2xl font-bold text-red-900 mt-2">-</p>
            </div>
          </div>
          
          <div className="text-center py-8">
            <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">Submissions Management</h3>
            <p className="text-muted-foreground">
              Submission review and moderation features will be available here.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSubmissionsManagement;
