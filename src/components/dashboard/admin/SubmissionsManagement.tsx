import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { FileText, Clock, CheckCircle, XCircle, Eye, User, Calendar, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface ProjectSubmission {
  id: string;
  title: string;
  description: string;
  github_url: string;
  live_demo_url?: string;
  technologies: string[];
  status: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  member_name?: string;
  member_email?: string;
}

const SubmissionsManagement = () => {
  const { member } = useAuth();
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<ProjectSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<ProjectSubmission | null>(null);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      
      // Use project_submissions table instead of user_submissions
      const { data, error } = await supabase
        .from('project_submissions')
        .select(`
          id,
          title,
          description,
          github_url,
          live_demo_url,
          technologies,
          status,
          user_id,
          created_at,
          updated_at
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch member details for each submission
      const submissionsWithMemberData = await Promise.all(
        (data || []).map(async (submission) => {
          const { data: memberData } = await supabase
            .from('members')
            .select('name, email')
            .eq('user_id', submission.user_id)
            .single();

          return {
            ...submission,
            member_name: memberData?.name || 'Unknown',
            member_email: memberData?.email || 'Unknown'
          };
        })
      );

      setSubmissions(submissionsWithMemberData);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch project submissions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSubmissionStatus = async (submissionId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('project_submissions')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', submissionId);

      if (error) throw error;

      // Update local state
      setSubmissions(prev => 
        prev.map(sub => 
          sub.id === submissionId 
            ? { ...sub, status: newStatus, updated_at: new Date().toISOString() }
            : sub
        )
      );

      toast({
        title: "Status Updated",
        description: `Project submission ${newStatus}`,
      });

      // Close the dialog
      setSelectedSubmission(null);
    } catch (error) {
      console.error('Error updating submission status:', error);
      toast({
        title: "Error",
        description: "Failed to update submission status",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredSubmissions = submissions.filter(sub => {
    if (activeTab === 'all') return true;
    return sub.status === activeTab;
  });

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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Project Submissions Management
          </CardTitle>
          <CardDescription>
            Review and manage member project submissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All ({submissions.length})</TabsTrigger>
              <TabsTrigger value="pending">
                Pending ({submissions.filter(s => s.status === 'pending').length})
              </TabsTrigger>
              <TabsTrigger value="approved">
                Approved ({submissions.filter(s => s.status === 'approved').length})
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Rejected ({submissions.filter(s => s.status === 'rejected').length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-muted-foreground">Loading submissions...</p>
                </div>
              ) : filteredSubmissions.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground">No submissions found</h3>
                  <p className="text-sm text-muted-foreground">
                    {activeTab === 'all' ? 'No project submissions yet.' : `No ${activeTab} submissions.`}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredSubmissions.map((submission) => (
                    <Card key={submission.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold">{submission.title}</h3>
                              <Badge className={getStatusColor(submission.status)}>
                                <div className="flex items-center gap-1">
                                  {getStatusIcon(submission.status)}
                                  {submission.status}
                                </div>
                              </Badge>
                            </div>
                            
                            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                              {submission.description}
                            </p>
                            
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                              <div className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                {submission.member_name}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {new Date(submission.created_at).toLocaleDateString()}
                              </div>
                            </div>

                            {submission.technologies && submission.technologies.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-3">
                                {submission.technologies.map((tech, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {tech}
                                  </Badge>
                                ))}
                              </div>
                            )}

                            <div className="flex gap-2">
                              {submission.github_url && (
                                <Button variant="outline" size="sm" asChild>
                                  <a href={submission.github_url} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="h-3 w-3 mr-1" />
                                    GitHub
                                  </a>
                                </Button>
                              )}
                              {submission.live_demo_url && (
                                <Button variant="outline" size="sm" asChild>
                                  <a href={submission.live_demo_url} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="h-3 w-3 mr-1" />
                                    Live Demo
                                  </a>
                                </Button>
                              )}
                            </div>
                          </div>

                          <div className="flex gap-2 ml-4">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedSubmission(submission)}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  Review
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>{submission.title}</DialogTitle>
                                  <DialogDescription>
                                    Submitted by {submission.member_name} ({submission.member_email})
                                  </DialogDescription>
                                </DialogHeader>
                                
                                <div className="space-y-4">
                                  <div>
                                    <h4 className="font-medium mb-2">Description</h4>
                                    <p className="text-sm text-muted-foreground">
                                      {submission.description}
                                    </p>
                                  </div>

                                  {submission.technologies && submission.technologies.length > 0 && (
                                    <div>
                                      <h4 className="font-medium mb-2">Technologies</h4>
                                      <div className="flex flex-wrap gap-1">
                                        {submission.technologies.map((tech, index) => (
                                          <Badge key={index} variant="outline">
                                            {tech}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  <div className="flex gap-2">
                                    {submission.github_url && (
                                      <Button variant="outline" asChild>
                                        <a href={submission.github_url} target="_blank" rel="noopener noreferrer">
                                          <ExternalLink className="h-4 w-4 mr-2" />
                                          View on GitHub
                                        </a>
                                      </Button>
                                    )}
                                    {submission.live_demo_url && (
                                      <Button variant="outline" asChild>
                                        <a href={submission.live_demo_url} target="_blank" rel="noopener noreferrer">
                                          <ExternalLink className="h-4 w-4 mr-2" />
                                          View Live Demo
                                        </a>
                                      </Button>
                                    )}
                                  </div>

                                  {submission.status === 'pending' && (
                                    <div className="flex gap-2 pt-4 border-t">
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <Button variant="default">
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            Approve
                                          </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>Approve Submission</AlertDialogTitle>
                                            <AlertDialogDescription>
                                              Are you sure you want to approve this project submission? 
                                              This will make it visible in the projects section.
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                              onClick={() => updateSubmissionStatus(submission.id, 'approved')}
                                            >
                                              Approve
                                            </AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>

                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <Button variant="destructive">
                                            <XCircle className="h-4 w-4 mr-2" />
                                            Reject
                                          </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>Reject Submission</AlertDialogTitle>
                                            <AlertDialogDescription>
                                              Are you sure you want to reject this project submission? 
                                              The member will be notified of the rejection.
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                              onClick={() => updateSubmissionStatus(submission.id, 'rejected')}
                                              className="bg-red-600 hover:bg-red-700"
                                            >
                                              Reject
                                            </AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    </div>
                                  )}
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubmissionsManagement;
