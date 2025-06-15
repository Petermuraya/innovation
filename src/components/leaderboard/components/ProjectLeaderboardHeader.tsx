
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Code2, Star, Filter } from 'lucide-react';
import { SortBy } from '../types/projectLeaderboard';

interface ProjectLeaderboardHeaderProps {
  sortBy: SortBy;
  setSortBy: (sortBy: SortBy) => void;
}

const ProjectLeaderboardHeader = ({ sortBy, setSortBy }: ProjectLeaderboardHeaderProps) => {
  return (
    <CardHeader className="bg-gradient-to-r from-green-50 via-yellow-50 to-green-50 border-b-2 border-green-200">
      <div className="flex items-center justify-between">
        <CardTitle className="flex items-center space-x-2">
          <Code2 className="h-6 w-6 text-green-500" />
          <span className="text-xl font-bold text-green-700">Enhanced Project Leaderboard</span>
          <Badge className="bg-gradient-to-r from-green-500 to-yellow-600 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 px-3 py-1">
            <Star className="w-3 h-3 mr-1" />
            Innovation Hub
          </Badge>
        </CardTitle>
        
        {/* Sort Options */}
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-green-500" />
          <div className="flex bg-white/90 rounded-lg border border-green-300 shadow-sm backdrop-blur-sm">
            {[
              { key: 'engagement', label: 'Top Rated' },
              { key: 'likes', label: 'Most Liked' },
              { key: 'recent', label: 'Latest' }
            ].map((option) => (
              <Button
                key={option.key}
                variant={sortBy === option.key ? "default" : "ghost"}
                size="sm"
                onClick={() => setSortBy(option.key as SortBy)}
                className={`rounded-none first:rounded-l-lg last:rounded-r-lg text-xs transition-all duration-200 ${
                  sortBy === option.key 
                    ? 'bg-gradient-to-r from-green-500 to-yellow-500 text-white shadow-md hover:shadow-lg' 
                    : 'text-green-600 hover:bg-green-50'
                }`}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </CardHeader>
  );
};

export default ProjectLeaderboardHeader;
