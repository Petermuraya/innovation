
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 w-full">
      <div className="container mx-auto p-4 sm:p-6 w-full max-w-none">
        {/* Community Header */}
        <Card className="mb-4 sm:mb-6 border-green-200 bg-white/80 backdrop-blur-sm w-full">
          <CardHeader className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
                <div className="p-3 rounded-full bg-green-100 flex-shrink-0">
                  <Globe className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
                </div>
                <div className="w-full sm:w-auto">
                  <CardTitle className="text-xl sm:text-2xl text-green-900 break-words">{community.name}</CardTitle>
                  <CardDescription className="text-green-700 text-sm sm:text-base break-words">{community.description}</CardDescription>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-start sm:justify-end">
                <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                  Web Development
                </Badge>
                <Badge variant="outline" className="border-green-200 text-xs">
                  {community.member_count || 0} Members
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Web Dev-specific Features */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <Card className="border-green-200 bg-white/60 backdrop-blur-sm">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                <Code className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 flex-shrink-0" />
                <div className="text-center sm:text-left">
                  <p className="text-xs sm:text-sm text-green-700">Active Repos</p>
                  <p className="text-lg sm:text-lg font-semibold text-green-900">15</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-white/60 backdrop-blur-sm">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                <Palette className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 flex-shrink-0" />
                <div className="text-center sm:text-left">
                  <p className="text-xs sm:text-sm text-green-700">Design Systems</p>
                  <p className="text-lg sm:text-lg font-semibold text-green-900">4</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-white/60 backdrop-blur-sm">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                <Database className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 flex-shrink-0" />
                <div className="text-center sm:text-left">
                  <p className="text-xs sm:text-sm text-green-700">APIs Built</p>
                  <p className="text-lg sm:text-lg font-semibold text-green-900">12</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-white/60 backdrop-blur-sm">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                <Globe className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500 flex-shrink-0" />
                <div className="text-center sm:text-left">
                  <p className="text-xs sm:text-sm text-green-700">Live Sites</p>
                  <p className="text-lg sm:text-lg font-semibold text-green-900">9</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Community Tabs */}
        <Card className="border-green-200 bg-white/80 backdrop-blur-sm w-full">
          <CardContent className="p-4 sm:p-6 w-full">
            <CommunityDashboardTabs communityId={community.id} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WebDevCommunityDashboard;
