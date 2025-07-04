
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, ExternalLink, UserMinus, Settings } from 'lucide-react';
import type { CommunityGroup } from './useCommunityData';

interface JoinedCommunityCardProps {
  community: CommunityGroup;
  visitingCommunity: string | null;
  userMembershipCount: number;
  onVisit: (communityId: string) => void;
  onToggleMembership: (communityId: string, isJoining: boolean) => void;
}

const JoinedCommunityCard = ({
  community,
  visitingCommunity,
  userMembershipCount,
  onVisit,
  onToggleMembership
}: JoinedCommunityCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-kic-green-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{community.name}</h3>
              <Badge variant="secondary" className="bg-kic-green-100 text-kic-green-700">
                Joined
              </Badge>
              {community.is_admin && (
                <Badge variant="default" className="bg-blue-100 text-blue-700">
                  <Settings className="w-3 h-3 mr-1" />
                  Admin
                </Badge>
              )}
            </div>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{community.description}</p>
            
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{community.member_count} members</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{community.meeting_schedule}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={() => onVisit(community.id)}
            disabled={visitingCommunity === community.id}
            className="flex-1 bg-kic-green-500 hover:bg-kic-green-600"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            {visitingCommunity === community.id ? 'Opening...' : 'Visit Dashboard'}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => onToggleMembership(community.id, false)}
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            <UserMinus className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default JoinedCommunityCard;
