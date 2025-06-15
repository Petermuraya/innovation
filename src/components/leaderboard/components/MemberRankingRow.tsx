
import { Badge } from '@/components/ui/badge';
import { Trophy, Award, Star, Medal } from 'lucide-react';

interface Member {
  user_id: string;
  name: string;
  email: string;
  avatar_url?: string;
  total_points: number;
  rank: number;
}

interface MemberRankingRowProps {
  member: Member;
}

const MemberRankingRow = ({ member }: MemberRankingRowProps) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />;
      case 2:
        return <Award className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />;
      case 3:
        return <Star className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />;
      default:
        return <Medal className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white border-yellow-300';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white border-gray-300';
      case 3:
        return 'bg-gradient-to-r from-orange-400 to-orange-600 text-white border-orange-300';
      default:
        return rank <= 10 ? 'bg-gradient-to-r from-blue-400 to-blue-600 text-white border-blue-300' : 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="flex items-center justify-between p-3 sm:p-4 lg:p-6 bg-white/80 backdrop-blur-sm border-l-4 border-l-green-400 hover:bg-white/95 hover:shadow-lg transition-all duration-200 hover:scale-[1.02] group">
      {/* Mobile Layout */}
      <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
        {/* Rank Badge */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          {getRankIcon(member.rank)}
          <Badge className={`${getRankBadgeColor(member.rank)} text-xs sm:text-sm font-bold px-2 sm:px-3 py-1 shadow-lg`}>
            #{member.rank}
          </Badge>
        </div>

        {/* Member Info */}
        <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {member.avatar_url ? (
              <img 
                src={member.avatar_url} 
                alt={member.name}
                className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full border-2 border-green-200 shadow-md object-cover"
              />
            ) : (
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-sm sm:text-base lg:text-lg border-2 border-green-200 shadow-md">
                {member.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Name and Email - Responsive Layout */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-gray-800 group-hover:text-green-600 transition-colors text-sm sm:text-base lg:text-lg truncate">
                  {member.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 truncate">
                  {member.email}
                </p>
              </div>
              
              {/* Points - Mobile: Below name, Desktop: Right side */}
              <div className="mt-1 sm:mt-0 sm:ml-4 flex-shrink-0">
                <div className="inline-flex items-center px-2 sm:px-3 py-1 bg-gradient-to-r from-green-500 to-yellow-500 text-white rounded-full shadow-md">
                  <span className="font-bold text-xs sm:text-sm lg:text-base">
                    {member.total_points.toLocaleString()}
                  </span>
                  <span className="ml-1 text-xs sm:text-sm opacity-90">pts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberRankingRow;
