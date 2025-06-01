
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Shield, Check, X, Clock, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AdminRequest {
  id: string;
  user_id: string;
  email: string;
  name: string;
  justification: string;
  admin_code?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  reviewed_by?: string;
  reviewed_at?: string;
}

const AdminRequestsManagement = () => {
  const [requests, setRequests] = useState<AdminRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAdminRequests();
  }, []);

  const fetchAdminRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_requests' as any)
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching admin requests:', error);
      toast({
        title: "Error",
        description: "Failed to fetch admin requests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRequestReview = async (requestId: string, action: 'approve' | 'reject') => {
    try {
      const request = requests.find(r => r.id === requestId);
      if (!request) return;

      // Update request status
      const { error: updateError } = await supabase
        .from('admin_requests' as any)
        .update({
          status: action === 'approve' ? 'approved' : 'rejected',
          reviewed_at: new Date().toISOString(),
          reviewed_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', requestId);

      if (updateError) throw updateError;

      // If approving, add admin role
      if (action === 'approve') {
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: request.user_id,
            role: 'admin'
          });

        if (roleError) {
          console.error('Error adding admin role:', roleError);
          // Still show success for request update
        }

        // Update member registration status to approved
        await supabase
          .from('members')
          .update({ registration_status: 'approved' })
          .eq('user_id', request.user_id);
      }

      toast({
        title: `Request ${action === 'approve' ? 'Approved' : 'Rejected'}`,
        description: `Admin request has been ${action === 'approve' ? 'approved' : 'rejected'} successfully.`,
      });

      fetchAdminRequests(); // Refresh the list
    } catch (error) {
      console.error(`Error ${action}ing request:`, error);
      toast({
        title: "Error",
        description: `Failed to ${action} request. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="text-green-600 border-green-600"><Check className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="text-red-600 border-red-600"><X className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p>Loading admin requests...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-600" />
            Admin Registration Requests
          </CardTitle>
          <CardDescription>
            Review and manage admin access requests
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
        <div className="space-y-4">
          {requests.map((request) => (
            <Card key={request.id} className="border-l-4 border-l-red-500">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{request.name}</h3>
                    <p className="text-gray-600">{request.email}</p>
                    <p className="text-sm text-gray-500">
                      Requested: {new Date(request.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  {getStatusBadge(request.status)}
                </div>

                {request.admin_code && (
                  <Alert className="mb-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Admin code provided: <code className="bg-gray-100 px-1 rounded">{request.admin_code}</code>
                    </AlertDescription>
                  </Alert>
                )}

                <div className="mb-4">
                  <h4 className="font-medium mb-2">Justification:</h4>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded border">
                    {request.justification}
                  </p>
                </div>

                {request.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleRequestReview(request.id, 'approve')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleRequestReview(request.id, 'reject')}
                      variant="destructive"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                )}

                {request.status !== 'pending' && request.reviewed_at && (
                  <p className="text-sm text-gray-500 mt-2">
                    Reviewed: {new Date(request.reviewed_at).toLocaleDateString()}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminRequestsManagement;
