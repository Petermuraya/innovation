
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Eye, 
  CheckCircle, 
  XCircle, 
  User, 
  Calendar,
  Star,
  StarOff
} from 'lucide-react';
import { Project } from './types';
import { getStatusIcon, getStatusColor, formatDate } from './projectUtils';

interface ProjectsTableProps {
  projects: Project[];
  loading: boolean;
  onViewProject: (project: Project) => void;
  onProjectAction: (projectId: string, action: 'approve' | 'reject') => void;
  onFeatureToggle: (projectId: string, makeFeatured: boolean) => void;
}

const ProjectsTable = ({ 
  projects, 
  loading, 
  onViewProject, 
  onProjectAction, 
  onFeatureToggle 
}: ProjectsTableProps) => {
  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <Eye className="w-12 h-12 mx-auto" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Projects Found</h3>
        <p className="text-gray-600">No project submissions available at the moment.</p>
      </div>
    );
  }

  return (
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
                    onClick={() => onFeatureToggle(project.id, !project.is_featured)}
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewProject(project)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>

                  {project.status === 'pending' && (
                    <div className="flex gap-1">
                      <Button
                        onClick={() => onProjectAction(project.id, 'approve')}
                        disabled={loading}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-3 h-3" />
                      </Button>
                      <Button
                        onClick={() => onProjectAction(project.id, 'reject')}
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
    </div>
  );
};

export default ProjectsTable;
