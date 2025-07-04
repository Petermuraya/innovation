
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, CheckCircle, XCircle, Eye } from 'lucide-react';

interface ProjectSubmission {
  id: string;
  title: string;
  description: string;
  github_url: string;
  demo_url?: string;
  live_demo_url?: string;
  status: string;
  created_at: string;
  user_id: string;
  technologies?: string[];
  member_name?: string;
  member_email?: string;
}

const SubmissionsManagement = () => {
  const [submissions, setSubmissions] = useState<ProjectSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      // First get the submissions
      const { data: submissionsData, error: submissionsError } = await supabase
        .from('project_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (submissionsError) throw submissionsError;

      // Then get member data for each submission
      const submissionsWithMembers = await Promise.all(
        (submissionsData || []).map(async (submission) => {
          const { data: memberData } = await supabase
            .from('members')
            .select('name, email')
            .eq('user_id', submission.user_id)
            .single();

          return {
            ...submission,
            member_name: memberData?.name || 'Unknown User',
            member_email: memberData?.email || 'No email'
          };
        })
      );

      setSubmissions(submissionsWithMembers);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch submissions',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSubmissionStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('project_submissions')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      setSubmissions(submissions.map(sub => 
        sub.id === id ? { ...sub, status } : sub
      ));

      toast({
        title: 'Success',
        description: `Submission ${status} successfully`,
      });
    } catch (error) {
      console.error('Error updating submission:', error);
      toast({
        title: 'Error',
        description: 'Failed to update submission status',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return <div>Loading submissions...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Project Submissions</h2>
        <p className="text-muted-foreground">Review and manage project submissions</p>
      </div>

      <div className="grid gap-6">
        {submissions.map((submission) => (
          <Card key={submission.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{submission.title}</CardTitle>
                  <CardDescription>
                    By {submission.member_name} ({submission.member_email})
                  </CardDescription>
                </div>
                <Badge variant={
                  submission.status === 'approved' ? 'default' :
                  submission.status === 'rejected' ? 'destructive' : 'secondary'
                }>
                  {submission.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {submission.description}
              </p>
              
              {submission.technologies && (
                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">Technologies:</p>
                  <div className="flex flex-wrap gap-1">
                    {submission.technologies.map((tech, index) => (
                      <Badge key={index} variant="outline">{tech}</Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-4 mb-4">
                <Button variant="outline" size="sm" asChild>
                  <a href={submission.github_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    GitHub
                  </a>
                </Button>
                {(submission.demo_url || submission.live_demo_url) && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={submission.demo_url || submission.live_demo_url} target="_blank" rel="noopener noreferrer">
                      <Eye className="w-4 h-4 mr-2" />
                      Demo
                    </a>
                  </Button>
                )}
              </div>

              {submission.status === 'pending' && (
                <div className="flex gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => updateSubmissionStatus(submission.id, 'approved')}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => updateSubmissionStatus(submission.id, 'rejected')}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SubmissionsManagement;
