
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, Info } from 'lucide-react';

interface CommunitiesHeaderProps {
  userMembershipCount: number;
}

const CommunitiesHeader = ({ userMembershipCount }: CommunitiesHeaderProps) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-kic-gray">My Communities</h3>
        <Badge variant="secondary" className="flex items-center gap-1">
          <Users className="w-3 h-3" />
          {userMembershipCount}/3
        </Badge>
      </div>

      {userMembershipCount === 0 && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            You must join at least one community to participate in club activities.
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default CommunitiesHeader;
