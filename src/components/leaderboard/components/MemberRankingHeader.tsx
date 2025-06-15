
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Users, Award } from 'lucide-react';

interface MemberRankingHeaderProps {
  memberCount: number;
}

const MemberRankingHeader = ({ memberCount }: MemberRankingHeaderProps) => {
  return (
    <CardHeader className="bg-gradient-to-r from-green-50 via-yellow-50 to-green-50 border-b-2 border-green-200">
      <div className="flex items-center justify-between">
        <CardTitle className="flex items-center space-x-2">
          <Trophy className="h-6 w-6 text-green-500" />
          <span className="text-xl font-bold text-green-700">Member Rankings</span>
          <Badge className="bg-gradient-to-r from-green-500 to-yellow-600 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 px-3 py-1">
            <Award className="w-3 h-3 mr-1" />
            Top Performers
          </Badge>
        </CardTitle>
        
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-green-500" />
          <span className="text-sm text-green-600 font-medium">
            {memberCount} Active Members
          </span>
        </div>
      </div>
    </CardHeader>
  );
};

export default MemberRankingHeader;
