
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, RotateCcw, Zap, Users, Code2 } from 'lucide-react';

interface LeaderboardFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  memberFilter: string;
  setMemberFilter: (filter: string) => void;
  projectFilter: string;
  setProjectFilter: (filter: string) => void;
  timeFilter: string;
  setTimeFilter: (filter: string) => void;
  onClearFilters: () => void;
}

const LeaderboardFilters = ({
  searchTerm,
  setSearchTerm,
  memberFilter,
  setMemberFilter,
  projectFilter,
  setProjectFilter,
  timeFilter,
  setTimeFilter,
  onClearFilters
}: LeaderboardFiltersProps) => {
  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Filter className="w-5 h-5 text-blue-600" />
          Filters & Search
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search Input */}
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search members or projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-2 border-gray-200 focus:border-blue-400 transition-colors backdrop-blur-sm"
            />
          </div>

          {/* Time Filter */}
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="border-2 border-gray-200 focus:border-blue-400 bg-white/90 backdrop-blur-sm">
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>

          {/* Member Filter */}
          <Select value={memberFilter} onValueChange={setMemberFilter}>
            <SelectTrigger className="border-2 border-gray-200 focus:border-blue-400 bg-white/90 backdrop-blur-sm">
              <SelectValue placeholder="Member Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Members</SelectItem>
              <SelectItem value="active">Active Only</SelectItem>
              <SelectItem value="new">New Members</SelectItem>
              <SelectItem value="alumni">Alumni</SelectItem>
            </SelectContent>
          </Select>

          {/* Clear Filters Button */}
          <Button 
            variant="outline" 
            onClick={onClearFilters}
            className="border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 bg-white/90 backdrop-blur-sm"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        </div>

        {/* Active Filters Display */}
        {(searchTerm || memberFilter !== 'all' || projectFilter !== 'all' || timeFilter !== 'all') && (
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-sm text-gray-600 mr-2 font-medium">Active filters:</span>
            {searchTerm && (
              <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 shadow-sm hover:shadow-md transition-all duration-200">
                <Search className="w-3 h-3 mr-1" />
                Search: "{searchTerm}"
              </Badge>
            )}
            {timeFilter !== 'all' && (
              <Badge className="bg-gradient-to-r from-emerald-500 to-green-500 text-white border-0 shadow-sm hover:shadow-md transition-all duration-200">
                <Zap className="w-3 h-3 mr-1" />
                Time: {timeFilter}
              </Badge>
            )}
            {memberFilter !== 'all' && (
              <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-0 shadow-sm hover:shadow-md transition-all duration-200">
                <Users className="w-3 h-3 mr-1" />
                Members: {memberFilter}
              </Badge>
            )}
            {projectFilter !== 'all' && (
              <Badge className="bg-gradient-to-r from-orange-500 to-amber-500 text-white border-0 shadow-sm hover:shadow-md transition-all duration-200">
                <Code2 className="w-3 h-3 mr-1" />
                Projects: {projectFilter}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LeaderboardFilters;
