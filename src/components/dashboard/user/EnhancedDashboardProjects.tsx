
import { useState } from 'react';
import ProjectSubmissionForm from '@/components/dashboard/ProjectSubmissionForm';
import ProjectEditForm from './ProjectEditForm';
import ProjectTabs from './projects/ProjectTabs';
import ProjectsEmptyState from './projects/ProjectsEmptyState';
import ProjectsHeader from './projects/ProjectsHeader';

interface Project {
  id: string;
  title: string;
  description: string;
  github_url: string;
  thumbnail_url: string | null;
  tech_tags: string[] | null;
  status: string;
  admin_notes: string | null;
  admin_feedback: string | null;
  reviewed_at: string | null;
  created_at: string;
}

interface EnhancedDashboardProjectsProps {
  projects: Project[];
  onSuccess: () => void;
}

const EnhancedDashboardProjects = ({ projects, onSuccess }: EnhancedDashboardProjectsProps) => {
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setShowSubmissionForm(false);
  };

  const handleEditSuccess = () => {
    setEditingProject(null);
    onSuccess();
  };

  const handleEditCancel = () => {
    setEditingProject(null);
  };

  const handleSubmissionSuccess = () => {
    setShowSubmissionForm(false);
    onSuccess();
  };

  if (showSubmissionForm) {
    return (
      <div className="space-y-4">
        <ProjectsHeader
          title="Submit New Project"
          onSubmitProject={() => setShowSubmissionForm(true)}
          onBackToProjects={() => setShowSubmissionForm(false)}
          showBackButton={true}
        />
        <ProjectSubmissionForm onSuccess={handleSubmissionSuccess} />
      </div>
    );
  }

  if (editingProject) {
    return (
      <div className="space-y-4">
        <ProjectsHeader
          title="Edit Project"
          onSubmitProject={() => setShowSubmissionForm(true)}
          onBackToProjects={handleEditCancel}
          showBackButton={true}
        />
        <ProjectEditForm 
          project={editingProject}
          onSuccess={handleEditSuccess}
          onCancel={handleEditCancel}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProjectsHeader onSubmitProject={() => setShowSubmissionForm(true)} />

      {projects.length === 0 ? (
        <ProjectsEmptyState onSubmitProject={() => setShowSubmissionForm(true)} />
      ) : (
        <ProjectTabs 
          projects={projects} 
          onUpdate={onSuccess} 
          onEdit={handleEditProject} 
        />
      )}
    </div>
  );
};

export default EnhancedDashboardProjects;
