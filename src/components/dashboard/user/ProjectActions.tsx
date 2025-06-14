
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Edit, RefreshCw } from 'lucide-react';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Project {
  id: string;
  title: string;
  description: string;
  github_url: string;
  thumbnail_url: string | null;
  tech_tags: string[] | null;
  status: string;
  admin_notes: string | null;
  admin_feedback: string | null;
  reviewed_at: string | null;
  created_at: string;
}

interface ProjectActionsProps {
  project: Project;
  onUpdate: () => void;
  onEdit: (project: Project) => void;
}

const ProjectActions = ({ project, onUpdate, onEdit }: ProjectActionsProps) => {
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isResubmitting, setIsResubmitting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('project_submissions')
        .delete()
        .eq('id', project.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Project deleted successfully",
      });

      onUpdate();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleResubmit = async () => {
    setIsResubmitting(true);
    try {
      const { error } = await supabase
        .from('project_submissions')
        .update({
          status: 'pending',
          reviewed_by: null,
          reviewed_at: null,
          admin_notes: null,
          admin_feedback: null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', project.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Project resubmitted for review",
      });

      onUpdate();
    } catch (error) {
      console.error('Error resubmitting project:', error);
      toast({
        title: "Error",
        description: "Failed to resubmit project",
        variant: "destructive",
      });
    } finally {
      setIsResubmitting(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => onEdit(project)}
        className="flex items-center gap-1"
      >
        <Edit className="w-4 h-4" />
        Edit
      </Button>

      {(project.status === 'rejected' || project.status === 'approved') && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleResubmit}
          disabled={isResubmitting}
          className="flex items-center gap-1"
        >
          <RefreshCw className={`w-4 h-4 ${isResubmitting ? 'animate-spin' : ''}`} />
          {isResubmitting ? 'Resubmitting...' : 'Resubmit'}
        </Button>
      )}

      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => setShowDeleteDialog(true)}
        className="flex items-center gap-1 text-red-600 hover:text-red-700"
      >
        <Trash2 className="w-4 h-4" />
        Delete
      </Button>

      <ConfirmDialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Project"
        description="Are you sure you want to delete this project? This action cannot be undone."
      />
    </div>
  );
};

export default ProjectActions;
