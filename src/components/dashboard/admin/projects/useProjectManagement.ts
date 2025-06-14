
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
    setLoading(true);
    try {
      console.log('Fetching projects with details...');
      
      // First get all projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('project_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (projectsError) {
        console.error('Error fetching projects:', projectsError);
        throw projectsError;
      }

      console.log('Projects data:', projectsData);

      if (!projectsData || projectsData.length === 0) {
        console.log('No projects found');
        setProjects([]);
        return;
      }

      // Get unique user IDs from projects
      const userIds = [...new Set([
        ...projectsData.map(p => p.user_id).filter(Boolean),
        ...projectsData.map(p => p.reviewed_by).filter(Boolean)
      ])];

      console.log('User IDs to fetch:', userIds);

      // Get member data for these user IDs with only approved members
      const { data: membersData, error: membersError } = await supabase
        .from('members')
        .select('user_id, name, email')
        .in('user_id', userIds)
        .eq('registration_status', 'approved');

      if (membersError) {
        console.error('Error fetching members:', membersError);
        // Continue without member names if this fails
      }

      console.log('Members data:', membersData);

      // Create a mapping of user_id to member data
      const memberDataMap = (membersData || []).reduce((acc, member) => {
        acc[member.user_id] = member;
        return acc;
      }, {} as Record<string, { name: string; email: string }>);

      console.log('Member data map:', memberDataMap);

      // Combine the data
      const projectsWithNames = projectsData.map(project => {
        const authorData = memberDataMap[project.user_id];
        const reviewerData = project.reviewed_by ? memberDataMap[project.reviewed_by] : null;
        
        return {
          ...project,
          author_name: authorData?.name || 'Unknown User',
          reviewer_name: reviewerData?.name || null
        };
      });

      console.log('Projects with names:', projectsWithNames);
      setProjects(projectsWithNames);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Error",
        description: "Failed to load projects. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
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
