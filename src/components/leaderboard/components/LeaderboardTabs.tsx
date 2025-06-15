
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Code2 } from 'lucide-react';
import MemberRanking from '@/components/leaderboard/MemberRanking';
import ProjectLeaderboard from '@/components/leaderboard/ProjectLeaderboard';

interface LeaderboardTabsProps {
  searchTerm: string;
  memberFilter: string;
  projectFilter: string;
  timeFilter: string;
}

const LeaderboardTabs = ({ searchTerm, memberFilter, projectFilter, timeFilter }: LeaderboardTabsProps) => {
  return (
    <Tabs defaultValue="members" className="space-y-4 sm:space-y-6">
      <TabsList className="grid w-full grid-cols-2 max-w-sm sm:max-w-md mx-auto bg-white/90 shadow-lg border-2 border-green-200 backdrop-blur-sm h-12 sm:h-auto">
        <TabsTrigger 
          value="members" 
          className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-yellow-500 data-[state=active]:text-white data-[state=active]:shadow-md font-medium transition-all duration-200 text-xs sm:text-sm px-2 sm:px-4"
        >
          <Trophy className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          <span className="hidden xs:inline">Member Rankings</span>
          <span className="xs:hidden">Members</span>
        </TabsTrigger>
        <TabsTrigger 
          value="projects" 
          className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-yellow-500 data-[state=active]:text-white data-[state=active]:shadow-md font-medium transition-all duration-200 text-xs sm:text-sm px-2 sm:px-4"
        >
          <Code2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          <span className="hidden xs:inline">Project Rankings</span>
          <span className="xs:hidden">Projects</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="members" className="space-y-4 sm:space-y-6">
        <MemberRanking searchTerm={searchTerm} filter={memberFilter} timeFilter={timeFilter} />
      </TabsContent>

      <TabsContent value="projects" className="space-y-4 sm:space-y-6">
        <ProjectLeaderboard searchTerm={searchTerm} filter={projectFilter} timeFilter={timeFilter} />
      </TabsContent>
    </Tabs>
  );
};

export default LeaderboardTabs;
