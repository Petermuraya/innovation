
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Heart, Eye, Github, Play } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  github_url: string | null;
  demo_video_url: string | null;
  tech_stack: string[];
  author_name: string;
  avg_rating: number;
  rating_count: number;
  view_count: number;
  created_at: string;
}

const ProjectShowcase = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRatings, setUserRatings] = useState<{[key: string]: number}>({});

  useEffect(() => {
    fetchProjects();
    if (user) {
      fetchUserRatings();
    }
  }, [user]);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('featured_projects')
        .select('*')
        .limit(12);
      
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

  const fetchUserRatings = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('project_ratings')
        .select('project_id, rating')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      const ratings = data?.reduce((acc, rating) => {
        acc[rating.project_id] = rating.rating;
        return acc;
      }, {} as {[key: string]: number}) || {};
      
      setUserRatings(ratings);
    } catch (error) {
      console.error('Error fetching user ratings:', error);
    }
  };

  const rateProject = async (projectId: string, rating: number) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to rate projects",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('project_ratings')
        .upsert({
          project_id: projectId,
          user_id: user.id,
          rating: rating
        });

      if (error) throw error;

      setUserRatings(prev => ({ ...prev, [projectId]: rating }));
      await fetchProjects(); // Refresh to get updated ratings
      
      toast({
        title: "Rating submitted",
        description: "Thank you for your feedback!",
      });
    } catch (error) {
      console.error('Error rating project:', error);
      toast({
        title: "Error",
        description: "Failed to submit rating",
        variant: "destructive",
      });
    }
  };

  const incrementViewCount = async (projectId: string) => {
    try {
      await supabase.rpc('increment_project_views', { project_id: projectId });
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading projects...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-kic-gray mb-4">Featured Projects</h2>
        <p className="text-kic-gray/70 max-w-2xl mx-auto">
          Discover innovative projects created by our community members. Rate and provide feedback to help fellow innovators improve their work.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              {project.image_url && (
                <div className="w-full h-48 bg-gray-200 rounded-lg overflow-hidden mb-4">
                  <img 
                    src={project.image_url} 
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              )}
              <CardTitle className="text-xl">{project.title}</CardTitle>
              <p className="text-sm text-gray-600">by {project.author_name}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 line-clamp-3">{project.description}</p>
              
              <div className="flex flex-wrap gap-1">
                {project.tech_stack?.map((tech, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>{project.avg_rating.toFixed(1)} ({project.rating_count})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{project.view_count}</span>
                  </div>
                </div>
              </div>

              {user && (
                <div className="flex items-center gap-1">
                  <span className="text-sm">Rate:</span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => rateProject(project.id, star)}
                      className="text-yellow-500 hover:text-yellow-600"
                    >
                      <Star 
                        className={`w-4 h-4 ${
                          userRatings[project.id] >= star ? 'fill-current' : ''
                        }`}
                      />
                    </button>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                {project.github_url && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    asChild
                    onClick={() => incrementViewCount(project.id)}
                  >
                    <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4 mr-1" />
                      Code
                    </a>
                  </Button>
                )}
                {project.demo_video_url && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    asChild
                    onClick={() => incrementViewCount(project.id)}
                  >
                    <a href={project.demo_video_url} target="_blank" rel="noopener noreferrer">
                      <Play className="w-4 h-4 mr-1" />
                      Demo
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProjectShowcase;
