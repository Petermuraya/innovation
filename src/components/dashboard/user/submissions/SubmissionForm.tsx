
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface SubmissionFormProps {
  onSuccess: () => void;
}

interface FormData {
  title: string;
  content: string;
  submission_type: 'complaint' | 'recommendation' | 'thought';
  directed_to: 'super_admin' | 'patron_chairman' | 'treasurer' | 'organizing_secretary' | 'community_admin' | 'general_admin';
  priority: 1 | 2 | 3;
  is_anonymous: boolean;
}

const SubmissionForm = ({ onSuccess }: SubmissionFormProps) => {
  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    defaultValues: {
      submission_type: 'complaint',
      directed_to: 'general_admin',
      priority: 1,
      is_anonymous: false
    }
  });
  const { user } = useAuth();
  const { toast } = useToast();
  const [isAnonymous, setIsAnonymous] = useState(false);

  const submissionType = watch('submission_type');

  const onSubmit = async (data: FormData) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to submit",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('user_submissions')
        .insert({
          user_id: user.id,
          title: data.title,
          content: data.content,
          submission_type: data.submission_type,
          directed_to: data.directed_to,
          priority: data.priority,
          is_anonymous: data.is_anonymous
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your submission has been created successfully"
      });

      onSuccess();
    } catch (error) {
      console.error('Error creating submission:', error);
      toast({
        title: "Error",
        description: "Failed to create submission. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="submission_type">Type</Label>
              <Select 
                value={submissionType} 
                onValueChange={(value) => setValue('submission_type', value as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="complaint">Complaint</SelectItem>
                  <SelectItem value="recommendation">Recommendation</SelectItem>
                  <SelectItem value="thought">General Thought</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="directed_to">Direct To</Label>
              <Select 
                defaultValue="general_admin"
                onValueChange={(value) => setValue('directed_to', value as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                  <SelectItem value="patron_chairman">Chairman</SelectItem>
                  <SelectItem value="treasurer">Treasurer</SelectItem>
                  <SelectItem value="organizing_secretary">Organizing Secretary</SelectItem>
                  <SelectItem value="community_admin">Community Admin</SelectItem>
                  <SelectItem value="general_admin">General Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select 
              defaultValue="1"
              onValueChange={(value) => setValue('priority', parseInt(value) as any)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Low</SelectItem>
                <SelectItem value="2">Medium</SelectItem>
                <SelectItem value="3">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              {...register('title', { required: 'Title is required' })}
              placeholder="Enter a descriptive title"
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              {...register('content', { required: 'Content is required' })}
              placeholder="Describe your complaint, recommendation, or thought in detail..."
              rows={6}
            />
            {errors.content && (
              <p className="text-sm text-red-600">{errors.content.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_anonymous"
              checked={isAnonymous}
              onCheckedChange={(checked) => {
                setIsAnonymous(checked as boolean);
                setValue('is_anonymous', checked as boolean);
              }}
            />
            <Label htmlFor="is_anonymous" className="text-sm">
              Submit anonymously
            </Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SubmissionForm;
