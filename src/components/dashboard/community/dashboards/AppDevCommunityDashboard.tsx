
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 w-full">
      <div className="container mx-auto p-4 sm:p-6 w-full max-w-none">
        {/* Community Header */}
        <Card className="mb-4 sm:mb-6 border-purple-200 bg-white/80 backdrop-blur-sm w-full">
          <CardHeader className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
                <div className="p-3 rounded-full bg-purple-100 flex-shrink-0">
                  <Smartphone className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
                </div>
                <div className="w-full sm:w-auto">
                  <CardTitle className="text-xl sm:text-2xl text-purple-900 break-words">{community.name}</CardTitle>
                  <CardDescription className="text-purple-700 text-sm sm:text-base break-words">{community.description}</CardDescription>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-start sm:justify-end">
                <Badge variant="secondary" className="bg-purple-100 text-purple-800 text-xs">
                  App Development
                </Badge>
                <Badge variant="outline" className="border-purple-200 text-xs">
                  {community.member_count || 0} Members
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* App Dev-specific Features */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <Card className="border-purple-200 bg-white/60 backdrop-blur-sm">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                <Smartphone className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 flex-shrink-0" />
                <div className="text-center sm:text-left">
                  <p className="text-xs sm:text-sm text-purple-700">Mobile Apps</p>
                  <p className="text-lg sm:text-lg font-semibold text-purple-900">18</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-white/60 backdrop-blur-sm">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                <Download className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 flex-shrink-0" />
                <div className="text-center sm:text-left">
                  <p className="text-xs sm:text-sm text-purple-700">Total Downloads</p>
                  <p className="text-lg sm:text-lg font-semibold text-purple-900">2.4K</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-white/60 backdrop-blur-sm">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                <Star className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600 flex-shrink-0" />
                <div className="text-center sm:text-left">
                  <p className="text-xs sm:text-sm text-purple-700">Avg Rating</p>
                  <p className="text-lg sm:text-lg font-semibold text-purple-900">4.6</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-white/60 backdrop-blur-sm">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                <Tablet className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 flex-shrink-0" />
                <div className="text-center sm:text-left">
                  <p className="text-xs sm:text-sm text-purple-700">Cross-Platform</p>
                  <p className="text-lg sm:text-lg font-semibold text-purple-900">6</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Community Tabs */}
        <Card className="border-purple-200 bg-white/80 backdrop-blur-sm w-full">
          <CardContent className="p-4 sm:p-6 w-full">
            <CommunityDashboardTabs communityId={community.id} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AppDevCommunityDashboard;
