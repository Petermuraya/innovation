
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CheckCircle, XCircle, Clock, Eye, Users, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

type SimpleRole = 'member' | 'super_admin' | 'general_admin' | 'community_admin' | 'admin';

interface AdminRequest {
  id: string;
  user_id?: string;
  name: string;
  email: string;
  justification: string;
  status: string;
  admin_type: string;
  admin_code?: string;
  community_id?: string;
  created_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  community_groups?: {
    name: string;
  };
}

interface Community {
  id: string;
  name: string;
}

const ROLE_LABELS: Record<string, string> = {
  member: 'Member',
  super_admin: 'Super Admin',
  general_admin: 'General Admin',
  community_admin: 'Community Admin',
  admin: 'Admin'
};

const EnhancedAdminRequestsManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [requests, setRequests] = useState<AdminRequest[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<AdminRequest | null>(null);
  const [reviewing, setReviewing] = useState(false);

  useEffect(() => {
    fetchRequests();
    fetchCommunities();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('admin_requests')
        .select(`
          *,
          community_groups:community_groups(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform the data to ensure admin_type is a string
      const transformedData = (data || []).map(request => ({
        ...request,
        admin_type: request.admin_type || 'general_admin'
      }));

      setRequests(transformedData);
    } catch (error) {
      console.error('Error fetching admin requests:', error);
      toast({
        title: "Error",
        description: "Failed to load admin requests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCommunities = async () => {
    try {
      const { data, error } = await supabase
        .from('community_groups')
        .select('id, name')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setCommunities(data || []);
    } catch (error) {
      console.error('Error fetching communities:', error);
      toast({
        title: "Error",
        description: "Failed to load communities",
        variant: "destructive",
      });
    }
  };

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

        if (request.user_id) {
          // Map admin_type to SimpleRole
          let roleToAssign: SimpleRole = 'member';
          if (request.admin_type === 'general_admin') {
            roleToAssign = 'general_admin';
          } else if (request.admin_type === 'community_admin') {
            roleToAssign = 'community_admin';
          } else if (request.admin_type === 'super_admin') {
            roleToAssign = 'super_admin';
          } else {
            roleToAssign = 'admin';
          }

          // Assign the requested role
          const { error: roleError } = await supabase
            .from('user_roles')
            .upsert({
              user_id: request.user_id,
              role: roleToAssign
            });

          if (roleError) throw roleError;

          // Update member status to approved if exists
          await supabase
            .from('members')
            .update({ registration_status: 'approved' })
            .eq('user_id', request.user_id);

          // If community admin, also add to community_admin_roles
          if (request.admin_type === 'community_admin' && request.community_id) {
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
    return <Badge variant="outline" className="flex items-center gap-1">
      <Shield className="h-3 w-3" />
      {ROLE_LABELS[adminType] || adminType}
    </Badge>;
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
            <div key={request.id} className="border rounded-lg p-4">
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
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setSelectedRequest(request)}
                        disabled={request.status !== 'pending'}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        {request.status === 'pending' ? 'Review' : 'View'}
                      </Button>
                    </DialogTrigger>
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
                          <strong>Admin Type:</strong> {ROLE_LABELS[request.admin_type] || request.admin_type}
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
                              onClick={() => handleReviewRequest(request.id, 'approved')}
                              disabled={reviewing}
                              className="flex-1 bg-green-600 hover:bg-green-700"
                            >
                              {reviewing ? 'Processing...' : 'Approve'}
                            </Button>
                            <Button
                              onClick={() => handleReviewRequest(request.id, 'rejected')}
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
                </div>
              </div>
            </div>
          ))}
          
          {requests.length === 0 && (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 mx-auto mb-4 text-muted" />
              <p className="text-muted-foreground">No admin requests found.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedAdminRequestsManagement;
