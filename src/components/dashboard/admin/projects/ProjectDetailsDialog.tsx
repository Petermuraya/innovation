
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  XCircle, 
  ExternalLink,
  Star,
  AlertCircle
} from 'lucide-react';
import { Project } from './types';
import { getStatusIcon, getStatusColor, formatDate } from './projectUtils';

interface ProjectDetailsDialogProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loading: boolean;
  onProjectAction: (projectId: string, action: 'approve' | 'reject', feedback?: string) => void;
}

const ProjectDetailsDialog = ({ 
  project, 
  open, 
  onOpenChange, 
  loading, 
  onProjectAction 
}: ProjectDetailsDialogProps) => {
  const [feedback, setFeedback] = useState('');

  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {project.title}
            {project.is_featured && (
              <Star className="w-5 h-5 text-yellow-500 fill-current" />
            )}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Description</label>
                  <p className="text-gray-800">{project.description}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Author</label>
                  <p className="text-gray-800">{project.author_name}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">GitHub Repository</label>
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Repository
                  </a>
                </div>
                
                {project.tech_tags && project.tech_tags.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Technologies</label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {project.tech_tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Review Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Current Status</label>
                  <div className="mt-1">
                    <Badge className={getStatusColor(project.status)}>
                      {getStatusIcon(project.status)}
                      <span className="ml-1 capitalize">{project.status}</span>
                    </Badge>
                  </div>
                </div>
                
                {project.reviewer_name && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Reviewed By</label>
                    <p className="text-gray-800">{project.reviewer_name}</p>
                    {project.reviewed_at && (
                      <p className="text-sm text-gray-600">
                        on {formatDate(project.reviewed_at)}
                      </p>
                    )}
                  </div>
                )}
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Submitted</label>
                  <p className="text-gray-800">{formatDate(project.created_at)}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {project.admin_feedback && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Previous Feedback:</strong> {project.admin_feedback}
              </AlertDescription>
            </Alert>
          )}

          {project.status === 'pending' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Review Project</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Feedback (Optional)</label>
                  <Textarea
                    placeholder="Provide feedback for the project author..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={3}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={() => onProjectAction(project.id, 'approve', feedback)}
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve Project
                  </Button>
                  <Button
                    onClick={() => onProjectAction(project.id, 'reject', feedback)}
                    disabled={loading}
                    variant="destructive"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject Project
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDetailsDialog;
