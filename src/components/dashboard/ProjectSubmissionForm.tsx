import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const ProjectSubmissionForm = () => {
  const { member } = useAuth();
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveDemoUrl, setLiveDemoUrl] = useState('');
  const [techTags, setTechTags] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
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
          github_url: githubUrl.trim(),
          live_demo_url: liveDemoUrl.trim(),
          tech_tags: techTags.split(',').map(tag => tag.trim()),
          thumbnail_url: thumbnailUrl.trim(),
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
      setGithubUrl('');
      setLiveDemoUrl('');
      setTechTags('');
      setThumbnailUrl('');
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
            <Textarea
              placeholder="Project Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
            />
          </div>
          <div>
            <Input
              type="url"
              placeholder="GitHub URL"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
            />
          </div>
          <div>
            <Input
              type="url"
              placeholder="Live Demo URL"
              value={liveDemoUrl}
              onChange={(e) => setLiveDemoUrl(e.target.value)}
            />
          </div>
          <div>
            <Input
              type="text"
              placeholder="Tech Tags (comma-separated)"
              value={techTags}
              onChange={(e) => setTechTags(e.target.value)}
            />
          </div>
          <div>
            <Input
              type="url"
              placeholder="Thumbnail URL"
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
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
