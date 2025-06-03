
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock, Eye, Users, Shield } from 'lucide-react';

interface AdminRequestCardProps {
  request: {
    id: string;
    name: string;
    email: string;
    status: string;
    admin_type: string;
    admin_code?: string;
    community_groups?: {
      name: string;
    };
    created_at: string;
    reviewed_at?: string;
  };
  onSelect: (request: any) => void;
}

const AdminRequestCard = ({ request, onSelect }: AdminRequestCardProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="flex items-center gap-1"><Clock className="h-3 w-3" />Pending</Badge>;
      case 'approved':
        return <Badge className="flex items-center gap-1 bg-green-500 hover:bg-green-600"><CheckCircle className="h-3 w-3" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="flex items-center gap-1"><XCircle className="h-3 w-3" />Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getAdminTypeBadge = (adminType: string) => {
    switch (adminType) {
      case 'general':
        return <Badge variant="outline" className="flex items-center gap-1"><Shield className="h-3 w-3" />General Admin</Badge>;
      case 'community':
        return <Badge variant="outline" className="flex items-center gap-1"><Users className="h-3 w-3" />Community Admin</Badge>;
      default:
        return <Badge variant="outline">{adminType}</Badge>;
    }
  };

  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-medium">{request.name}</h4>
            {getStatusBadge(request.status)}
            {getAdminTypeBadge(request.admin_type)}
          </div>
          
          <p className="text-sm text-muted-foreground mb-2">{request.email}</p>
          
          {request.community_groups?.name && (
            <p className="text-sm text-muted-foreground mb-2">
              <strong>Community:</strong> {request.community_groups.name}
            </p>
          )}
          
          {request.admin_code && (
            <p className="text-sm text-muted-foreground mb-2">
              <strong>Admin Code:</strong> {request.admin_code}
            </p>
          )}
          
          <p className="text-sm text-muted-foreground">
            <strong>Submitted:</strong> {new Date(request.created_at).toLocaleDateString()}
          </p>
          
          {request.reviewed_at && (
            <p className="text-sm text-muted-foreground">
              <strong>Reviewed:</strong> {new Date(request.reviewed_at).toLocaleDateString()}
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onSelect(request)}
            disabled={request.status !== 'pending'}
          >
            <Eye className="h-4 w-4 mr-1" />
            {request.status === 'pending' ? 'Review' : 'View'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminRequestCard;
