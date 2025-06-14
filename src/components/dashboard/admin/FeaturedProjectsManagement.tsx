
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, StarOff, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  is_featured: boolean;
  is_hidden: boolean;
  tech_tags: string[] | null;
  author_name: string;
  created_at: string;
  featured_order: number | null;
}

const FeaturedProjectsManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('project_submissions')
        .select(`
          *,
          members!project_submissions_user_id_fkey(name)
        `)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const projectsWithAuthor = (data || []).map(project => ({
        ...project,
        author_name: project.members?.name || 'Anonymous'
      }));

      setProjects(projectsWithAuthor);
      setFeaturedProjects(projectsWithAuthor.filter(p => p.is_featured));
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Error",
        description: "Failed to load projects",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleFeatured = async (projectId: string, makeFeatured: boolean) => {
    if (!user) return;

    try {
      const { error } = await supabase.rpc('manage_featured_project', {
        project_id: projectId,
        make_featured: makeFeatured,
        admin_id: user.id
      });

      if (error) throw error;

      await fetchProjects();
      toast({
        title: "Success",
        description: `Project ${makeFeatured ? 'featured' : 'unfeatured'} successfully`,
      });
    } catch (error: any) {
      console.error('Error managing featured project:', error);
      toast({
        title: "Error",
        description: error.message || `Failed to ${makeFeatured ? 'feature' : 'unfeature'} project`,
        variant: "destructive",
      });
    }
  };

  const toggleHidden = async (projectId: string, isHidden: boolean) => {
    try {
      const { error } = await supabase
        .from('project_submissions')
        .update({ is_hidden: isHidden })
        .eq('id', projectId);

      if (error) throw error;

      await fetchProjects();
      toast({
        title: "Success",
        description: `Project ${isHidden ? 'hidden' : 'shown'} successfully`,
      });
    } catch (error: any) {
      console.error('Error toggling project visibility:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update project visibility",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading projects...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Featured Projects Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <AlertDescription>
              You can feature up to 6 projects to display on the home page. Featured projects are shown in order of their featured date.
            </AlertDescription>
          </Alert>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">
              Currently Featured ({featuredProjects.length}/6)
            </h3>
            {featuredProjects.length === 0 ? (
              <p className="text-gray-500">No projects are currently featured.</p>
            ) : (
              <div className="grid gap-4">
                {featuredProjects
                  .sort((a, b) => (a.featured_order || 0) - (b.featured_order || 0))
                  .map((project) => (
                    <div key={project.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium">{project.title}</h4>
                          <p className="text-sm text-gray-600">By {project.author_name}</p>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {project.description}
                          </p>
                          {project.tech_tags && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {project.tech_tags.slice(0, 3).map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleFeatured(project.id, false)}
                          >
                            <StarOff className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleHidden(project.id, !project.is_hidden)}
                          >
                            {project.is_hidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Available Projects</h3>
            <div className="grid gap-4 max-h-96 overflow-y-auto">
              {projects
                .filter(p => !p.is_featured)
                .map((project) => (
                  <div key={project.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium">{project.title}</h4>
                        <p className="text-sm text-gray-600">By {project.author_name}</p>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {project.description}
                        </p>
                        {project.tech_tags && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {project.tech_tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleFeatured(project.id, true)}
                          disabled={featuredProjects.length >= 6}
                        >
                          <Star className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleHidden(project.id, !project.is_hidden)}
                        >
                          {project.is_hidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeaturedProjectsManagement;
