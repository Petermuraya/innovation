import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface CareerOpportunityFormProps {
  opportunity?: any;
  onClose: () => void;
  onSuccess: () => void;
}

const CareerOpportunityForm = ({ opportunity, onClose, onSuccess }: CareerOpportunityFormProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company_name: '',
    type: '',
    location: '',
    remote: false,
    description: '',
    requirements: '',
    salary_range: '',
    application_url: '',
    application_email: '',
    expires_at: ''
  });

  useEffect(() => {
    if (opportunity) {
      setFormData({
        title: opportunity.title || '',
        company_name: opportunity.company_name || '',
        type: opportunity.type || '',
        location: opportunity.location || '',
        remote: opportunity.remote || false,
        description: opportunity.description || '',
        requirements: opportunity.requirements || '',
        salary_range: opportunity.salary_range || '',
        application_url: opportunity.application_url || '',
        application_email: opportunity.application_email || '',
        expires_at: opportunity.expires_at ? new Date(opportunity.expires_at).toISOString().split('T')[0] : ''
      });
    }
  }, [opportunity]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const submitData = {
        ...formData,
        posted_by: user.id,
        expires_at: formData.expires_at ? new Date(formData.expires_at).toISOString() : null
      };

      if (opportunity) {
        // Update existing opportunity
        const { error } = await supabase
          .from('career_opportunities')
          .update(submitData)
          .eq('id', opportunity.id);

        if (error) throw error;
        toast.success('Opportunity updated successfully!');
      } else {
        // Create new opportunity
        const { error } = await supabase
          .from('career_opportunities')
          .insert(submitData);

        if (error) throw error;
        toast.success('Opportunity posted successfully!');
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving opportunity:', error);
      toast.error('Error saving opportunity');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{opportunity ? 'Edit' : 'Post'} Career Opportunity</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="company_name">Company Name *</Label>
                <Input
                  id="company_name"
                  value={formData.company_name}
                  onChange={(e) => handleChange('company_name', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Type *</Label>
                <Select value={formData.type} onValueChange={(value) => handleChange('type', value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="internship">Internship</SelectItem>
                    <SelectItem value="full_time">Full Time</SelectItem>
                    <SelectItem value="part_time">Part Time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="volunteer">Volunteer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder="e.g. Nairobi, Kenya"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="remote"
                checked={formData.remote}
                onCheckedChange={(checked) => handleChange('remote', checked)}
              />
              <Label htmlFor="remote">Remote work available</Label>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={4}
                required
              />
            </div>

            <div>
              <Label htmlFor="requirements">Requirements</Label>
              <Textarea
                id="requirements"
                value={formData.requirements}
                onChange={(e) => handleChange('requirements', e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="salary_range">Salary Range</Label>
                <Input
                  id="salary_range"
                  value={formData.salary_range}
                  onChange={(e) => handleChange('salary_range', e.target.value)}
                  placeholder="e.g. $50,000 - $70,000"
                />
              </div>
              <div>
                <Label htmlFor="expires_at">Application Deadline</Label>
                <Input
                  id="expires_at"
                  type="date"
                  value={formData.expires_at}
                  onChange={(e) => handleChange('expires_at', e.target.value)}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="application_url">Application URL</Label>
                <Input
                  id="application_url"
                  type="url"
                  value={formData.application_url}
                  onChange={(e) => handleChange('application_url', e.target.value)}
                  placeholder="https://company.com/apply"
                />
              </div>
              <div>
                <Label htmlFor="application_email">Application Email</Label>
                <Input
                  id="application_email"
                  type="email"
                  value={formData.application_email}
                  onChange={(e) => handleChange('application_email', e.target.value)}
                  placeholder="hr@company.com"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? (opportunity ? 'Updating...' : 'Posting...') : (opportunity ? 'Update Opportunity' : 'Post Opportunity')}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CareerOpportunityForm;
