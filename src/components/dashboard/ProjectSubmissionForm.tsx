
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProjectSubmissionFormProps {
  onSuccess: () => void;
}

const ProjectSubmissionForm = ({ onSuccess }: ProjectSubmissionFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    github_url: '',
    thumbnail_url: '',
  });
  const [techTags, setTechTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');

  const addTechTag = () => {
    if (currentTag.trim() && !techTags.includes(currentTag.trim())) {
      setTechTags([...techTags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const removeTechTag = (tagToRemove: string) => {
    setTechTags(techTags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('project_submissions')
        .insert({
          user_id: user?.id,
          title: formData.title,
          description: formData.description,
          github_url: formData.github_url,
          thumbnail_url: formData.thumbnail_url || null,
          tech_tags: techTags,
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Project submitted successfully. It will be reviewed by an admin.",
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        github_url: '',
        thumbnail_url: '',
      });
      setTechTags([]);
      onSuccess();
    } catch (error) {
      console.error('Error submitting project:', error);
      toast({
        title: "Error",
        description: "Failed to submit project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit New Project</CardTitle>
        <CardDescription>
          Share your project with the KIC community. Submissions are reviewed by admins before publishing.
        </CardDescription>
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
            <Label htmlFor="github_url">GitHub Repository URL</Label>
            <Input
              id="github_url"
              type="url"
              value={formData.github_url}
              onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
              placeholder="https://github.com/username/repo"
              required
            />
          </div>

          <div>
            <Label htmlFor="thumbnail_url">Thumbnail Image URL (Optional)</Label>
            <Input
              id="thumbnail_url"
              type="url"
              value={formData.thumbnail_url}
              onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <Label htmlFor="tech_tags">Technology Tags</Label>
            <div className="flex space-x-2">
              <Input
                id="tech_tags"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                placeholder="e.g., React, TypeScript, Node.js"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTechTag();
                  }
                }}
              />
              <Button type="button" onClick={addTechTag} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {techTags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => removeTechTag(tag)}
                    className="ml-1 hover:bg-gray-200 rounded-full p-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <Button type="submit" disabled={loading} className="bg-kic-green-500 hover:bg-kic-green-600">
            {loading ? 'Submitting...' : 'Submit Project'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProjectSubmissionForm;
