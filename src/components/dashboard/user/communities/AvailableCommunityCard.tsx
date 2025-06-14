
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar } from 'lucide-react';
import { CommunityGroup } from './useCommunityData';

interface AvailableCommunityCardProps {
  community: CommunityGroup;
  userMembershipCount: number;
  onToggleMembership: (groupId: string, groupName: string, isMember: boolean) => void;
}

const AvailableCommunityCard = ({
  community,
  userMembershipCount,
  onToggleMembership,
}: AvailableCommunityCardProps) => {
  return (
    <Card key={community.id}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm">
          <span>{community.name}</span>
          <Badge variant="secondary" className="flex items-center gap-1 text-xs">
            <Users className="w-3 h-3" />
            {community.member_count}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-gray-700">{community.description}</p>
        
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Calendar className="w-3 h-3" />
          <span>{community.meeting_schedule}</span>
        </div>

        {community.focus_areas && community.focus_areas.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {community.focus_areas.slice(0, 3).map((area) => (
              <Badge key={area} variant="outline" className="text-xs">
                {area}
              </Badge>
            ))}
          </div>
        )}

        <Button
          onClick={() => onToggleMembership(community.id, community.name, community.is_member)}
          variant="default"
          size="sm"
          className="w-full mt-3"
          disabled={userMembershipCount >= 3}
        >
          {userMembershipCount >= 3 ? "Limit Reached" : "Join Community"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AvailableCommunityCard;
