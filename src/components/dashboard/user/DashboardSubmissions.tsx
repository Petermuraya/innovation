
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, ExternalLink, Eye } from 'lucide-react';
import ProjectSubmissionForm from './ProjectSubmissionForm';

interface Submission {
  id: string;
  title: string;
  description: string;
  github_url: string;
  demo_url?: string;
  status: string;
  created_at: string;
  technologies?: string[];
}

const DashboardSubmissions: React.FC = () => {
  const { member } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (member) {
      fetchSubmissions();
    }
  }, [member]);

  const fetchSubmissions = async () => {
    if (!member) return;

    try {
      const { data, error } = await supabase
        .from('project_submissions')
        .select('*')
        .eq('user_id', member.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    fetchSubmissions();
  };

  if (loading) {
    return <div>Loading submissions...</div>;
  }

  if (showForm) {
    return <ProjectSubmissionForm onSuccess={handleFormSuccess} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Project Submissions</h3>
          <p className="text-muted-foreground">Submit and track your project submissions</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Submission
        </Button>
      </div>

      <div className="grid gap-6">
        {submissions.map((submission) => (
          <Card key={submission.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{submission.title}</CardTitle>
                  <CardDescription>
                    Submitted on {new Date(submission.created_at).toLocaleDateString()}
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

              <div className="flex gap-4">
                <Button variant="outline" size="sm" asChild>
                  <a href={submission.github_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    GitHub
                  </a>
                </Button>
                {submission.demo_url && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={submission.demo_url} target="_blank" rel="noopener noreferrer">
                      <Eye className="w-4 h-4 mr-2" />
                      Demo
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {submissions.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground mb-4">No submissions yet</p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Submit Your First Project
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DashboardSubmissions;
