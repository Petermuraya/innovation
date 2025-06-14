
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Code, Globe, Palette, Database } from 'lucide-react';
import CommunityDashboardTabs from '../CommunityDashboardTabs';

interface Community {
  id: string;
  name: string;
  description: string;
  member_count?: number;
  is_member: boolean;
}

interface WebDevCommunityDashboardProps {
  community: Community;
}

const WebDevCommunityDashboard = ({ community }: WebDevCommunityDashboardProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="container mx-auto p-6">
        {/* Community Header */}
        <Card className="mb-6 border-green-200 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-green-100">
                  <Globe className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-green-900">{community.name}</CardTitle>
                  <CardDescription className="text-green-700">{community.description}</CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Web Development
                </Badge>
                <Badge variant="outline" className="border-green-200">
                  {community.member_count || 0} Members
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Web Dev-specific Features */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-green-200 bg-white/60 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Code className="h-6 w-6 text-green-600" />
                <div>
                  <p className="text-sm text-green-700">Active Repos</p>
                  <p className="text-lg font-semibold text-green-900">15</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-white/60 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Palette className="h-6 w-6 text-purple-600" />
                <div>
                  <p className="text-sm text-green-700">Design Systems</p>
                  <p className="text-lg font-semibold text-green-900">4</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-white/60 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Database className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="text-sm text-green-700">APIs Built</p>
                  <p className="text-lg font-semibold text-green-900">12</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-white/60 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Globe className="h-6 w-6 text-blue-500" />
                <div>
                  <p className="text-sm text-green-700">Live Sites</p>
                  <p className="text-lg font-semibold text-green-900">9</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Community Tabs */}
        <Card className="border-green-200 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <CommunityDashboardTabs communityId={community.id} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WebDevCommunityDashboard;
