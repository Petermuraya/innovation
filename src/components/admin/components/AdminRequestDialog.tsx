
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface AdminRequestDialogProps {
  request: {
    id: string;
    name: string;
    email: string;
    admin_type: string;
    justification: string;
    status: string;
    admin_code?: string;
    community_groups?: {
      name: string;
    };
  };
  reviewing: boolean;
  onReview: (requestId: string, status: 'approved' | 'rejected') => Promise<void>;
  onClose: () => void;
}

const AdminRequestDialog = ({ request, reviewing, onReview, onClose }: AdminRequestDialogProps) => {
  return (
    <Dialog open={!!request} onOpenChange={() => onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Admin Request Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <strong>Name:</strong> {request.name}
          </div>
          <div>
            <strong>Email:</strong> {request.email}
          </div>
          <div>
            <strong>Admin Type:</strong> {request.admin_type}
          </div>
          {request.community_groups?.name && (
            <div>
              <strong>Community:</strong> {request.community_groups.name}
            </div>
          )}
          {request.admin_code && (
            <div>
              <strong>Admin Code:</strong> {request.admin_code}
            </div>
          )}
          <div>
            <strong>Justification:</strong>
            <p className="mt-1 p-3 bg-muted rounded-md text-sm">
              {request.justification}
            </p>
          </div>
          
          {request.status === 'pending' && (
            <div className="flex gap-2 pt-4">
              <Button
                onClick={() => onReview(request.id, 'approved')}
                disabled={reviewing}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {reviewing ? 'Processing...' : 'Approve'}
              </Button>
              <Button
                onClick={() => onReview(request.id, 'rejected')}
                disabled={reviewing}
                variant="destructive"
                className="flex-1"
              >
                {reviewing ? 'Processing...' : 'Reject'}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminRequestDialog;
