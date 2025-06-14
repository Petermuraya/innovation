
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Loader2 } from 'lucide-react';

interface AddMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const AddMemberDialog = ({ open, onOpenChange, onSuccess }: AddMemberDialogProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course: '',
    year_of_study: '',
    bio: '',
    github_username: '',
    linkedin_url: '',
    skills: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Here you would typically call your API to add the member
      // For now, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Member Added",
        description: `${formData.name} has been successfully added to the system.`,
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        course: '',
        year_of_study: '',
        bio: '',
        github_username: '',
        linkedin_url: '',
        skills: '',
      });
      
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add member. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-kic-green-800">
            <UserPlus className="h-5 w-5" />
            Add New Member
          </DialogTitle>
          <DialogDescription>
            Add a new member directly to the system. They will be automatically approved.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="John Doe"
                required
                className="border-kic-green-200 focus:border-kic-green-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="john@example.com"
                required
                className="border-kic-green-200 focus:border-kic-green-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+254 700 000 000"
                className="border-kic-green-200 focus:border-kic-green-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="course">Course</Label>
              <Select value={formData.course} onValueChange={(value) => handleInputChange('course', value)}>
                <SelectTrigger className="border-kic-green-200">
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="computer-science">Computer Science</SelectItem>
                  <SelectItem value="information-technology">Information Technology</SelectItem>
                  <SelectItem value="software-engineering">Software Engineering</SelectItem>
                  <SelectItem value="data-science">Data Science</SelectItem>
                  <SelectItem value="cybersecurity">Cybersecurity</SelectItem>
                  <SelectItem value="business-it">Business Information Technology</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="year_of_study">Year of Study</Label>
            <Select value={formData.year_of_study} onValueChange={(value) => handleInputChange('year_of_study', value)}>
              <SelectTrigger className="border-kic-green-200">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">First Year</SelectItem>
                <SelectItem value="2">Second Year</SelectItem>
                <SelectItem value="3">Third Year</SelectItem>
                <SelectItem value="4">Fourth Year</SelectItem>
                <SelectItem value="graduate">Graduate</SelectItem>
                <SelectItem value="postgraduate">Postgraduate</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder="Tell us about yourself..."
              rows={3}
              className="border-kic-green-200 focus:border-kic-green-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="skills">Skills (comma-separated)</Label>
            <Input
              id="skills"
              value={formData.skills}
              onChange={(e) => handleInputChange('skills', e.target.value)}
              placeholder="JavaScript, Python, React, Node.js"
              className="border-kic-green-200 focus:border-kic-green-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="github_username">GitHub Username</Label>
              <Input
                id="github_username"
                value={formData.github_username}
                onChange={(e) => handleInputChange('github_username', e.target.value)}
                placeholder="johndoe"
                className="border-kic-green-200 focus:border-kic-green-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedin_url">LinkedIn Profile URL</Label>
              <Input
                id="linkedin_url"
                value={formData.linkedin_url}
                onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
                placeholder="https://linkedin.com/in/johndoe"
                className="border-kic-green-200 focus:border-kic-green-500"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !formData.name || !formData.email}
              className="flex-1 bg-kic-green-600 hover:bg-kic-green-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Member
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberDialog;
