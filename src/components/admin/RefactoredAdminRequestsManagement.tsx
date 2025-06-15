
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, Shield, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useRolePermissions } from '@/hooks/useRolePermissions';
import AdminRequestCard from './components/AdminRequestCard';
import AdminRequestDialog from './components/AdminRequestDialog';
import { useAdminRequests } from './hooks/useAdminRequests';
import type { Database } from '@/integrations/supabase/types';

type ComprehensiveRole = 'member' | 'super_admin' | 'general_admin' | 'community_admin' | 'events_admin' | 'projects_admin' | 'finance_admin' | 'content_admin' | 'technical_admin' | 'marketing_admin' | 'chairman' | 'vice_chairman';

type AdminRequest = Database['public']['Tables']['admin_requests']['Row'] & {
  reviewed_by?: { name: string } | null;
  community?: { name: string } | null;
  admin_type: ComprehensiveRole;
};

type Community = Database['public']['Tables']['community_groups']['Row'];

interface UseAdminRequestsReturn {
  requests: AdminRequest[];
  communities: Community[];
  loading: boolean;
  fetchRequests: () => Promise<void>;
  fetchCommunities: () => Promise<void>;
}

const RefactoredAdminRequestsManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { hasPermission } = useRolePermissions();
  const {
    requests,
    communities,
    loading,
    fetchRequests,
    fetchCommunities,
  } = useAdminRequests() as UseAdminRequestsReturn;

  const [selectedRequest, setSelectedRequest] = useState<AdminRequest | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [canManageRequests, setCanManageRequests] = useState(false);

  useEffect(() => {
    const checkPermissions = async () => {
      const canManage = await hasPermission('role_management') || await hasPermission('user_management');
      setCanManageRequests(canManage);
    };
    checkPermissions();
  }, [hasPermission]);

  useEffect(() => {
    const init = async () => {
      try {
        await Promise.all([fetchRequests(), fetchCommunities()]);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load data'));
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (error) {
      toast({
        title: "Data Error",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [error]);

  const handleReviewRequest = async (requestId: string, status: 'approved' | 'rejected') => {
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to review requests",
        variant: "destructive",
      });
      return;
    }

    setIsReviewing(true);
    try {
      // Update the request status
      const { error: updateError } = await supabase
        .from('admin_requests')
        .update({
          status,
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', requestId);

      if (updateError) throw updateError;

      // If approved, assign the appropriate role
      if (status === 'approved') {
        const request = requests.find(r => r.id === requestId);
        if (!request?.user_id) throw new Error("Request data incomplete");

        // Update member status if exists
        await supabase
          .from('members')
          .update({ registration_status: 'approved' })
          .eq('user_id', request.user_id);

        // Assign the requested role
        const { error: roleError } = await supabase
          .from('user_roles')
          .upsert({
            user_id: request.user_id,
            role: request.admin_type
          });

        if (roleError) throw roleError;

        // If community admin, add to community_admin_roles (if community_id exists)
        if (request.admin_type === 'community_admin' && request.community_id) {
          const { error: communityRoleError } = await supabase
            .from('community_admin_roles')
            .insert({
              user_id: request.user_id,
              community_id: request.community_id,
              assigned_by: user.id,
              role: 'admin',
              is_active: true
            });

          if (communityRoleError) {
            console.error('Error assigning community role:', communityRoleError);
            // Don't throw error, just log it
          } else {
            console.log('Community admin role assigned successfully');
          }

          // Set default permissions for community admin
          const { error: permissionsError } = await supabase
            .from('community_dashboard_permissions')
            .upsert({
              community_id: request.community_id,
              admin_user_id: request.user_id,
              permissions: {
                add_users: true,
                add_events: true,
                upload_blogs: true,
                view_members: true,
                send_reminders: true,
                mark_attendance: true,
                upload_projects: true
              }
            });

          if (permissionsError) {
            console.error('Error setting community permissions:', permissionsError);
          } else {
            console.log('Community permissions set successfully');
          }
        }
      }

      toast({
        title: status === 'approved' ? "Request Approved" : "Request Rejected",
        description: `The admin request has been ${status} successfully.`,
      });

      setSelectedRequest(null);
      await fetchRequests();
    } catch (error) {
      console.error('Error reviewing request:', error);
      toast({
        title: "Review Failed",
        description: `Failed to process request: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setIsReviewing(false);
    }
  };

  if (!canManageRequests) {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="text-center">
            <Shield className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">Access Restricted</h3>
            <p className="text-muted-foreground">You don't have permission to manage admin requests.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading && requests.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <Shield className="w-6 h-6 text-primary" />
          <div>
            <CardTitle>Admin Requests Management</CardTitle>
            <CardDescription>
              Review and manage admin access requests
              {requests.length > 0 && ` • ${requests.length} request(s) pending`}
            </CardDescription>
          </div>
        </div>
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
          
          {requests.length === 0 && !loading && (
            <div className="text-center py-12 space-y-2">
              <Clock className="h-10 w-10 mx-auto text-muted-foreground" />
              <p className="text-muted-foreground">No admin requests found</p>
              <p className="text-sm text-muted-foreground">All requests have been processed</p>
            </div>
          )}
        </div>

        {selectedRequest && (
          <AdminRequestDialog
            request={selectedRequest}
            communities={communities}
            isProcessing={isReviewing}
            onReview={handleReviewRequest}
            onClose={() => setSelectedRequest(null)}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default RefactoredAdminRequestsManagement;
