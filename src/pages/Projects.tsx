
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Github, Calendar, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Project {
  id: string;
  title: string;
  description: string;
  github_url: string;
  live_demo_url?: string;
  thumbnail_url?: string;
  tech_tags?: string[];
  created_at: string;
  user_id: string;
  is_featured: boolean;
  featured_order?: number;
}

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchApprovedProjects();
  }, []);

  const fetchApprovedProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('project_submissions')
        .select('*')
        .eq('status', 'approved')
        .order('is_featured', { ascending: false })
        .order('featured_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-kic-lightGray py-12">
        <div className="container mx-auto px-6">
          <div className="text-center">Loading projects...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-kic-lightGray py-12">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-kic-gray mb-8 text-center">
            Innovation Projects
          </h1>
          
          <p className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Explore the amazing projects created by our community members. These projects showcase
            innovation, creativity, and technical excellence.
          </p>

          {projects.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Projects Available</h3>
                <p className="text-gray-600">
                  Check back soon for exciting projects from our community!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="hover:shadow-lg transition-shadow">
                  {project.thumbnail_url && (
                    <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                      <img 
                        src={project.thumbnail_url} 
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl flex items-center gap-2">
                        {project.title}
                        {project.is_featured && (
                          <Badge variant="default" className="text-xs">Featured</Badge>
                        )}
                      </CardTitle>
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

                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(project.created_at).toLocaleDateString()}</span>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button asChild className="flex-1">
                        <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                          <Github className="w-4 h-4 mr-2" />
                          GitHub
                        </a>
                      </Button>
                      {project.live_demo_url && (
                        <Button variant="outline" asChild className="flex-1">
                          <a href={project.live_demo_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Demo
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Projects;
