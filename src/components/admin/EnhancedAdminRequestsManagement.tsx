
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, XCircle, Clock, Eye, Users, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface AdminRequest {
  id: string;
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
  community_name?: string;
}

interface Community {
  id: string;
  name: string;
}

const EnhancedAdminRequestsManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [requests, setRequests] = useState<AdminRequest[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<AdminRequest | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [reviewing, setReviewing] = useState(false);

  useEffect(() => {
    fetchRequests();
    fetchCommunities();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_requests')
        .select(`
          *,
          community_groups(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const enrichedRequests = (data || []).map(request => ({
        ...request,
        community_name: request.community_groups?.name || null
      }));

      setRequests(enrichedRequests);
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
    }
  };

  const handleReviewRequest = async (requestId: string, status: 'approved' | 'rejected') => {
    if (!user) return;

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
        if (request) {
          if (request.admin_type === 'general') {
            // Assign general admin role
            const { error: roleError } = await supabase
              .from('user_roles')
              .insert({
                user_id: request.user_id,
                role: 'admin'
              });

            if (roleError && !roleError.message.includes('duplicate key')) {
              throw roleError;
            }
          } else if (request.admin_type === 'community' && request.community_id) {
            // Assign community admin role
            const { error: communityAdminError } = await supabase
              .from('community_admin_roles')
              .insert({
                user_id: request.user_id,
                community_id: request.community_id,
                role: 'admin',
                assigned_by: user.id,
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
      setReviewNotes('');
      await fetchRequests();
    } catch (error) {
      console.error('Error reviewing request:', error);
      toast({
        title: "Error",
        description: `Failed to ${status} request`,
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
        return <Badge variant="default" className="flex items-center gap-1 bg-green-500"><CheckCircle className="h-3 w-3" />Approved</Badge>;
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
                    <h4 className="font-medium text-kic-gray">{request.name}</h4>
                    {getStatusBadge(request.status)}
                    {getAdminTypeBadge(request.admin_type)}
                  </div>
                  
                  <p className="text-sm text-kic-gray/70 mb-2">{request.email}</p>
                  
                  {request.community_name && (
                    <p className="text-sm text-kic-gray/70 mb-2">
                      <strong>Community:</strong> {request.community_name}
                    </p>
                  )}
                  
                  {request.admin_code && (
                    <p className="text-sm text-kic-gray/70 mb-2">
                      <strong>Admin Code:</strong> {request.admin_code}
                    </p>
                  )}
                  
                  <p className="text-sm text-kic-gray/70">
                    <strong>Submitted:</strong> {new Date(request.created_at).toLocaleDateString()}
                  </p>
                  
                  {request.reviewed_at && (
                    <p className="text-sm text-kic-gray/70">
                      <strong>Reviewed:</strong> {new Date(request.reviewed_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSelectedRequest(request)}>
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
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
                          <strong>Admin Type:</strong> {request.admin_type}
                        </div>
                        {request.community_name && (
                          <div>
                            <strong>Community:</strong> {request.community_name}
                          </div>
                        )}
                        {request.admin_code && (
                          <div>
                            <strong>Admin Code:</strong> {request.admin_code}
                          </div>
                        )}
                        <div>
                          <strong>Justification:</strong>
                          <p className="mt-1 p-3 bg-gray-50 rounded-md text-sm">
                            {request.justification}
                          </p>
                        </div>
                        
                        {request.status === 'pending' && (
                          <div className="flex gap-2 pt-4">
                            <Button
                              onClick={() => handleReviewRequest(request.id, 'approved')}
                              disabled={reviewing}
                              className="flex-1 bg-green-500 hover:bg-green-600"
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
              <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-kic-gray/70">No admin requests found.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedAdminRequestsManagement;
