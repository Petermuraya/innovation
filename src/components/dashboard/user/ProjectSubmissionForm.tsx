
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';

interface ProjectSubmissionFormProps {
  onSuccess: () => void;
}

const ProjectSubmissionForm: React.FC<ProjectSubmissionFormProps> = ({ onSuccess }) => {
  const { member } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    github_url: '',
    demo_url: '',
    technologies: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!member) return;

    setLoading(true);

    try {
      const technologiesArray = formData.technologies
        .split(',')
        .map(tech => tech.trim())
        .filter(tech => tech.length > 0);

      const { error } = await supabase
        .from('project_submissions')
        .insert({
          user_id: member.id,
          title: formData.title,
          description: formData.description,
          github_url: formData.github_url,
          demo_url: formData.demo_url || null,
          technologies: technologiesArray,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Project submitted successfully',
      });

      onSuccess();
    } catch (error) {
      console.error('Error submitting project:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit project',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onSuccess}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <CardTitle>Submit New Project</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Project Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              required
            />
          </div>

          <div>
            <Label htmlFor="github_url">GitHub URL</Label>
            <Input
              id="github_url"
              type="url"
              value={formData.github_url}
              onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="demo_url">Demo URL (Optional)</Label>
            <Input
              id="demo_url"
              type="url"
              value={formData.demo_url}
              onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="technologies">Technologies Used</Label>
            <Input
              id="technologies"
              value={formData.technologies}
              onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
              placeholder="React, Node.js, MongoDB (comma-separated)"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Project'}
            </Button>
            <Button type="button" variant="outline" onClick={onSuccess}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProjectSubmissionForm;
