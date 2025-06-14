
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ProjectsEmptyStateProps {
  onSubmitProject: () => void;
}

const ProjectsEmptyState = ({ onSubmitProject }: ProjectsEmptyStateProps) => {
  return (
    <Card>
      <CardContent className="text-center py-8">
        <p className="text-gray-600">You haven't submitted any projects yet.</p>
        <Button 
          className="mt-4" 
          onClick={onSubmitProject}
        >
          Submit Your First Project
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProjectsEmptyState;
