
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ProjectSubmissionSectionProps {
  onProjectSubmitted: () => void;
}

const ProjectSubmissionSection = ({ onProjectSubmitted }: ProjectSubmissionSectionProps) => {
  const { member } = useAuth();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    github_url: '',
    live_demo_url: '',
    tech_tags: '',
    thumbnail_url: ''
  });

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
      const techTagsArray = formData.tech_tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const { error } = await supabase
        .from('project_submissions')
        .insert({
          title: formData.title.trim(),
          description: formData.description.trim(),
          github_url: formData.github_url.trim(),
          live_demo_url: formData.live_demo_url.trim() || null,
          tech_tags: techTagsArray.length > 0 ? techTagsArray : null,
          thumbnail_url: formData.thumbnail_url.trim() || null,
          user_id: member.id,
          status: 'pending',
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Project submitted successfully! It will be reviewed by our admin team.",
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        github_url: '',
        live_demo_url: '',
        tech_tags: '',
        thumbnail_url: ''
      });
      setShowForm(false);
      onProjectSubmitted();
    } catch (error) {
      console.error("Error submitting project:", error);
      toast({
        title: "Error",
        description: "Failed to submit project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!showForm) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Submit a New Project
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Share your innovative projects with the community. All submissions are reviewed by our admin team.
          </p>
          <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Submit Project
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit Your Project</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Project Title *</label>
            <Input
              type="text"
              placeholder="Enter your project title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description *</label>
            <Textarea
              placeholder="Describe your project, its purpose, and key features"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">GitHub Repository URL *</label>
            <Input
              type="url"
              placeholder="https://github.com/username/repository"
              value={formData.github_url}
              onChange={(e) => handleInputChange('github_url', e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Live Demo URL (Optional)</label>
            <Input
              type="url"
              placeholder="https://yourproject.com"
              value={formData.live_demo_url}
              onChange={(e) => handleInputChange('live_demo_url', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Technologies Used</label>
            <Input
              type="text"
              placeholder="React, Node.js, MongoDB (comma-separated)"
              value={formData.tech_tags}
              onChange={(e) => handleInputChange('tech_tags', e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">Separate multiple technologies with commas</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Project Thumbnail URL (Optional)</label>
            <Input
              type="url"
              placeholder="https://example.com/thumbnail.jpg"
              value={formData.thumbnail_url}
              onChange={(e) => handleInputChange('thumbnail_url', e.target.value)}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Project'}
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProjectSubmissionSection;
