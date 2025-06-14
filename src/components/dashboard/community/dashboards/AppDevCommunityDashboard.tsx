
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Tablet, Download, Star } from 'lucide-react';
import CommunityDashboardTabs from '../CommunityDashboardTabs';

interface Community {
  id: string;
  name: string;
  description: string;
  member_count?: number;
  is_member: boolean;
}

interface AppDevCommunityDashboardProps {
  community: Community;
}

const AppDevCommunityDashboard = ({ community }: AppDevCommunityDashboardProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <div className="container mx-auto p-6">
        {/* Community Header */}
        <Card className="mb-6 border-purple-200 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-purple-100">
                  <Smartphone className="h-8 w-8 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-purple-900">{community.name}</CardTitle>
                  <CardDescription className="text-purple-700">{community.description}</CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  App Development
                </Badge>
                <Badge variant="outline" className="border-purple-200">
                  {community.member_count || 0} Members
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* App Dev-specific Features */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-purple-200 bg-white/60 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Smartphone className="h-6 w-6 text-purple-600" />
                <div>
                  <p className="text-sm text-purple-700">Mobile Apps</p>
                  <p className="text-lg font-semibold text-purple-900">18</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-white/60 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Download className="h-6 w-6 text-green-600" />
                <div>
                  <p className="text-sm text-purple-700">Total Downloads</p>
                  <p className="text-lg font-semibold text-purple-900">2.4K</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-white/60 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Star className="h-6 w-6 text-yellow-600" />
                <div>
                  <p className="text-sm text-purple-700">Avg Rating</p>
                  <p className="text-lg font-semibold text-purple-900">4.6</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-white/60 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Tablet className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="text-sm text-purple-700">Cross-Platform</p>
                  <p className="text-lg font-semibold text-purple-900">6</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Community Tabs */}
        <Card className="border-purple-200 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <CommunityDashboardTabs communityId={community.id} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AppDevCommunityDashboard;
