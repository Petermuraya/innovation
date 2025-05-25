
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Project {
  id: string;
  title: string;
  description: string;
  github_url: string;
  tech_tags?: string[];
  status: string;
  members?: { name: string };
}

interface ProjectsManagementProps {
  projects: Project[];
  updateProjectStatus: (projectId: string, status: string) => void;
}

const ProjectsManagement = ({ projects, updateProjectStatus }: ProjectsManagementProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Submissions</CardTitle>
        <CardDescription>Review and approve project submissions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {projects.map((project) => (
            <div key={project.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-kic-gray">{project.title}</h4>
                  <p className="text-sm text-kic-gray/70">By: {project.members?.name}</p>
                  <p className="text-sm text-kic-gray/70 mt-1">{project.description}</p>
                  <a 
                    href={project.github_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-kic-green-500 hover:underline"
                  >
                    View on GitHub
                  </a>
                  <div className="flex space-x-2 mt-2">
                    {project.tech_tags?.map((tag: string, index: number) => (
                      <Badge key={index} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={
                    project.status === 'approved' ? 'default' : 
                    project.status === 'rejected' ? 'destructive' : 'secondary'
                  }>
                    {project.status}
                  </Badge>
                  {project.status === 'pending' && (
                    <div className="space-x-2">
                      <Button 
                        size="sm" 
                        className="bg-kic-green-500 hover:bg-kic-green-600"
                        onClick={() => updateProjectStatus(project.id, 'approved')}
                      >
                        Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => updateProjectStatus(project.id, 'rejected')}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {projects.length === 0 && (
            <p className="text-kic-gray/70">No project submissions found</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectsManagement;
