
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, Award, Settings, Eye, LogIn } from 'lucide-react';
import { CommunityGroup } from './useCommunityData';

interface JoinedCommunityCardProps {
  community: CommunityGroup;
  visitingCommunity: string | null;
  userMembershipCount: number;
  onVisit: (communityId: string, communityName: string) => void;
  onToggleMembership: (groupId: string, groupName: string, isMember: boolean) => void;
}

const JoinedCommunityCard = ({
  community,
  visitingCommunity,
  userMembershipCount,
  onVisit,
  onToggleMembership,
}: JoinedCommunityCardProps) => {
  return (
    <Card key={community.id} className="border-green-200 bg-green-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm">
          <span>{community.name}</span>
          <div className="flex items-center gap-2">
            {community.is_admin && (
              <Badge variant="default" className="flex items-center gap-1 text-xs">
                <Award className="w-3 h-3" />
                Admin
              </Badge>
            )}
            <Badge variant="secondary" className="flex items-center gap-1 text-xs">
              <Users className="w-3 h-3" />
              {community.member_count}
            </Badge>
          </div>
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

        <div className="flex gap-2 pt-2">
          <Button
            onClick={() => onVisit(community.id, community.name)}
            variant="default"
            size="sm"
            className="flex-1"
            disabled={visitingCommunity === community.id}
          >
            {visitingCommunity === community.id ? (
              <>
                <Eye className="w-3 h-3 mr-1 animate-pulse" />
                Visiting...
              </>
            ) : (
              <>
                <LogIn className="w-3 h-3 mr-1" />
                Visit Community
              </>
            )}
          </Button>
          <Button
            onClick={() => onToggleMembership(community.id, community.name, community.is_member)}
            variant="outline"
            size="sm"
            className="shrink-0"
            disabled={userMembershipCount <= 1}
          >
            Leave
          </Button>
          {community.is_admin && (
            <Button
              variant="outline"
              size="sm"
              className="shrink-0"
            >
              <Settings className="w-3 h-3" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default JoinedCommunityCard;
