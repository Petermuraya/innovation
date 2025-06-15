
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { EnhancedMemberRank } from '../types/memberRanking';
import { getRankIcon, getRankBadgeColor, getActivityBreakdown } from '../utils/rankingUtils';

interface MemberRankingRowProps {
  member: EnhancedMemberRank;
}

const MemberRankingRow = ({ member }: MemberRankingRowProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const activityBreakdown = getActivityBreakdown(member);

  return (
    <div
      className={`transition-all duration-300 border-b border-gray-100 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50/30 ${
        member.rank === 1 
          ? 'bg-gradient-to-r from-amber-50/50 to-yellow-50/50'
          : member.rank === 2 
            ? 'bg-gradient-to-r from-slate-50/50 to-gray-50/50'
            : member.rank === 3
              ? 'bg-gradient-to-r from-orange-50/50 to-amber-50/50'
              : 'bg-white'
      }`}
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-4 flex-1">
          <div className="flex items-center space-x-3">
            {getRankIcon(member.rank)}
            <Badge 
              className={`${getRankBadgeColor(member.rank)} font-bold min-w-[60px] flex justify-center text-sm px-4 py-2 transform hover:scale-105`}
            >
              #{member.rank}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-4 flex-1">
            {member.avatar_url ? (
              <img 
                src={member.avatar_url} 
                alt={member.name}
                className="w-12 h-12 rounded-full border-2 border-white shadow-lg ring-2 ring-blue-100 hover:ring-blue-200 transition-all duration-200"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg ring-2 ring-blue-100 hover:ring-blue-200 transition-all duration-200">
                {member.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-gray-900 text-lg truncate">{member.name}</h3>
              <div className="flex items-center space-x-2 mt-2">
                {activityBreakdown.slice(0, 4).map((item) => {
                  const Icon = item.icon;
                  return (
                    <Badge 
                      key={item.label}
                      className={`text-xs px-3 py-1 bg-gradient-to-r ${item.color} text-white border-0 shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105`}
                    >
                      <Icon className="w-3 h-3 mr-1" />
                      {item.points}
                    </Badge>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="text-center">
            <div className="font-bold text-transparent bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-2xl">{member.total_points}</div>
            <div className="text-gray-500 text-xs font-medium">Total Points</div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-blue-50 rounded-full transition-colors duration-200"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="px-4 pb-4 bg-gradient-to-r from-gray-50/50 to-blue-50/30 border-t border-gray-200/50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {activityBreakdown.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="text-center p-4 bg-white rounded-xl border border-gray-200/50 shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-102 backdrop-blur-sm">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center mx-auto mb-3 shadow-md`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="font-bold text-xl text-gray-800">{item.points}</div>
                  <div className="text-xs text-gray-500 mb-1 font-medium">{item.label} Points</div>
                  <Badge className={`text-xs ${item.textColor} bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors duration-200`}>
                    {item.count} activities
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberRankingRow;
