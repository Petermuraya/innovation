import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Eye, Calendar, User, AlertCircle, CheckCircle, Clock, XCircle, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Submission {
  id: string;
  title: string;
  content: string;
  submission_type: 'complaint' | 'recommendation' | 'thought';
  status: 'pending' | 'in_progress' | 'resolved' | 'closed';
  directed_to: string;
  priority: number;
  is_anonymous: boolean;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
  response_count: number;
  last_response_at?: string;
  submitter_name?: string;
  submitter_email?: string;
}

interface Response {
  id: string;
  response_content: string;
  created_at: string;
  is_public: boolean;
  admin_id: string;
}

const SubmissionsManagement = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [responses, setResponses] = useState<Response[]>([]);
  const [newResponse, setNewResponse] = useState('');
  const [isPublicResponse, setIsPublicResponse] = useState(true);
  const [newStatus, setNewStatus] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'complaint' | 'recommendation' | 'thought'>('all');
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchSubmissions();
  }, [activeTab]);

  const fetchSubmissions = async () => {
    try {
      let query = supabase
        .from('submissions_with_stats')
        .select('*')
        .order('created_at', { ascending: false });

      if (activeTab !== 'all') {
        query = query.eq('submission_type', activeTab);
      }

      const { data, error } = await query;

      if (error) throw error;

      setSubmissions(data || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast({
        title: "Error",
        description: "Failed to load submissions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchResponses = async (submissionId: string) => {
    try {
      const { data, error } = await supabase
        .from('submission_responses')
        .select('*')
        .eq('submission_id', submissionId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setResponses(data || []);
    } catch (error) {
      console.error('Error fetching responses:', error);
      toast({
        title: "Error",
        description: "Failed to load responses",
        variant: "destructive"
      });
    }
  };

  const handleSubmissionClick = (submission: Submission) => {
    setSelectedSubmission(submission);
    setNewStatus(submission.status);
    fetchResponses(submission.id);
  };

  const handleSubmitResponse = async () => {
    if (!selectedSubmission || !user || !newResponse.trim()) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('submission_responses')
        .insert({
          submission_id: selectedSubmission.id,
          admin_id: user.id,
          response_content: newResponse,
          is_public: isPublicResponse
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Response submitted successfully"
      });

      setNewResponse('');
      fetchResponses(selectedSubmission.id);
      fetchSubmissions();
    } catch (error) {
      console.error('Error submitting response:', error);
      toast({
        title: "Error",
        description: "Failed to submit response",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedSubmission || !user || newStatus === selectedSubmission.status) return;

    try {
      const updateData: any = {
        status: newStatus,
        updated_at: new Date().toISOString()
      };

      if (newStatus === 'resolved') {
        updateData.resolved_at = new Date().toISOString();
        updateData.resolved_by = user.id;
      }

      const { error } = await supabase
        .from('user_submissions')
        .update(updateData)
        .eq('id', selectedSubmission.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Status updated successfully"
      });

      setSelectedSubmission({ ...selectedSubmission, status: newStatus as any });
      fetchSubmissions();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'in_progress':
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'closed':
        return <XCircle className="w-4 h-4 text-gray-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1:
        return 'bg-green-100 text-green-800';
      case 2:
        return 'bg-yellow-100 text-yellow-800';
      case 3:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority: number) => {
    switch (priority) {
      case 1:
        return 'Low';
      case 2:
        return 'Medium';
      case 3:
        return 'High';
      default:
        return 'Unknown';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'complaint':
        return 'bg-red-100 text-red-800';
      case 'recommendation':
        return 'bg-blue-100 text-blue-800';
      case 'thought':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Submissions Management</h2>
          <p className="text-gray-600">Review and respond to user complaints, recommendations, and thoughts</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All ({submissions.length})</TabsTrigger>
          <TabsTrigger value="complaint">Complaints</TabsTrigger>
          <TabsTrigger value="recommendation">Recommendations</TabsTrigger>
          <TabsTrigger value="thought">Thoughts</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-6">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Submitter</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Responses</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="font-medium">
                        {submission.title}
                        {submission.is_anonymous && (
                          <Badge variant="outline" className="ml-2">
                            <User className="w-3 h-3 mr-1" />
                            Anonymous
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={getTypeColor(submission.submission_type)}>
                          {submission.submission_type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(submission.status)}>
                          {getStatusIcon(submission.status)}
                          <span className="ml-1 capitalize">{submission.status.replace('_', ' ')}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(submission.priority)}>
                          {getPriorityText(submission.priority)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {submission.is_anonymous ? 'Anonymous' : submission.submitter_name || 'Unknown'}
                      </TableCell>
                      <TableCell>{formatDate(submission.created_at)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" />
                          {submission.response_count}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSubmissionClick(submission)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh]">
                            <DialogHeader>
                              <DialogTitle>{selectedSubmission?.title}</DialogTitle>
                            </DialogHeader>
                            
                            {selectedSubmission && (
                              <div className="space-y-6 max-h-[70vh] overflow-y-auto">
                                {/* Submission Details */}
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-lg">Submission Details</CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-4">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                      <p className="text-gray-800 whitespace-pre-wrap">{selectedSubmission.content}</p>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                      <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-gray-500" />
                                        <span className="text-gray-600">Created:</span>
                                        <span className="font-medium">{formatDate(selectedSubmission.created_at)}</span>
                                      </div>
                                      
                                      <div className="flex items-center gap-2">
                                        <User className="w-4 h-4 text-gray-500" />
                                        <span className="text-gray-600">Directed to:</span>
                                        <span className="font-medium capitalize">{selectedSubmission.directed_to.replace('_', ' ')}</span>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>

                                {/* Status Update */}
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-lg">Update Status</CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-4">
                                    <div className="flex items-center gap-4">
                                      <Select value={newStatus} onValueChange={setNewStatus}>
                                        <SelectTrigger className="w-48">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="pending">Pending</SelectItem>
                                          <SelectItem value="in_progress">In Progress</SelectItem>
                                          <SelectItem value="resolved">Resolved</SelectItem>
                                          <SelectItem value="closed">Closed</SelectItem>
                                        </SelectContent>
                                      </Select>
                                      
                                      <Button 
                                        onClick={handleStatusUpdate}
                                        disabled={newStatus === selectedSubmission.status}
                                      >
                                        Update Status
                                      </Button>
                                    </div>
                                  </CardContent>
                                </Card>

                                {/* Previous Responses */}
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-lg">Previous Responses ({responses.length})</CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    {responses.length === 0 ? (
                                      <p className="text-gray-500 text-center py-4">No responses yet</p>
                                    ) : (
                                      <div className="space-y-4">
                                        {responses.map((response) => (
                                          <div key={response.id} className="bg-blue-50 border-l-4 border-blue-400 p-4">
                                            <div className="flex items-center justify-between mb-2">
                                              <span className="text-sm font-medium text-blue-900">Admin Response</span>
                                              <div className="flex items-center gap-2">
                                                <span className="text-xs text-gray-500">{formatDate(response.created_at)}</span>
                                                <Badge variant={response.is_public ? "default" : "secondary"}>
                                                  {response.is_public ? "Public" : "Internal"}
                                                </Badge>
                                              </div>
                                            </div>
                                            <p className="text-gray-800 whitespace-pre-wrap">{response.response_content}</p>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </CardContent>
                                </Card>

                                {/* Add New Response */}
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-lg">Add Response</CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-4">
                                    <Textarea
                                      placeholder="Type your response..."
                                      value={newResponse}
                                      onChange={(e) => setNewResponse(e.target.value)}
                                      rows={4}
                                    />
                                    
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-4">
                                        <label className="flex items-center gap-2 text-sm">
                                          <input
                                            type="checkbox"
                                            checked={isPublicResponse}
                                            onChange={(e) => setIsPublicResponse(e.target.checked)}
                                          />
                                          Make response visible to user
                                        </label>
                                      </div>
                                      
                                      <Button 
                                        onClick={handleSubmitResponse}
                                        disabled={!newResponse.trim() || submitting}
                                      >
                                        <Send className="w-4 h-4 mr-2" />
                                        {submitting ? 'Sending...' : 'Send Response'}
                                      </Button>
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {submissions.length === 0 && (
                <div className="text-center py-12">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No submissions found
                  </h3>
                  <p className="text-gray-600">
                    {activeTab === 'all' 
                      ? "No submissions have been made yet."
                      : `No ${activeTab}s have been submitted yet.`
                    }
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SubmissionsManagement;
