
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, MessageCircle, Eye, Calendar, User, Search, Filter, ExternalLink, Github } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Project {
  id: string;
  title: string;
  description: string;
  github_url: string | null;
  thumbnail_url: string | null;
  tech_tags: string[] | null;
  status: string;
  created_at: string;
  updated_at: string;
  user_id: string | null;
  author_name?: string;
  likes_count?: number;
  comments_count?: number;
  engagement_score?: number;
  admin_notes?: string;
  is_liked?: boolean;
}

const ProjectShowcase = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTech, setSelectedTech] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('approved');
  const [allTechs, setAllTechs] = useState<string[]>([]);

  useEffect(() => {
    fetchProjects();
    fetchTechs();
  }, [selectedStatus]);

  const fetchProjects = async () => {
    try {
      const { data: projectsData, error } = await supabase
        .from('project_leaderboard')
        .select('*')
        .eq('status', selectedStatus)
        .order('engagement_score', { ascending: false });

      if (error) throw error;

      // Enrich projects with interaction counts and user like status
      const enrichedProjects = await Promise.all(
        (projectsData || []).map(async (project) => {
          // Check if current user liked this project
          let isLiked = false;
          if (user) {
            const { data: like } = await supabase
              .from('project_likes')
              .select('id')
              .eq('project_id', project.id)
              .eq('user_id', user.id)
              .single();
            isLiked = !!like;
          }

          return {
            ...project,
            is_liked: isLiked,
          };
        })
      );

      setProjects(enrichedProjects);
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

  const fetchTechs = async () => {
    try {
      const { data, error } = await supabase
        .from('project_submissions')
        .select('tech_tags')
        .eq('status', 'approved');

      if (error) throw error;

      const techSet = new Set<string>();
      data?.forEach(project => {
        if (project.tech_tags) {
          project.tech_tags.forEach((tech: string) => techSet.add(tech));
        }
      });

      setAllTechs(Array.from(techSet));
    } catch (error) {
      console.error('Error fetching technologies:', error);
    }
  };

  const toggleLike = async (projectId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to like projects",
        variant: "destructive",
      });
      return;
    }

    try {
      const project = projects.find(p => p.id === projectId);
      if (!project) return;

      if (project.is_liked) {
        // Unlike
        await supabase
          .from('project_likes')
          .delete()
          .eq('project_id', projectId)
          .eq('user_id', user.id);
      } else {
        // Like
        await supabase
          .from('project_likes')
          .insert({
            project_id: projectId,
            user_id: user.id,
          });
      }

      // Refresh projects to update counts
      await fetchProjects();
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like",
        variant: "destructive",
      });
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (project.author_name && project.author_name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTech = selectedTech === 'all' || 
                       (project.tech_tags && project.tech_tags.includes(selectedTech));
    
    return matchesSearch && matchesTech;
  });

  if (loading) {
    return <div className="text-center py-8">Loading projects...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-kic-gray">Project Showcase</h1>
        <p className="text-kic-gray/70">Discover amazing projects built by our community</p>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <Select value={selectedTech} onValueChange={setSelectedTech}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by tech" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Technologies</SelectItem>
              {allTechs.map((tech) => (
                <SelectItem key={tech} value={tech}>{tech}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Project status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg line-clamp-2">{project.title}</CardTitle>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {project.author_name || 'Anonymous'}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(project.created_at).toLocaleDateString()}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 line-clamp-3">{project.description}</p>

              {project.tech_tags && project.tech_tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {project.tech_tags.slice(0, 4).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {project.tech_tags.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{project.tech_tags.length - 4} more
                    </Badge>
                  )}
                </div>
              )}

              {project.admin_notes && (
                <div className="p-2 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                  <p className="text-xs text-yellow-800">
                    <strong>Admin Notes:</strong> {project.admin_notes}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleLike(project.id)}
                    className={`flex items-center gap-1 ${project.is_liked ? 'text-red-500' : ''}`}
                  >
                    <Heart className={`h-4 w-4 ${project.is_liked ? 'fill-current' : ''}`} />
                    {project.likes_count || 0}
                  </Button>
                  <div className="flex items-center gap-1 text-gray-500">
                    <MessageCircle className="h-4 w-4" />
                    {project.comments_count || 0}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {project.github_url && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredProjects.length === 0 && (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-600">No projects match your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectShowcase;
