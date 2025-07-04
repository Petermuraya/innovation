import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Trash2, ExternalLink, Github } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import ProjectSubmissionForm from './ProjectSubmissionForm';
import ProjectEditForm from './ProjectEditForm';

interface Project {
  id: string;
  title: string;
  description: string;
  github_url?: string;
  live_demo_url?: string;
  tech_tags?: string[];
  thumbnail_url?: string;
  status: string;
  created_at: string;
  view_count?: number;
  likes_count?: number;
  is_featured?: boolean;
}

const EnhancedDashboardProjects = () => {
  const { member } = useAuth();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const fetchProjects = async () => {
    if (!member) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('project_submissions')
        .select('*')
        .eq('user_id', member.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Error",
        description: "Failed to load your projects",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [member]);

  const handleSuccessfulSubmission = () => {
    setShowSubmissionForm(false);
    fetchProjects();
  };

  const handleEditClick = (project: Project) => {
    setEditingProject(project);
  };

  const handleDeleteClick = async (project: Project) => {
    if (!member) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to delete a project",
        variant: "destructive"
      });
      return;
    }

    if (!confirm("Are you sure you want to delete this project?")) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('project_submissions')
        .delete()
        .eq('id', project.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Project deleted successfully!",
      });
      fetchProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading your projects...</div>;
  }

  if (showSubmissionForm) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-kic-gray">Submit New Project</h2>
          <Button variant="outline" onClick={() => setShowSubmissionForm(false)}>
            Back to Projects
          </Button>
        </div>
        <ProjectSubmissionForm />
      </div>
    );
  }

  if (editingProject) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-kic-gray">Edit Project</h2>
          <Button variant="outline" onClick={() => setEditingProject(null)}>
            Back to Projects
          </Button>
        </div>
        <ProjectEditForm project={editingProject} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-kic-gray">My Projects</h2>
          <p className="text-kic-gray/70">Manage and track your submitted projects</p>
        </div>
        <Button onClick={() => setShowSubmissionForm(true)}>
          Submit New Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-600 mb-4">You haven't submitted any projects yet.</p>
            <Button onClick={() => setShowSubmissionForm(true)}>
              Submit Your First Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="hover:shadow-sm transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                  </div>
                  <Badge variant={project.status === 'approved' ? 'default' : 'secondary'}>
                    {project.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    {project.github_url && (
                      <Button variant="ghost" size="sm" asChild>
                        <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center">
                          <Github className="h-4 w-4 mr-2" />
                          GitHub
                        </a>
                      </Button>
                    )}
                    {project.live_demo_url && (
                      <Button variant="ghost" size="sm" asChild>
                        <a href={project.live_demo_url} target="_blank" rel="noopener noreferrer" className="flex items-center">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Live Demo
                        </a>
                      </Button>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditClick(project)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(project)}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnhancedDashboardProjects;
