
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MemberRanking from '@/components/leaderboard/MemberRanking';
import ProjectLeaderboard from '@/components/leaderboard/ProjectLeaderboard';
import NewsletterSubscription from '@/components/newsletter/NewsletterSubscription';
import { Search, Trophy, Code2, TrendingUp, Users, Filter, RotateCcw, Zap, Star } from 'lucide-react';

const Leaderboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [memberFilter, setMemberFilter] = useState('all');
  const [projectFilter, setProjectFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');

  const handleClearFilters = () => {
    setSearchTerm('');
    setMemberFilter('all');
    setProjectFilter('all');
    setTimeFilter('all');
  };

  const leaderboardStats = [
    {
      title: "Total Members",
      value: "250+",
      icon: Users,
      gradient: "from-blue-500 to-cyan-600",
      bgGradient: "from-blue-50 to-cyan-50",
      borderColor: "border-blue-200"
    },
    {
      title: "Active Projects",
      value: "45",
      icon: Code2,
      gradient: "from-purple-500 to-indigo-600",
      bgGradient: "from-purple-50 to-indigo-50",
      borderColor: "border-purple-200"
    },
    {
      title: "Competition Level",
      value: "High",
      icon: TrendingUp,
      gradient: "from-emerald-500 to-green-600",
      bgGradient: "from-emerald-50 to-green-50",
      borderColor: "border-emerald-200"
    },
    {
      title: "Top Achievers",
      value: "15",
      icon: Trophy,
      gradient: "from-amber-500 to-yellow-600",
      bgGradient: "from-amber-50 to-yellow-50",
      borderColor: "border-amber-200"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="container mx-auto p-6 space-y-8">
        {/* Enhanced Header Section */}
        <div className="text-center space-y-6">
          <div className="relative">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent mb-4">
              Community Leaderboards
            </h1>
            <div className="absolute -top-2 -right-2 animate-bounce">
              <Trophy className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
            Discover our top contributors, most engaging projects, and recognize the outstanding achievements 
            of our innovation community members. Track progress, compete fairly, and celebrate success together.
          </p>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {leaderboardStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className={`bg-gradient-to-br ${stat.bgGradient} ${stat.borderColor} border-2 hover:shadow-lg transition-all duration-300 transform hover:scale-105 backdrop-blur-sm`}>
                  <CardContent className="p-4 text-center">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${stat.gradient} flex items-center justify-center mx-auto mb-3 shadow-md`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                    <div className="text-sm text-gray-600 font-medium">{stat.title}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Enhanced Filters and Search */}
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
                onClick={handleClearFilters}
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

        {/* Enhanced Tabs Section */}
        <Tabs defaultValue="members" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto bg-white/90 shadow-lg border-2 border-gray-200 backdrop-blur-sm">
            <TabsTrigger 
              value="members" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-md font-medium transition-all duration-200"
            >
              <Trophy className="w-4 h-4 mr-2" />
              Member Rankings
            </TabsTrigger>
            <TabsTrigger 
              value="projects" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-md font-medium transition-all duration-200"
            >
              <Code2 className="w-4 h-4 mr-2" />
              Project Rankings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="members" className="space-y-6">
            <MemberRanking searchTerm={searchTerm} filter={memberFilter} timeFilter={timeFilter} />
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <ProjectLeaderboard searchTerm={searchTerm} filter={projectFilter} timeFilter={timeFilter} />
          </TabsContent>
        </Tabs>

        {/* Enhanced Newsletter Section */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold">Stay Updated with Rankings</h3>
              <p className="text-blue-100 max-w-2xl mx-auto">
                Get weekly updates on leaderboard changes, new achievements, and community highlights delivered to your inbox.
              </p>
              <div className="flex justify-center mt-6">
                <div className="bg-white rounded-lg p-1 shadow-lg">
                  <NewsletterSubscription />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievement Highlights */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Recent Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-6 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border border-amber-200 hover:shadow-md transition-all duration-200 transform hover:scale-102">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 flex items-center justify-center mx-auto mb-3 shadow-md">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-800">Monthly Champion</h4>
                <p className="text-sm text-gray-600">Most points earned this month</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200 hover:shadow-md transition-all duration-200 transform hover:scale-102">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-3 shadow-md">
                  <Code2 className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-800">Project Innovator</h4>
                <p className="text-sm text-gray-600">Most creative project submission</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-200 hover:shadow-md transition-all duration-200 transform hover:scale-102">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center mx-auto mb-3 shadow-md">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-800">Community Builder</h4>
                <p className="text-sm text-gray-600">Most active community participant</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Leaderboard;
