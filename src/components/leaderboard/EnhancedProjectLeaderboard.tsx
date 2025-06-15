
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProjectLeaderboardProps, SortBy } from './types/projectLeaderboard';
import { useProjectLeaderboard } from './hooks/useProjectLeaderboard';
import { filterProjects } from './utils/projectUtils';
import ProjectLeaderboardHeader from './components/ProjectLeaderboardHeader';
import ProjectLeaderboardRow from './components/ProjectLeaderboardRow';
import ProjectLeaderboardEmpty from './components/ProjectLeaderboardEmpty';
import ProjectLeaderboardLoading from './components/ProjectLeaderboardLoading';

const EnhancedProjectLeaderboard = ({ searchTerm = '', filter = 'all', timeFilter = 'all' }: ProjectLeaderboardProps) => {
  const [displayCount, setDisplayCount] = useState(10);
  const [sortBy, setSortBy] = useState<SortBy>('engagement');
  const { projects, loading } = useProjectLeaderboard(sortBy);

  if (loading) {
    return <ProjectLeaderboardLoading />;
  }

  const filteredProjects = filterProjects(projects, searchTerm, filter).slice(0, displayCount);

  return (
    <Card className="border-0 shadow-xl overflow-hidden bg-white/95 backdrop-blur-sm">
      <ProjectLeaderboardHeader sortBy={sortBy} setSortBy={setSortBy} />
      <CardContent className="p-0">
        <div className="space-y-2">
          {filteredProjects.map((project, index) => (
            <ProjectLeaderboardRow key={project.id} project={project} index={index} />
          ))}
        </div>

        {/* Load More Button */}
        {filteredProjects.length < projects.length && (
          <div className="p-4 text-center border-t border-gray-200 bg-gradient-to-r from-gray-50 to-purple-50/30">
            <Button 
              variant="outline" 
              onClick={() => setDisplayCount(prev => prev + 10)}
              className="bg-white/90 backdrop-blur-sm hover:bg-purple-50 border-gray-300 hover:border-purple-400 transition-all duration-200 px-6 py-2"
            >
              Load More Projects
            </Button>
          </div>
        )}

        {filteredProjects.length === 0 && !loading && <ProjectLeaderboardEmpty />}
      </CardContent>
    </Card>
  );
};

export default EnhancedProjectLeaderboard;
