
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CheckCircle, XCircle, Clock, Eye, Users, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import AdminRequestCard from './components/AdminRequestCard';
import AdminRequestDialog from './components/AdminRequestDialog';
import { useAdminRequests } from './hooks/useAdminRequests';

const RefactoredAdminRequestsManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const {
    requests,
    communities,
    loading,
    fetchRequests,
    fetchCommunities,
  } = useAdminRequests();

  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [reviewing, setReviewing] = useState(false);

  useEffect(() => {
    fetchRequests();
    fetchCommunities();
  }, []);

  const handleReviewRequest = async (requestId: string, status: 'approved' | 'rejected') => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to review requests",
        variant: "destructive",
      });
      return;
    }

    setReviewing(true);
    try {
      // Update the request status
      const { error: updateError } = await supabase
        .from('admin_requests')
        .update({
          status,
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', requestId);

      if (updateError) throw updateError;

      // If approved, assign the appropriate role
      if (status === 'approved') {
        const request = requests.find(r => r.id === requestId);
        if (!request) throw new Error("Request not found");

        if (request.admin_type === 'general' && request.user_id) {
          // Assign general admin role
          const { error: roleError } = await supabase
            .from('user_roles')
            .upsert({
              user_id: request.user_id,
              role: 'admin'
            });

          if (roleError) throw roleError;
        } else if (request.admin_type === 'community' && request.community_id && request.user_id) {
          // Assign community admin role
          const { error: communityAdminError } = await supabase
            .from('community_admin_roles')
            .upsert({
              user_id: request.user_id,
              community_id: request.community_id,
              role: 'admin',
              assigned_by: user.id,
              is_active: true,
            });

          if (communityAdminError) throw communityAdminError;
        }
      }

      toast({
        title: status === 'approved' ? "Request approved" : "Request rejected",
        description: `Admin request has been ${status}`,
      });

      setSelectedRequest(null);
      await fetchRequests();
    } catch (error) {
      console.error('Error reviewing request:', error);
      toast({
        title: "Error",
        description: `Failed to ${status} request: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setReviewing(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading admin requests...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Requests Management</CardTitle>
        <CardDescription>Review and manage admin access requests</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {requests.map((request) => (
            <AdminRequestCard
              key={request.id}
              request={request}
              onSelect={setSelectedRequest}
            />
          ))}
          
          {requests.length === 0 && (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 mx-auto mb-4 text-muted" />
              <p className="text-muted-foreground">No admin requests found.</p>
            </div>
          )}
        </div>

        {selectedRequest && (
          <AdminRequestDialog
            request={selectedRequest}
            reviewing={reviewing}
            onReview={handleReviewRequest}
            onClose={() => setSelectedRequest(null)}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default RefactoredAdminRequestsManagement;
