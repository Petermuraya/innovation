import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Shield, Check, X, Clock, Loader2 } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';
import * as Dialog from '@radix-ui/react-dialog';

type AdminRequestWithRelations = Database['public']['Tables']['admin_requests']['Row'] & {
  reviewed_by: { name: string } | null;
  community: { name: string } | null;
};

const AdminRequestsManagement = () => {
  const [requests, setRequests] = useState<AdminRequestWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<Record<string, boolean>>({});
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    requestId: string;
    action: 'approve' | 'reject';
  } | null>(null);

  useEffect(() => {
    fetchAdminRequests();
  }, []);

  const fetchAdminRequests = async () => {
    try {
      setLoading(true);
      console.log('Fetching admin requests...');
      
      const { data, error } = await supabase
        .from('admin_requests')
        .select(`
          *,
          reviewed_by:members!admin_requests_reviewed_by_fkey(name),
          community:community_groups(name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching admin requests:', error);
        throw error;
      }

      console.log('Admin requests fetched:', data);
      
      // Transform the data to match our expected type structure
      const transformedData: AdminRequestWithRelations[] = (data || []).map(request => ({
        ...request,
        reviewed_by: request.reviewed_by ? { name: request.reviewed_by.name } : null,
        community: request.community ? { name: request.community.name } : null,
      }));
      
      setRequests(transformedData);
    } catch (error) {
      console.error('Error fetching admin requests:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch admin requests',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRequestReview = async (requestId: string, action: 'approve' | 'reject') => {
    if (!pendingAction) return;
    
    try {
      setProcessing((prev) => ({ ...prev, [requestId]: true }));
      const request = requests.find((r) => r.id === requestId);
      if (!request) {
        throw new Error('Request not found');
      }

      console.log(`Processing ${action} for request:`, request);

      const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser();
      if (authError || !currentUser?.id) {
        throw new Error('User not authenticated');
      }

      // Update the admin request status
      const { error: updateError } = await supabase
        .from('admin_requests')
        .update({
          status: action === 'approve' ? 'approved' : 'rejected',
          reviewed_at: new Date().toISOString(),
          reviewed_by: currentUser.id,
        })
        .eq('id', requestId);

      if (updateError) {
        console.error('Error updating admin request:', updateError);
        throw updateError;
      }

      console.log('Admin request status updated successfully');

      if (action === 'approve' && request.user_id) {
        console.log('Processing approval for user:', request.user_id);
        
        // Update member status to approved
        const { error: memberError } = await supabase
          .from('members')
          .update({ 
            registration_status: 'approved',
            updated_at: new Date().toISOString()
          })
          .eq('user_id', request.user_id);

        if (memberError) {
          console.error('Error updating member status:', memberError);
          // Don't throw error, just log it since the main request was processed
        } else {
          console.log('Member status updated to approved');
        }

        // Assign the appropriate role based on admin type
        const roleToAssign = request.admin_type === 'general' ? 'general_admin' : 'community_admin';
        
        const { error: roleError } = await supabase
          .from('user_roles')
          .upsert({ 
            user_id: request.user_id, 
            role: roleToAssign 
          });

        if (roleError) {
          console.error('Error assigning role:', roleError);
          throw new Error(`Failed to assign role: ${roleError.message}`);
        }

        console.log(`Role ${roleToAssign} assigned successfully`);

        // If community admin, add to community_admin_roles (if community_id exists)
        if (request.admin_type === 'community' && request.community_id) {
          const { error: communityRoleError } = await supabase
            .from('community_admin_roles')
            .insert({
              user_id: request.user_id,
              community_id: request.community_id,
              assigned_by: currentUser.id,
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
        title: `Request ${action === 'approve' ? 'Approved' : 'Rejected'}`,
        description: `Admin request has been ${action === 'approve' ? 'approved' : 'rejected'} successfully.`,
      });

      await fetchAdminRequests();
    } catch (error) {
      console.error(`Error ${action}ing request:`, error);
      toast({
        title: 'Error',
        description: `Failed to ${action} request: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    } finally {
      setProcessing((prev) => ({ ...prev, [requestId]: false }));
    }
  };

  const confirmAction = (requestId: string, action: 'approve' | 'reject') => {
    setPendingAction({ requestId, action });
    setDialogOpen(true);
  };

  const executeAction = async () => {
    if (!pendingAction) return;
    await handleRequestReview(pendingAction.requestId, pendingAction.action);
    setDialogOpen(false);
    setPendingAction(null);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: {
        className: 'text-yellow-600 border-yellow-600',
        icon: <Clock className="w-3 h-3 mr-1" />,
        text: 'Pending'
      },
      approved: {
        className: 'text-green-600 border-green-600',
        icon: <Check className="w-3 h-3 mr-1" />,
        text: 'Approved'
      },
      rejected: {
        className: 'text-red-600 border-red-600',
        icon: <X className="w-3 h-3 mr-1" />,
        text: 'Rejected'
      }
    };

    const variant = variants[status as keyof typeof variants] || {
      className: '',
      icon: null,
      text: status
    };

    return (
      <Badge variant="outline" className={variant.className}>
        {variant.icon}
        {variant.text}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Admin Registration Requests
          </CardTitle>
          <CardDescription>
            Review and manage admin access requests. {requests.length} request(s) found.
          </CardDescription>
        </CardHeader>
      </Card>

      {requests.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">No admin requests found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {requests.map((request) => (
            <Card 
              key={request.id} 
              className={`border-l-4 ${
                request.status === 'approved' 
                  ? 'border-l-green-500' 
                  : request.status === 'rejected' 
                    ? 'border-l-red-500' 
                    : 'border-l-yellow-500'
              }`}
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg">{request.name}</h3>
                    <p className="text-gray-600">{request.email}</p>
                    <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                      <span>
                        Requested: {new Date(request.created_at).toLocaleDateString()}
                      </span>
                      {request.admin_type && (
                        <span>• Type: {request.admin_type}</span>
                      )}
                      {request.admin_code && (
                        <span>• Has Admin Code</span>
                      )}
                      {request.community && (
                        <span>• Community: {request.community.name}</span>
                      )}
                    </div>
                  </div>
                  {getStatusBadge(request.status)}
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Justification:</h4>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded border">
                    {request.justification}
                  </p>
                </div>

                {request.status === 'pending' && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Button 
                      onClick={() => confirmAction(request.id, 'approve')} 
                      className="bg-green-600 hover:bg-green-700" 
                      disabled={processing[request.id]}
                    >
                      {processing[request.id] ? (
                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      ) : (
                        <Check className="w-4 h-4 mr-1" />
                      )} 
                      Approve
                    </Button>
                    <Button 
                      onClick={() => confirmAction(request.id, 'reject')} 
                      variant="destructive" 
                      disabled={processing[request.id]}
                    >
                      {processing[request.id] ? (
                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      ) : (
                        <X className="w-4 h-4 mr-1" />
                      )} 
                      Reject
                    </Button>
                  </div>
                )}

                {request.status !== 'pending' && request.reviewed_at && (
                  <div className="text-sm text-gray-500 space-y-1">
                    <p>Reviewed: {new Date(request.reviewed_at).toLocaleString()}</p>
                    {request.reviewed_by && (
                      <p>Reviewed by: {request.reviewed_by.name}</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
          <Dialog.Content className="fixed z-50 bg-white p-6 rounded-lg max-w-md w-[calc(100%-2rem)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-lg focus:outline-none">
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title className="text-lg font-semibold">
                Confirm {pendingAction?.action === 'approve' ? 'Approval' : 'Rejection'}
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="text-gray-500 hover:text-gray-700">
                  <X className="w-5 h-5" />
                </button>
              </Dialog.Close>
            </div>
            <Dialog.Description className="text-gray-600 mb-6">
              Are you sure you want to {pendingAction?.action} this admin request? 
              This action cannot be undone.
            </Dialog.Description>
            <div className="flex gap-2 justify-end">
              <Dialog.Close asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.Close>
              <Button 
                onClick={executeAction}
                variant={pendingAction?.action === 'approve' ? 'default' : 'destructive'}
              >
                Confirm {pendingAction?.action}
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default AdminRequestsManagement;
