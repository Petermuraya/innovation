
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import ProjectSubmissionSection from './ProjectSubmissionSection';
import ProjectTabs from './ProjectTabs';

interface Project {
  id: string;
  title: string;
  description: string;
  github_url: string;
  live_demo_url?: string;
  thumbnail_url: string | null;
  tech_tags: string[] | null;
  status: string;
  admin_notes: string | null;
  admin_feedback: string | null;
  reviewed_at: string | null;
  created_at: string;
}

const UserProjectsManager = () => {
  const { member } = useAuth();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const fetchProjects = async () => {
    if (!member) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('project_submissions')
        .select('*')
        .eq('user_id', member.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Error",
        description: "Failed to load your projects",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [member]);

  const handleEdit = (project: Project) => {
    setEditingProject(project);
  };

  if (loading) {
    return <div className="text-center py-8">Loading your projects...</div>;
  }

  return (
    <div className="space-y-6">
      <ProjectSubmissionSection onProjectSubmitted={fetchProjects} />
      
      <div>
        <h3 className="text-xl font-semibold mb-4">My Projects ({projects.length})</h3>
        <ProjectTabs 
          projects={projects} 
          onUpdate={fetchProjects} 
          onEdit={handleEdit}
        />
      </div>
    </div>
  );
};

export default UserProjectsManager;
