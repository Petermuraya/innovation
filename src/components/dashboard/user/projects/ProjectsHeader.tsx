
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface ProjectsHeaderProps {
  onSubmitProject: () => void;
  onBackToProjects?: () => void;
  title?: string;
  showBackButton?: boolean;
}

const ProjectsHeader = ({ 
  onSubmitProject, 
  onBackToProjects, 
  title = "My Projects",
  showBackButton = false 
}: ProjectsHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-semibold">{title}</h2>
      {showBackButton && onBackToProjects ? (
        <Button variant="outline" onClick={onBackToProjects}>
          Back to Projects
        </Button>
      ) : (
        <Button onClick={onSubmitProject}>
          <Plus className="w-4 h-4 mr-2" />
          Submit Project
        </Button>
      )}
    </div>
  );
};

export default ProjectsHeader;
