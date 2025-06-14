
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import ProjectList from './ProjectList';

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

interface ProjectTabsProps {
  projects: Project[];
  onUpdate: () => void;
  onEdit: (project: Project) => void;
}

const ProjectTabs = ({ projects, onUpdate, onEdit }: ProjectTabsProps) => {
  const pendingProjects = projects.filter(p => p.status === 'pending');
  const approvedProjects = projects.filter(p => p.status === 'approved');
  const rejectedProjects = projects.filter(p => p.status === 'rejected');

  return (
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
        <ProjectList projects={projects} onUpdate={onUpdate} onEdit={onEdit} />
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
            <ProjectList projects={pendingProjects} onUpdate={onUpdate} onEdit={onEdit} />
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
          <ProjectList projects={approvedProjects} onUpdate={onUpdate} onEdit={onEdit} />
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
          <ProjectList projects={rejectedProjects} onUpdate={onUpdate} onEdit={onEdit} />
        )}
      </TabsContent>
    </Tabs>
  );
};

export default ProjectTabs;
