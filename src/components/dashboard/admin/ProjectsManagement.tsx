
import { useState } from 'react';
import ProjectsTable from './projects/ProjectsTable';
import ProjectDetailsDialog from './projects/ProjectDetailsDialog';
import { useProjectManagement } from './projects/useProjectManagement';
import { Project, ProjectsManagementProps } from './projects/types';

const ProjectsManagement = ({ projects: initialProjects, updateProjectStatus }: ProjectsManagementProps) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const {
    projects,
    loading,
    handleProjectAction,
    handleFeatureToggle
  } = useProjectManagement(initialProjects, updateProjectStatus);

  const handleViewProject = (project: Project) => {
    setSelectedProject(project);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedProject(null);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Projects Management</h2>
        <div className="text-sm text-gray-600">
          Total Projects: {projects.length}
        </div>
      </div>

      <ProjectsTable
        projects={projects}
        loading={loading}
        onViewProject={handleViewProject}
        onProjectAction={handleProjectAction}
        onFeatureToggle={handleFeatureToggle}
      />

      <ProjectDetailsDialog
        project={selectedProject}
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        loading={loading}
        onProjectAction={handleProjectAction}
      />
    </div>
  );
};

export default ProjectsManagement;
