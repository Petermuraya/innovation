
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, ExternalLink, Eye, Edit } from 'lucide-react';
import ProjectSubmissionForm from './ProjectSubmissionForm';

interface Project {
  id: string;
  title: string;
  description: string;
  github_url: string;
  demo_url?: string;
  status: string;
  created_at: string;
  technologies?: string[];
  admin_notes?: string;
  admin_feedback?: string;
  reviewed_at?: string;
}

const EnhancedDashboardProjects: React.FC = () => {
  const { member } = useAuth();
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const handleSubmissionSuccess = () => {
    setShowSubmissionForm(false);
    // Refresh projects list
    fetchProjects();
  };

  const fetchProjects = async () => {
    // Implementation for fetching projects
    setLoading(false);
  };

  React.useEffect(() => {
    if (member) {
      fetchProjects();
    }
  }, [member]);

  if (showSubmissionForm) {
    return <ProjectSubmissionForm onSuccess={handleSubmissionSuccess} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold mb-2">My Projects</h3>
          <p className="text-muted-foreground">Manage your project submissions</p>
        </div>
        <Button onClick={() => setShowSubmissionForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Submit Project
        </Button>
      </div>

      <div className="grid gap-6">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{project.title}</CardTitle>
                  <CardDescription>
                    Submitted on {new Date(project.created_at).toLocaleDateString()}
                  </CardDescription>
                </div>
                <Badge variant={
                  project.status === 'approved' ? 'default' :
                  project.status === 'rejected' ? 'destructive' : 'secondary'
                }>
                  {project.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {project.description}
              </p>
              
              {project.technologies && (
                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">Technologies:</p>
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.map((tech, index) => (
                      <Badge key={index} variant="outline">{tech}</Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-4 mb-4">
                <Button variant="outline" size="sm" asChild>
                  <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    GitHub
                  </a>
                </Button>
                {project.demo_url && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                      <Eye className="w-4 h-4 mr-2" />
                      Demo
                    </a>
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </div>

              {project.admin_feedback && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium mb-1">Admin Feedback:</p>
                  <p className="text-sm text-gray-700">{project.admin_feedback}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {projects.length === 0 && !loading && (
          <Card>
            <CardContent className="p-8 text-center">
              <Plus className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                No projects submitted yet
              </p>
              <Button onClick={() => setShowSubmissionForm(true)}>
                Submit Your First Project
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EnhancedDashboardProjects;
