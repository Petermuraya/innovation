
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, Star, MessageSquare, Github, ExternalLink, Search, Filter, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import ProjectInteractions from './ProjectInteractions';

interface Project {
  id: string;
  title: string;
  description: string;
  github_url: string | null;
  demo_video_url: string | null;
  image_url: string | null;
  tech_stack: string[] | null;
  view_count: number | null;
  featured: boolean | null;
  created_at: string;
  user_id: string;
  author_name?: string;
  avg_rating?: number;
  rating_count?: number;
}

interface ProjectSubmission {
  id: string;
  title: string;
  description: string;
  github_url: string;
  thumbnail_url: string | null;
  tech_tags: string[] | null;
  status: string | null;
  created_at: string;
  user_id: string | null;
  author_name?: string;
  likes_count?: number;
  comments_count?: number;
  engagement_score?: number;
}

const ProjectShowcase = () => {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [submittedProjects, setSubmittedProjects] = useState<ProjectSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTech, setSelectedTech] = useState('all');
  const [allTechTags, setAllTechTags] = useState<string[]>([]);

  useEffect(() => {
    fetchProjects();
    fetchTechTags();
  }, []);

  const fetchProjects = async () => {
    try {
      // Fetch featured projects
      const { data: featured, error: featuredError } = await supabase
        .from('featured_projects')
        .select('*')
        .eq('featured', true)
        .order('created_at', { ascending: false });

      if (featuredError) throw featuredError;

      // Fetch project submissions from leaderboard view
      const { data: submissions, error: submissionsError } = await supabase
        .from('project_leaderboard')
        .select('*')
        .eq('status', 'approved')
        .order('engagement_score', { ascending: false });

      if (submissionsError) throw submissionsError;

      setFeaturedProjects(featured || []);
      setSubmittedProjects(submissions || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTechTags = async () => {
    try {
      // Get tech tags from both featured projects and submissions
      const { data: featuredTech } = await supabase
        .from('projects')
        .select('tech_stack');

      const { data: submissionTech } = await supabase
        .from('project_submissions')
        .select('tech_tags');

      const techSet = new Set<string>();
      
      featuredTech?.forEach(project => {
        if (project.tech_stack) {
          project.tech_stack.forEach((tech: string) => techSet.add(tech));
        }
      });

      submissionTech?.forEach(project => {
        if (project.tech_tags) {
          project.tech_tags.forEach((tech: string) => techSet.add(tech));
        }
      });

      setAllTechTags(Array.from(techSet));
    } catch (error) {
      console.error('Error fetching tech tags:', error);
    }
  };

  const incrementProjectViews = async (projectId: string) => {
    try {
      // Update view count for featured projects
      await supabase
        .from('projects')
        .update({ view_count: supabase.sql`view_count + 1` })
        .eq('id', projectId);
    } catch (error) {
      console.error('Error incrementing views:', error);
    }
  };

  const filteredFeaturedProjects = featuredProjects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (project.author_name && project.author_name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTech = selectedTech === 'all' || 
                       (project.tech_stack && project.tech_stack.includes(selectedTech));
    
    return matchesSearch && matchesTech;
  });

  const filteredSubmissions = submittedProjects.filter(project => {
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
      <div className="text-center">
        <h1 className="text-4xl font-bold text-kic-gray mb-4">Project Showcase</h1>
        <p className="text-xl text-kic-gray/70 max-w-3xl mx-auto">
          Discover amazing projects built by our community members and get inspired for your next innovation.
        </p>
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
              {allTechTags.map((tech) => (
                <SelectItem key={tech} value={tech}>{tech}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="featured" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="featured">Featured Projects</TabsTrigger>
          <TabsTrigger value="community">Community Submissions</TabsTrigger>
        </TabsList>

        <TabsContent value="featured">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFeaturedProjects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                {project.image_url && (
                  <div className="aspect-video overflow-hidden rounded-t-lg">
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                    <Badge variant="default">Featured</Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    by {project.author_name || 'Anonymous'}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700 text-sm">{project.description}</p>
                  
                  {project.tech_stack && project.tech_stack.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {project.tech_stack.map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {project.view_count || 0}
                      </span>
                      {project.avg_rating && (
                        <span className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          {project.avg_rating.toFixed(1)} ({project.rating_count})
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {project.github_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        onClick={() => incrementProjectViews(project.id)}
                      >
                        <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                          <Github className="h-4 w-4 mr-1" />
                          Code
                        </a>
                      </Button>
                    )}
                    {project.demo_video_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        onClick={() => incrementProjectViews(project.id)}
                      >
                        <a href={project.demo_video_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Demo
                        </a>
                      </Button>
                    )}
                  </div>

                  <ProjectInteractions projectId={project.id} />
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredFeaturedProjects.length === 0 && (
            <div className="text-center py-12">
              <Star className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No featured projects found</h3>
              <p className="text-gray-500">Try adjusting your search filters.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="community">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSubmissions.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                {project.thumbnail_url && (
                  <div className="aspect-video overflow-hidden rounded-t-lg">
                    <img
                      src={project.thumbnail_url}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                  <p className="text-sm text-gray-600">
                    by {project.author_name || 'Anonymous'}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700 text-sm">{project.description}</p>
                  
                  {project.tech_tags && project.tech_tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {project.tech_tags.map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        {project.comments_count || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        {project.engagement_score || 0}
                      </span>
                    </div>
                    <span className="text-xs">
                      {new Date(project.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="w-full"
                  >
                    <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                      <Github className="h-4 w-4 mr-1" />
                      View Code
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredSubmissions.length === 0 && (
            <div className="text-center py-12">
              <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No community projects found</h3>
              <p className="text-gray-500">Try adjusting your search filters.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectShowcase;
