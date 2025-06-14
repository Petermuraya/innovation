import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Clock, CheckCircle, XCircle, Plus } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ProjectSubmissionForm from '@/components/dashboard/ProjectSubmissionForm';
import ProjectActions from './ProjectActions';
import ProjectEditForm from './ProjectEditForm';

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'default';
      case 'rejected':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const pendingProjects = projects.filter(p => p.status === 'pending');
  const approvedProjects = projects.filter(p => p.status === 'approved');
  const rejectedProjects = projects.filter(p => p.status === 'rejected');

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

  if (showSubmissionForm) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Submit New Project</h2>
          <Button 
            variant="outline" 
            onClick={() => setShowSubmissionForm(false)}
          >
            Back to Projects
          </Button>
        </div>
        <ProjectSubmissionForm onSuccess={() => {
          setShowSubmissionForm(false);
          onSuccess();
        }} />
      </div>
    );
  }

  if (editingProject) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Edit Project</h2>
          <Button 
            variant="outline" 
            onClick={handleEditCancel}
          >
            Back to Projects
          </Button>
        </div>
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
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">My Projects</h2>
        <Button onClick={() => setShowSubmissionForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Submit Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-600">You haven't submitted any projects yet.</p>
            <Button 
              className="mt-4" 
              onClick={() => setShowSubmissionForm(true)}
            >
              Submit Your First Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All ({projects.length})</TabsTrigger>
            <TabsTrigger value="pending">
              Pending ({pendingProjects.length})
            </TabsTrigger>
            <TabsTrigger value="approved">
              Approved ({approvedProjects.length})
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejected ({rejectedProjects.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <ProjectList projects={projects} onUpdate={onSuccess} onEdit={handleEditProject} />
          </TabsContent>
          
          <TabsContent value="pending">
            {pendingProjects.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-600">No pending projects.</p>
                </CardContent>
              </Card>
            ) : (
              <>
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    These projects are awaiting admin review. You'll be notified once they're reviewed.
                  </AlertDescription>
                </Alert>
                <ProjectList projects={pendingProjects} onUpdate={onSuccess} onEdit={handleEditProject} />
              </>
            )}
          </TabsContent>
          
          <TabsContent value="approved">
            {approvedProjects.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-600">No approved projects yet.</p>
                </CardContent>
              </Card>
            ) : (
              <ProjectList projects={approvedProjects} onUpdate={onSuccess} onEdit={handleEditProject} />
            )}
          </TabsContent>
          
          <TabsContent value="rejected">
            {rejectedProjects.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-600">No rejected projects.</p>
                </CardContent>
              </Card>
            ) : (
              <ProjectList projects={rejectedProjects} onUpdate={onSuccess} onEdit={handleEditProject} />
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

const ProjectList = ({ projects, onUpdate, onEdit }: { projects: Project[], onUpdate: () => void, onEdit: (project: Project) => void }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'default';
      case 'rejected':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="grid gap-4">
      {projects.map((project) => (
        <Card key={project.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle className="flex items-center gap-2">
                {project.title}
                {getStatusIcon(project.status)}
              </CardTitle>
              <Badge variant={getStatusColor(project.status) as any}>
                {project.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">{project.description}</p>
            
            {project.tech_tags && project.tech_tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {project.tech_tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {project.admin_feedback && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Admin Feedback:</strong> {project.admin_feedback}
                </AlertDescription>
              </Alert>
            )}

            {project.admin_notes && (
              <div className="text-sm text-gray-600">
                <strong>Notes:</strong> {project.admin_notes}
              </div>
            )}

            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Submitted: {new Date(project.created_at).toLocaleDateString()}</span>
              {project.reviewed_at && (
                <span>Reviewed: {new Date(project.reviewed_at).toLocaleDateString()}</span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                    View on GitHub
                  </a>
                </Button>
              </div>
              
              <ProjectActions 
                project={project} 
                onUpdate={onUpdate} 
                onEdit={onEdit}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EnhancedDashboardProjects;
