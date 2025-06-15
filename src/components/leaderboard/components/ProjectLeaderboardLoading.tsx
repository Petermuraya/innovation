
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Code2 } from 'lucide-react';

const ProjectLeaderboardLoading = () => {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Code2 className="h-6 w-6 text-blue-500" />
          <span>Enhanced Project Leaderboard</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-100 rounded-lg"></div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectLeaderboardLoading;
