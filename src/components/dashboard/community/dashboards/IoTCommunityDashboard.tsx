
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Cpu, Wifi, Database, Code } from 'lucide-react';
import CommunityDashboardTabs from '../CommunityDashboardTabs';

interface Community {
  id: string;
  name: string;
  description: string;
  member_count?: number;
  is_member: boolean;
}

interface IoTCommunityDashboardProps {
  community: Community;
}

const IoTCommunityDashboard = ({ community }: IoTCommunityDashboardProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto p-6">
        {/* Community Header */}
        <Card className="mb-6 border-blue-200 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-blue-100">
                  <Cpu className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-blue-900">{community.name}</CardTitle>
                  <CardDescription className="text-blue-700">{community.description}</CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  IoT Focus
                </Badge>
                <Badge variant="outline" className="border-blue-200">
                  {community.member_count || 0} Members
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* IoT-specific Features */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-blue-200 bg-white/60 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Wifi className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="text-sm text-blue-700">Connected Devices</p>
                  <p className="text-lg font-semibold text-blue-900">24</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-white/60 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Database className="h-6 w-6 text-green-600" />
                <div>
                  <p className="text-sm text-blue-700">Data Points</p>
                  <p className="text-lg font-semibold text-blue-900">1.2K</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-white/60 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Code className="h-6 w-6 text-purple-600" />
                <div>
                  <p className="text-sm text-blue-700">Active Projects</p>
                  <p className="text-lg font-semibold text-blue-900">8</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-white/60 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Cpu className="h-6 w-6 text-red-600" />
                <div>
                  <p className="text-sm text-blue-700">Workshops</p>
                  <p className="text-lg font-semibold text-blue-900">3</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Community Tabs */}
        <Card className="border-blue-200 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <CommunityDashboardTabs communityId={community.id} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IoTCommunityDashboard;
