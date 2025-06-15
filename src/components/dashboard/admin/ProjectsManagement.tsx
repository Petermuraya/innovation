
import EnhancedProjectManagement from './projects/EnhancedProjectManagement';

interface ProjectsManagementProps {
  projects?: any[];
  updateProjectStatus?: (projectId: string, status: string, feedback?: string) => Promise<void>;
}

const ProjectsManagement = ({ projects: initialProjects, updateProjectStatus }: ProjectsManagementProps) => {
  // Use the new enhanced project management component
  return <EnhancedProjectManagement />;
};

export default ProjectsManagement;
