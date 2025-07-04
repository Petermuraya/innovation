
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, UserPlus } from 'lucide-react';
import type { CommunityGroup } from './useCommunityData';

interface AvailableCommunityCardProps {
  community: CommunityGroup;
  userMembershipCount: number;
  onToggleMembership: (communityId: string, isJoining: boolean) => void;
}

const AvailableCommunityCard = ({
  community,
  userMembershipCount,
  onToggleMembership
}: AvailableCommunityCardProps) => {
  const canJoin = userMembershipCount < 3;

  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{community.name}</h3>
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
            onClick={() => onToggleMembership(community.id, true)}
            disabled={!canJoin}
            className="flex-1"
            variant={canJoin ? "default" : "secondary"}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            {canJoin ? 'Join Community' : 'Max Limit Reached'}
          </Button>
        </div>

        {!canJoin && (
          <p className="text-xs text-gray-500 mt-2 text-center">
            You can only join up to 3 communities
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default AvailableCommunityCard;
