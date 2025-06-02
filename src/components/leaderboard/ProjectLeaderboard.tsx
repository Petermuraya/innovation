
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Code2, Heart, MessageCircle, Star, Github, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ProjectRank {
  id: string;
  title: string;
  description: string;
  author_name: string;
  github_url: string | null;
  thumbnail_url: string | null;
  tech_tags: string[];
  likes_count: number;
  comments_count: number;
  engagement_score: number;
  status: string;
}

const ProjectLeaderboard = () => {
  const [projects, setProjects] = useState<ProjectRank[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('project_leaderboard')
        .select('*')
        .eq('status', 'approved')
        .order('engagement_score', { ascending: false })
        .limit(10);

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching project leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Code2 className="h-6 w-6 text-blue-500" />
            <span>Top Projects</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading projects...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Code2 className="h-6 w-6 text-blue-500" />
          <span>Top Projects</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className={`border rounded-lg p-6 transition-colors ${
                index < 3 ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200' : 'bg-white hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant={index < 3 ? "default" : "secondary"}>
                      #{index + 1}
                    </Badge>
                    <h3 className="text-xl font-semibold text-kic-gray">{project.title}</h3>
                  </div>
                  <p className="text-sm text-kic-gray/70 mb-2">by {project.author_name}</p>
                  <p className="text-kic-gray/80 mb-4 line-clamp-2">{project.description}</p>
                </div>
                
                {project.thumbnail_url && (
                  <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden ml-4">
                    <img 
                      src={project.thumbnail_url} 
                      alt={project.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {project.tech_tags?.map((tag, tagIndex) => (
                  <Badge key={tagIndex} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Heart className="w-4 h-4 text-red-500" />
                    <span>{project.likes_count}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <MessageCircle className="w-4 h-4 text-blue-500" />
                    <span>{project.comments_count}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>{project.engagement_score} pts</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  {project.github_url && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                        <Github className="w-4 h-4 mr-1" />
                        Code
                      </a>
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    <ExternalLink className="w-4 h-4 mr-1" />
                    View
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-8 text-kic-gray/70">
            <Code2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>No projects available yet</p>
            <p className="text-sm">Submit your projects to see them featured here!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectLeaderboard;
