
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Users, TrendingUp, Activity } from 'lucide-react';

const AdminAnalytics = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            System Analytics
          </CardTitle>
          <CardDescription>
            View system-wide analytics and insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">Total Members</span>
              </div>
              <p className="text-2xl font-bold text-blue-900 mt-2">-</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-600">Active Projects</span>
              </div>
              <p className="text-2xl font-bold text-green-900 mt-2">-</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-600">Events This Month</span>
              </div>
              <p className="text-2xl font-bold text-purple-900 mt-2">-</p>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-orange-600" />
                <span className="text-sm font-medium text-orange-600">Total Revenue</span>
              </div>
              <p className="text-2xl font-bold text-orange-900 mt-2">KSh -</p>
            </div>
          </div>
          
          <div className="mt-8 text-center py-8">
            <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">Analytics Dashboard</h3>
            <p className="text-muted-foreground">
              Detailed analytics and reporting features will be available here.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalytics;
