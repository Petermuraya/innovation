
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ProjectSubmissionForm from '../ProjectSubmissionForm';

interface DashboardProjectsProps {
  projects: any[];
  onSuccess: () => void;
}

const DashboardProjects = ({ projects, onSuccess }: DashboardProjectsProps) => {
  return (
    <div className="space-y-6">
      <ProjectSubmissionForm onSuccess={onSuccess} />
      
      <Card>
        <CardHeader>
          <CardTitle>My Project Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-kic-gray">{project.title}</h4>
                    <p className="text-sm text-kic-gray/70 mt-1">{project.description}</p>
                    <div className="flex space-x-2 mt-2">
                      {project.tech_tags?.map((tag: string, index: number) => (
                        <Badge key={index} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                  <Badge variant={project.status === 'approved' ? 'default' : project.status === 'rejected' ? 'destructive' : 'secondary'}>
                    {project.status}
                  </Badge>
                </div>
              </div>
            ))}
            {projects.length === 0 && (
              <p className="text-kic-gray/70">No project submissions yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardProjects;
