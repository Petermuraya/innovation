
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { FolderOpen, Github, ExternalLink } from 'lucide-react';
import BackToDashboard from './BackToDashboard';
import { useCommunityPointTracking } from '@/hooks/useCommunityPointTracking';

interface CommunityProjectsTabProps {
  communityId: string;
  isAdmin?: boolean;
}

const CommunityProjectsTab = ({ communityId, isAdmin = false }: CommunityProjectsTabProps) => {
  const { toast } = useToast();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Track dashboard visit when this tab is accessed
  useCommunityPointTracking(communityId);

  const fetchCommunityProjects = async () => {
    try {
      // First, get the community projects relationships
      const { data: communityProjects, error: communityProjectsError } = await supabase
        .from('community_projects')
        .select('project_id, status, approved_at')
        .eq('community_id', communityId);

      if (communityProjectsError) throw communityProjectsError;

      if (!communityProjects || communityProjects.length === 0) {
        setProjects([]);
        return;
      }

      // Get project IDs from community projects
      const projectIds = communityProjects.map(cp => cp.project_id);

      // Fetch project details for these project IDs
      const { data: projectDetails, error: projectsError } = await supabase
        .from('project_submissions')
        .select(`
          id,
          title,
          description,
          github_url,
          tech_tags,
          created_at,
          user_id,
          status
        `)
        .in('id', projectIds);

      if (projectsError) throw projectsError;

      // Get user IDs to fetch member details
      const userIds = projectDetails?.map(p => p.user_id).filter(Boolean) || [];
      
      let memberDetails = [];
      if (userIds.length > 0) {
        const { data: members, error: membersError } = await supabase
          .from('members')
          .select('user_id, name, email')
          .in('user_id', userIds);

        if (membersError) {
          console.error('Error fetching member details:', membersError);
        } else {
          memberDetails = members || [];
        }
      }

      // Combine project data with community project data and member details
      const combinedData = projectDetails?.map(project => {
        const communityProject = communityProjects.find(cp => cp.project_id === project.id);
        const member = memberDetails.find(m => m.user_id === project.user_id);
        
        return {
          ...project,
          community_status: communityProject?.status || 'pending',
          approved_at: communityProject?.approved_at,
          author_name: member?.name || 'Unknown',
          author_email: member?.email || 'Unknown'
        };
      }) || [];

      setProjects(combinedData);
    } catch (error) {
      console.error('Error fetching community projects:', error);
      toast({
        title: "Error",
        description: "Failed to load community projects",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunityProjects();
  }, [communityId]);

  if (loading) {
    return <div className="text-center py-8">Loading projects...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <BackToDashboard />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5" />
            Community Projects ({projects.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <h4 className="font-medium text-kic-gray">{project.title}</h4>
                    <p className="text-sm text-gray-600">{project.description}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>By: {project.author_name}</span>
                      <span>•</span>
                      <span>{new Date(project.created_at).toLocaleDateString()}</span>
                    </div>
                    {project.tech_tags && project.tech_tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {project.tech_tags.map((tag: string) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-kic-blue hover:underline"
                      >
                        <Github className="w-4 h-4" />
                        View Code
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Badge variant={project.community_status === 'approved' ? 'default' : 'secondary'}>
                      {project.community_status}
                    </Badge>
                    <Badge variant={project.status === 'approved' ? 'default' : 'outline'}>
                      Project: {project.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
            {projects.length === 0 && (
              <div className="text-center py-8">
                <FolderOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Projects</h3>
                <p className="text-gray-500">This community doesn't have any projects yet.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunityProjectsTab;
