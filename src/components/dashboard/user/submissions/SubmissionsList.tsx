
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquare, Eye, Calendar, User, AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import SubmissionDetailsDialog from './SubmissionDetailsDialog';

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

interface SubmissionsListProps {
  filterType?: 'complaint' | 'recommendation' | 'thought' | null;
}

const SubmissionsList = ({ filterType }: SubmissionsListProps) => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchSubmissions();
  }, [filterType, user]);

  const fetchSubmissions = async () => {
    if (!user) return;

    try {
      let query = supabase
        .from('submissions_with_stats')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (filterType) {
        query = query.eq('submission_type', filterType);
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
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No submissions yet
          </h3>
          <p className="text-gray-600">
            {filterType 
              ? `You haven't submitted any ${filterType}s yet.`
              : "You haven't made any submissions yet."
            }
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {submissions.map((submission) => (
          <Card key={submission.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{submission.title}</CardTitle>
                  <div className="flex items-center gap-2 flex-wrap">
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
                    {submission.is_anonymous && (
                      <Badge variant="outline">
                        <User className="w-3 h-3 mr-1" />
                        Anonymous
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-gray-600 mb-4 line-clamp-2">{submission.content}</p>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(submission.created_at)}
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    {submission.response_count} response{submission.response_count !== 1 ? 's' : ''}
                  </div>
                  <div className="text-gray-500">
                    Directed to: <span className="font-medium capitalize">
                      {submission.directed_to.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedSubmission(submission)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedSubmission && (
        <SubmissionDetailsDialog
          submission={selectedSubmission}
          open={!!selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
        />
      )}
    </>
  );
};

export default SubmissionsList;
