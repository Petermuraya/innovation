
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Database, Brain, TrendingUp } from 'lucide-react';
import CommunityDashboardTabs from '../CommunityDashboardTabs';

interface Community {
  id: string;
  name: string;
  description: string;
  member_count?: number;
  is_member: boolean;
}

interface DataScienceCommunityDashboardProps {
  community: Community;
}

const DataScienceCommunityDashboard = ({ community }: DataScienceCommunityDashboardProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
      <div className="container mx-auto p-6">
        {/* Community Header */}
        <Card className="mb-6 border-indigo-200 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-indigo-100">
                  <BarChart3 className="h-8 w-8 text-indigo-600" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-indigo-900">{community.name}</CardTitle>
                  <CardDescription className="text-indigo-700">{community.description}</CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">
                  Data Science
                </Badge>
                <Badge variant="outline" className="border-indigo-200">
                  {community.member_count || 0} Members
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Data Science-specific Features */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-indigo-200 bg-white/60 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Database className="h-6 w-6 text-indigo-600" />
                <div>
                  <p className="text-sm text-indigo-700">Datasets</p>
                  <p className="text-lg font-semibold text-indigo-900">89</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-indigo-200 bg-white/60 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Brain className="h-6 w-6 text-purple-600" />
                <div>
                  <p className="text-sm text-indigo-700">ML Models</p>
                  <p className="text-lg font-semibold text-indigo-900">23</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-indigo-200 bg-white/60 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-6 w-6 text-green-600" />
                <div>
                  <p className="text-sm text-indigo-700">Visualizations</p>
                  <p className="text-lg font-semibold text-indigo-900">156</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-indigo-200 bg-white/60 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="text-sm text-indigo-700">Accuracy Rate</p>
                  <p className="text-lg font-semibold text-indigo-900">94.2%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Community Tabs */}
        <Card className="border-indigo-200 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <CommunityDashboardTabs communityId={community.id} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DataScienceCommunityDashboard;
