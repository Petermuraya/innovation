
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FolderOpen } from 'lucide-react';

interface DashboardProjectsProps {
  projects: any[];
  onUpdate: () => void;
}

const DashboardProjects: React.FC<DashboardProjectsProps> = ({ projects, onUpdate }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5" />
            My Projects
          </CardTitle>
          <CardDescription>
            Manage and track your project submissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <div className="text-center py-8">
              <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No projects found</p>
              <p className="text-sm text-muted-foreground mt-2">
                Start by submitting your first project!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {projects.map((project, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <h4 className="font-medium">{project.title || 'Untitled Project'}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {project.description || 'No description provided'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardProjects;
