
import { Code2 } from 'lucide-react';

const ProjectLeaderboardEmpty = () => {
  return (
    <div className="text-center py-12 text-gray-500">
      <Code2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
      <p className="text-lg font-medium text-gray-700">No projects found</p>
      <p className="text-sm">Try adjusting your search or filters to find amazing projects!</p>
    </div>
  );
};

export default ProjectLeaderboardEmpty;
