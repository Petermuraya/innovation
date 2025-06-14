import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  Calendar, 
  ExternalLink,
  Star,
  StarOff,
  AlertCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

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
  reviewed_by: string | null;
  created_at: string;
  user_id: string;
  is_featured: boolean;
  featured_by: string | null;
  featured_at: string | null;
  author_name?: string;
  reviewer_name?: string;
}

interface ProjectsManagementProps {
  projects: Project[];
  updateProjectStatus: (projectId: string, status: string, feedback?: string) => Promise<void>;
}

const ProjectsManagement = ({ projects: initialProjects, updateProjectStatus }: ProjectsManagementProps) => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [feedback, setFeedback] = useState('');
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

      // Get member names for these user IDs
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Projects Management</h2>
        <div className="text-sm text-gray-600">
          Total Projects: {projects.length}
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reviewed By</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">{project.title}</div>
                    <div className="text-sm text-gray-600 line-clamp-2">
                      {project.description}
                    </div>
                    {project.tech_tags && project.tech_tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {project.tech_tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {project.tech_tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{project.tech_tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{project.author_name}</span>
                  </div>
                </TableCell>
                
                <TableCell>
                  <Badge className={getStatusColor(project.status)}>
                    {getStatusIcon(project.status)}
                    <span className="ml-1 capitalize">{project.status}</span>
                  </Badge>
                </TableCell>
                
                <TableCell>
                  {project.reviewer_name ? (
                    <div className="text-sm">
                      <div className="font-medium">{project.reviewer_name}</div>
                      {project.reviewed_at && (
                        <div className="text-gray-500">
                          {formatDate(project.reviewed_at)}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">Not reviewed</span>
                  )}
                </TableCell>
                
                <TableCell>
                  {project.status === 'approved' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleFeatureToggle(project.id, !project.is_featured)}
                      className="p-1"
                    >
                      {project.is_featured ? (
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      ) : (
                        <StarOff className="w-4 h-4 text-gray-400" />
                      )}
                    </Button>
                  )}
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Calendar className="w-3 h-3" />
                    {formatDate(project.created_at)}
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedProject(project);
                            setFeedback(project.admin_feedback || '');
                          }}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh]">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            {selectedProject?.title}
                            {selectedProject?.is_featured && (
                              <Star className="w-5 h-5 text-yellow-500 fill-current" />
                            )}
                          </DialogTitle>
                        </DialogHeader>
                        
                        {selectedProject && (
                          <div className="space-y-6 max-h-[70vh] overflow-y-auto">
                            <div className="grid grid-cols-2 gap-4">
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-lg">Project Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                  <div>
                                    <label className="text-sm font-medium text-gray-600">Description</label>
                                    <p className="text-gray-800">{selectedProject.description}</p>
                                  </div>
                                  
                                  <div>
                                    <label className="text-sm font-medium text-gray-600">Author</label>
                                    <p className="text-gray-800">{selectedProject.author_name}</p>
                                  </div>
                                  
                                  <div>
                                    <label className="text-sm font-medium text-gray-600">GitHub Repository</label>
                                    <a
                                      href={selectedProject.github_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                                    >
                                      <ExternalLink className="w-4 h-4" />
                                      View Repository
                                    </a>
                                  </div>
                                  
                                  {selectedProject.tech_tags && selectedProject.tech_tags.length > 0 && (
                                    <div>
                                      <label className="text-sm font-medium text-gray-600">Technologies</label>
                                      <div className="flex flex-wrap gap-1 mt-1">
                                        {selectedProject.tech_tags.map((tag) => (
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
                                      <Badge className={getStatusColor(selectedProject.status)}>
                                        {getStatusIcon(selectedProject.status)}
                                        <span className="ml-1 capitalize">{selectedProject.status}</span>
                                      </Badge>
                                    </div>
                                  </div>
                                  
                                  {selectedProject.reviewer_name && (
                                    <div>
                                      <label className="text-sm font-medium text-gray-600">Reviewed By</label>
                                      <p className="text-gray-800">{selectedProject.reviewer_name}</p>
                                      {selectedProject.reviewed_at && (
                                        <p className="text-sm text-gray-600">
                                          on {formatDate(selectedProject.reviewed_at)}
                                        </p>
                                      )}
                                    </div>
                                  )}
                                  
                                  <div>
                                    <label className="text-sm font-medium text-gray-600">Submitted</label>
                                    <p className="text-gray-800">{formatDate(selectedProject.created_at)}</p>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>

                            {selectedProject.admin_feedback && (
                              <Alert>
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                  <strong>Previous Feedback:</strong> {selectedProject.admin_feedback}
                                </AlertDescription>
                              </Alert>
                            )}

                            {selectedProject.status === 'pending' && (
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
                                      onClick={() => handleProjectAction(selectedProject.id, 'approve', feedback)}
                                      disabled={loading}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      <CheckCircle className="w-4 h-4 mr-2" />
                                      Approve Project
                                    </Button>
                                    <Button
                                      onClick={() => handleProjectAction(selectedProject.id, 'reject', feedback)}
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
                        )}
                      </DialogContent>
                    </Dialog>

                    {project.status === 'pending' && (
                      <div className="flex gap-1">
                        <Button
                          onClick={() => handleProjectAction(project.id, 'approve')}
                          disabled={loading}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-3 h-3" />
                        </Button>
                        <Button
                          onClick={() => handleProjectAction(project.id, 'reject')}
                          disabled={loading}
                          size="sm"
                          variant="destructive"
                        >
                          <XCircle className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {projects.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Clock className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Projects Found</h3>
            <p className="text-gray-600">No project submissions available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsManagement;
