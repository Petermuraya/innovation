
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Lock, AlertTriangle, Eye } from 'lucide-react';
import CommunityDashboardTabs from '../CommunityDashboardTabs';

interface Community {
  id: string;
  name: string;
  description: string;
  member_count?: number;
  is_member: boolean;
}

interface CybersecurityCommunityDashboardProps {
  community: Community;
}

const CybersecurityCommunityDashboard = ({ community }: CybersecurityCommunityDashboardProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100">
      <div className="container mx-auto p-6">
        {/* Community Header */}
        <Card className="mb-6 border-red-200 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-red-100">
                  <Shield className="h-8 w-8 text-red-600" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-red-900">{community.name}</CardTitle>
                  <CardDescription className="text-red-700">{community.description}</CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-red-100 text-red-800">
                  Cybersecurity
                </Badge>
                <Badge variant="outline" className="border-red-200">
                  {community.member_count || 0} Members
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Cybersecurity-specific Features */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-red-200 bg-white/60 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-red-600" />
                <div>
                  <p className="text-sm text-red-700">Security Projects</p>
                  <p className="text-lg font-semibold text-red-900">12</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-white/60 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
                <div>
                  <p className="text-sm text-red-700">Vulnerabilities Found</p>
                  <p className="text-lg font-semibold text-red-900">34</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-white/60 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Lock className="h-6 w-6 text-green-600" />
                <div>
                  <p className="text-sm text-red-700">Patches Applied</p>
                  <p className="text-lg font-semibold text-red-900">28</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-white/60 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Eye className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="text-sm text-red-700">Security Audits</p>
                  <p className="text-lg font-semibold text-red-900">7</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Community Tabs */}
        <Card className="border-red-200 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <CommunityDashboardTabs communityId={community.id} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CybersecurityCommunityDashboard;
