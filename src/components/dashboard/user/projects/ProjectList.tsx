
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';
import ProjectActions from '../ProjectActions';

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

interface ProjectListProps {
  projects: Project[];
  onUpdate: () => void;
  onEdit: (project: Project) => void;
}

const ProjectList = ({ projects, onUpdate, onEdit }: ProjectListProps) => {
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

export default ProjectList;
