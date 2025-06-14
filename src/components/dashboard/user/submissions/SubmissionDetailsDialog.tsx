
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Calendar, User, MessageSquare, Clock, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
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
}

interface Response {
  id: string;
  response_content: string;
  created_at: string;
  updated_at: string;
  is_public: boolean;
  admin_id: string;
}

interface SubmissionDetailsDialogProps {
  submission: Submission;
  open: boolean;
  onClose: () => void;
}

const SubmissionDetailsDialog = ({ submission, open, onClose }: SubmissionDetailsDialogProps) => {
  const [responses, setResponses] = useState<Response[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open && submission.id) {
      fetchResponses();
    }
  }, [open, submission.id]);

  const fetchResponses = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('submission_responses')
        .select('*')
        .eq('submission_id', submission.id)
        .eq('is_public', true)
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
    } finally {
      setLoading(false);
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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl">{submission.title}</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[calc(90vh-120px)]">
          <div className="space-y-6 pr-4">
            {/* Submission Details */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Submission Details</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge className={getTypeColor(submission.submission_type)}>
                      {submission.submission_type}
                    </Badge>
                    <Badge className={getStatusColor(submission.status)}>
                      {getStatusIcon(submission.status)}
                      <span className="ml-1 capitalize">{submission.status.replace('_', ' ')}</span>
                    </Badge>
                    <Badge className={getPriorityColor(submission.priority)}>
                      {getPriorityText(submission.priority)} Priority
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-wrap">{submission.content}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">Created:</span>
                    <span className="font-medium">{formatDate(submission.created_at)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">Directed to:</span>
                    <span className="font-medium capitalize">{submission.directed_to.replace('_', ' ')}</span>
                  </div>
                  
                  {submission.is_anonymous && (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">Anonymous submission</span>
                    </div>
                  )}
                  
                  {submission.resolved_at && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">Resolved:</span>
                      <span className="font-medium">{formatDate(submission.resolved_at)}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Admin Responses */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Admin Responses ({responses.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">
                    {[1, 2].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                        <div className="h-16 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : responses.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No admin responses yet</p>
                    <p className="text-sm">Your submission is being reviewed</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {responses.map((response, index) => (
                      <div key={response.id}>
                        <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-blue-900">Admin Response</span>
                            <span className="text-xs text-gray-500">{formatDate(response.created_at)}</span>
                          </div>
                          <p className="text-gray-800 whitespace-pre-wrap">{response.response_content}</p>
                        </div>
                        {index < responses.length - 1 && <Separator className="my-3" />}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default SubmissionDetailsDialog;
