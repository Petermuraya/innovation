
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Project } from './types';

export const useProjectManagement = (initialProjects: Project[], updateProjectStatus?: (projectId: string, status: string, feedback?: string) => Promise<void>) => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchProjectsWithDetails();
  }, []);

  const fetchProjectsWithDetails = async () => {
    try {
      // First get all projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('project_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (projectsError) throw projectsError;

      if (!projectsData || projectsData.length === 0) {
        setProjects([]);
        return;
      }

      // Get unique user IDs
      const userIds = [...new Set([
        ...projectsData.map(p => p.user_id).filter(Boolean),
        ...projectsData.map(p => p.reviewed_by).filter(Boolean)
      ])];

      // Get member names for these user IDs - using a simpler query to avoid enum conflicts
      const { data: membersData, error: membersError } = await supabase
        .from('members')
        .select('user_id, name')
        .in('user_id', userIds);

      if (membersError) {
        console.error('Error fetching members:', membersError);
        // Continue without member names if this fails
      }

      // Create a mapping of user_id to name
      const memberNamesMap = (membersData || []).reduce((acc, member) => {
        acc[member.user_id] = member.name;
        return acc;
      }, {} as Record<string, string>);

      // Combine the data
      const projectsWithNames = projectsData.map(project => ({
        ...project,
        author_name: memberNamesMap[project.user_id] || 'Unknown',
        reviewer_name: project.reviewed_by ? memberNamesMap[project.reviewed_by] || 'Unknown' : null
      }));

      setProjects(projectsWithNames);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Error",
        description: "Failed to load projects",
        variant: "destructive"
      });
    }
  };

  const handleProjectAction = async (projectId: string, action: 'approve' | 'reject', feedbackText?: string) => {
    if (!user) return;

    setLoading(true);
    try {
      const updateData: any = {
        status: action === 'approve' ? 'approved' : 'rejected',
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (feedbackText?.trim()) {
        updateData.admin_feedback = feedbackText.trim();
      }

      const { error } = await supabase
        .from('project_submissions')
        .update(updateData)
        .eq('id', projectId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Project ${action === 'approve' ? 'approved' : 'rejected'} successfully`
      });

      await fetchProjectsWithDetails();
      if (updateProjectStatus) {
        await updateProjectStatus(projectId, updateData.status, feedbackText);
      }
    } catch (error) {
      console.error('Error updating project:', error);
      toast({
        title: "Error",
        description: "Failed to update project",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFeatureToggle = async (projectId: string, makeFeatured: boolean) => {
    if (!user) return;

    try {
      const { error } = await supabase.rpc('manage_featured_project', {
        project_id: projectId,
        make_featured: makeFeatured,
        admin_id: user.id
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: makeFeatured ? "Project featured successfully" : "Project unfeatured successfully"
      });

      await fetchProjectsWithDetails();
    } catch (error: any) {
      console.error('Error toggling feature:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update featured status",
        variant: "destructive"
      });
    }
  };

  return {
    projects,
    loading,
    handleProjectAction,
    handleFeatureToggle,
    fetchProjectsWithDetails
  };
};
