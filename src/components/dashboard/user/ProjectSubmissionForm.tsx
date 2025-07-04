
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ProjectSubmissionFormProps {
  onSuccess?: () => void;
}

const ProjectSubmissionForm = ({ onSuccess }: ProjectSubmissionFormProps) => {
  const { member } = useAuth();
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!member) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to submit a project",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('project_submissions')
        .insert({
          title: title.trim(),
          description: description.trim(),
          content: content.trim(),
          user_id: member.id,
          status: 'pending',
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Project submitted successfully!",
      });

      // Reset form fields
      setTitle('');
      setDescription('');
      setContent('');
      
      // Call success callback
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error submitting project:", error);
      toast({
        title: "Error",
        description: "Failed to submit project",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit Your Project</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Project Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <Input
              type="text"
              placeholder="Project Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <Textarea
              placeholder="Project Details"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              required
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Project'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProjectSubmissionForm;
