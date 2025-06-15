
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Star, 
  StarOff, 
  Eye, 
  Trash2,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  fetchAllProjectSubmissions,
  updateProjectSubmissionStatus,
  toggleProjectFeatured,
  deleteProjectSubmission
} from '../services/adminProjectService';
import ProjectDetailsDialog from './ProjectDetailsDialog';

interface Project {
  id: string;
  title: string;
  description: string;
  github_url: string;
  thumbnail_url: string | null;
  tech_tags: string[] | null;
  status: string;
  admin_feedback: string | null;
  reviewed_at: string | null;
  created_at: string;
  user_id: string;
  reviewed_by: string | null;
  is_featured: boolean;
  author_name: string;
  author_email: string;
  reviewer_name: string | null;
}

const EnhancedProjectManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [projects, searchTerm, statusFilter]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      console.log('Loading projects...');
      const projectsData = await fetchAllProjectSubmissions();
      setProjects(projectsData);
      console.log('Projects loaded successfully:', projectsData.length);
    } catch (error) {
      console.error('Error loading projects:', error);
      toast({
        title: "Error",
        description: "Failed to load projects. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterProjects = () => {
    let filtered = projects;

    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.author_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(project => project.status === statusFilter);
    }

    setFilteredProjects(filtered);
  };

  const handleProjectAction = async (projectId: string, action: 'approve' | 'reject', feedback?: string) => {
    if (!user) return;

    try {
      setActionLoading(projectId);
      await updateProjectSubmissionStatus(projectId, action, user.id, feedback);
      await loadProjects();
      
      toast({
        title: "Success",
        description: `Project ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
      });

      if (selectedProject?.id === projectId) {
        setDialogOpen(false);
        setSelectedProject(null);
      }
    } catch (error) {
      console.error('Error updating project:', error);
      toast({
        title: "Error",
        description: "Failed to update project",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleFeatureToggle = async (projectId: string, makeFeatured: boolean) => {
    if (!user) return;

    try {
      setActionLoading(projectId);
      await toggleProjectFeatured(projectId, makeFeatured, user.id);
      await loadProjects();
      
      toast({
        title: "Success",
        description: `Project ${makeFeatured ? 'featured' : 'unfeatured'} successfully`,
      });
    } catch (error: any) {
      console.error('Error toggling feature:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update featured status",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    try {
      setActionLoading(projectId);
      await deleteProjectSubmission(projectId);
      await loadProjects();
      
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="w-6 h-6 animate-spin mr-2" />
            <span>Loading projects...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Project Management
            <Button onClick={loadProjects} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search projects, authors, or descriptions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{projects.length}</div>
              <div className="text-sm text-blue-600">Total Projects</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {projects.filter(p => p.status === 'pending').length}
              </div>
              <div className="text-sm text-yellow-600">Pending Review</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {projects.filter(p => p.status === 'approved').length}
              </div>
              <div className="text-sm text-green-600">Approved</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {projects.filter(p => p.is_featured).length}
              </div>
              <div className="text-sm text-purple-600">Featured</div>
            </div>
          </div>

          {/* Projects List */}
          {filteredProjects.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No projects found matching your criteria.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {filteredProjects.map((project) => (
                <div key={project.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{project.title}</h3>
                        <Badge className={getStatusColor(project.status)}>
                          {project.status}
                        </Badge>
                        {project.is_featured && (
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {project.description}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>By: {project.author_name}</span>
                        <span>Submitted: {formatDate(project.created_at)}</span>
                        {project.reviewed_at && (
                          <span>Reviewed: {formatDate(project.reviewed_at)}</span>
                        )}
                      </div>
                      
                      {project.tech_tags && project.tech_tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
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
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedProject(project);
                          setDialogOpen(true);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>

                      {project.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleProjectAction(project.id, 'approve')}
                            disabled={actionLoading === project.id}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleProjectAction(project.id, 'reject')}
                            disabled={actionLoading === project.id}
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </>
                      )}

                      {project.status === 'approved' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleFeatureToggle(project.id, !project.is_featured)}
                          disabled={actionLoading === project.id}
                        >
                          {project.is_featured ? (
                            <StarOff className="w-4 h-4" />
                          ) : (
                            <Star className="w-4 h-4" />
                          )}
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteProject(project.id)}
                        disabled={actionLoading === project.id}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <ProjectDetailsDialog
        project={selectedProject}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        loading={actionLoading !== null}
        onProjectAction={handleProjectAction}
      />
    </div>
  );
};

export default EnhancedProjectManagement;
