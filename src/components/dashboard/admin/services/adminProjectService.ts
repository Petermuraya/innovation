
import { supabase } from '@/integrations/supabase/client';

export const fetchAllProjectSubmissions = async () => {
  try {
    console.log('Fetching all project submissions...');
    
    // First get all project submissions
    const { data: projectsData, error: projectsError } = await supabase
      .from('project_submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (projectsError) {
      console.error('Error fetching project submissions:', projectsError);
      throw projectsError;
    }

    console.log('Project submissions fetched:', projectsData?.length || 0);

    if (!projectsData || projectsData.length === 0) {
      return [];
    }

    // Get unique user IDs from projects
    const userIds = [...new Set([
      ...projectsData.map(p => p.user_id).filter(Boolean),
      ...projectsData.map(p => p.reviewed_by).filter(Boolean)
    ])];

    console.log('User IDs to fetch:', userIds);

    // Get member data for these user IDs
    const { data: membersData, error: membersError } = await supabase
      .from('members')
      .select('user_id, name, email')
      .in('user_id', userIds);

    if (membersError) {
      console.error('Error fetching members for projects:', membersError);
      // Continue without member names if this fails
    }

    console.log('Members data fetched:', membersData?.length || 0);

    // Create a mapping of user_id to member data
    const memberDataMap = (membersData || []).reduce((acc, member) => {
      acc[member.user_id] = member;
      return acc;
    }, {} as Record<string, { name: string; email: string }>);

    // Combine the data
    const projectsWithNames = projectsData.map(project => {
      const authorData = memberDataMap[project.user_id];
      const reviewerData = project.reviewed_by ? memberDataMap[project.reviewed_by] : null;
      
      return {
        ...project,
        author_name: authorData?.name || 'Unknown User',
        author_email: authorData?.email || '',
        reviewer_name: reviewerData?.name || null
      };
    });

    console.log('Projects with author names prepared:', projectsWithNames.length);
    return projectsWithNames;
  } catch (error) {
    console.error('Error in fetchAllProjectSubmissions:', error);
    return [];
  }
};

export const updateProjectSubmissionStatus = async (
  projectId: string, 
  status: 'approved' | 'rejected', 
  reviewerId: string,
  feedback?: string
) => {
  try {
    const updateData: any = {
      status,
      reviewed_by: reviewerId,
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (feedback?.trim()) {
      updateData.admin_feedback = feedback.trim();
    }

    const { error } = await supabase
      .from('project_submissions')
      .update(updateData)
      .eq('id', projectId);

    if (error) throw error;

    console.log(`Project ${projectId} ${status} successfully`);
    return true;
  } catch (error) {
    console.error('Error updating project status:', error);
    throw error;
  }
};

export const toggleProjectFeatured = async (projectId: string, makeFeatured: boolean, adminId: string) => {
  try {
    const { error } = await supabase.rpc('manage_featured_project', {
      project_id: projectId,
      make_featured: makeFeatured,
      admin_id: adminId
    });

    if (error) throw error;

    console.log(`Project ${projectId} ${makeFeatured ? 'featured' : 'unfeatured'} successfully`);
    return true;
  } catch (error) {
    console.error('Error toggling project featured status:', error);
    throw error;
  }
};

export const deleteProjectSubmission = async (projectId: string) => {
  try {
    const { error } = await supabase
      .from('project_submissions')
      .delete()
      .eq('id', projectId);

    if (error) throw error;

    console.log(`Project ${projectId} deleted successfully`);
    return true;
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};
