
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Zap, Users } from 'lucide-react';

interface MemberRankingHeaderProps {
  memberCount: number;
}

const MemberRankingHeader = ({ memberCount }: MemberRankingHeaderProps) => {
  return (
    <CardHeader className="bg-gradient-to-r from-blue-50 via-purple-50 to-green-50 border-b-2 border-gray-200">
      <CardTitle className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Trophy className="h-6 w-6 text-yellow-500" />
          <span className="text-xl font-bold">Enhanced Member Leaderboard</span>
          <Badge className="bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 px-3 py-1">
            <Zap className="w-3 h-3 mr-1" />
            Points System
          </Badge>
        </div>
        <Badge variant="outline" className="bg-white/90 backdrop-blur-sm border-gray-300 hover:bg-gray-50 transition-colors duration-200 px-3 py-1">
          <Users className="w-3 h-3 mr-1" />
          {memberCount} Members
        </Badge>
      </CardTitle>
    </CardHeader>
  );
};

export default MemberRankingHeader;
