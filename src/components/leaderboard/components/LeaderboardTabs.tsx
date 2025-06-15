
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
    <Tabs defaultValue="members" className="space-y-6">
      <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto bg-white/90 shadow-lg border-2 border-blue-200 backdrop-blur-sm">
        <TabsTrigger 
          value="members" 
          className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-md font-medium transition-all duration-200"
        >
          <Trophy className="w-4 h-4 mr-2" />
          Member Rankings
        </TabsTrigger>
        <TabsTrigger 
          value="projects" 
          className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-md font-medium transition-all duration-200"
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
  );
};

export default LeaderboardTabs;
