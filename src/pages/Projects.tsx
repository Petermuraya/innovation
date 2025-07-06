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
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-blue-50 py-12">
        <div className="container mx-auto px-6">
          <div className="text-center text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-amber-500 font-bold text-2xl">
            Loading innovative projects...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-blue-50 py-12">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-amber-500 to-blue-600 mb-6 text-center">
            Innovation Projects
          </h1>
          
          <p className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Explore the amazing projects created by our community members. These projects showcase
            innovation, creativity, and technical excellence.
          </p>

          {projects.length === 0 ? (
            <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg">
              <CardContent className="text-center py-12">
                <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-amber-500 mb-2">
                  No Projects Available
                </h3>
                <p className="text-gray-600">
                  Check back soon for exciting projects from our community!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card 
                  key={project.id} 
                  className="hover:shadow-xl transition-all duration-300 border border-gray-200/50 bg-white/80 backdrop-blur-sm overflow-hidden group"
                >
                  {project.thumbnail_url && (
                    <div className="aspect-video w-full overflow-hidden relative">
                      <img 
                        src={project.thumbnail_url} 
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl flex items-center gap-2">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-amber-500">
                          {project.title}
                        </span>
                        {project.is_featured && (
                          <Badge 
                            variant="default" 
                            className="text-xs bg-gradient-to-r from-amber-500 to-yellow-500 text-white"
                          >
                            Featured
                          </Badge>
                        )}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600">{project.description}</p>
                    
                    {project.tech_tags && project.tech_tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {project.tech_tags.map((tag) => (
                          <Badge 
                            key={tag} 
                            variant="outline" 
                            className="text-xs border-green-200 text-green-700 hover:bg-green-50 transition-colors"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4 text-amber-600" />
                      <span>{new Date(project.created_at).toLocaleDateString()}</span>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button 
                        asChild 
                        className="flex-1 bg-gradient-to-r from-green-600 to-amber-500 hover:from-green-700 hover:to-amber-600 text-white shadow-md transition-all duration-300 hover:shadow-lg"
                      >
                        <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                          <Github className="w-4 h-4 mr-2" />
                          GitHub
                        </a>
                      </Button>
                      {project.live_demo_url && (
                        <Button 
                          variant="outline" 
                          asChild 
                          className="flex-1 border-green-300 text-green-600 hover:bg-green-50 hover:text-green-700 transition-colors"
                        >
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