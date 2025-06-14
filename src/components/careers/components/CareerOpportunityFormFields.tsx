
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface CareerOpportunityFormFieldsProps {
  formData: {
    title: string;
    company_name: string;
    type: string;
    location: string;
    remote: boolean;
    description: string;
    requirements: string;
    salary_range: string;
    application_url: string;
    application_email: string;
    expires_at: string;
  };
  handleChange: (field: string, value: any) => void;
}

const CareerOpportunityFormFields = ({ formData, handleChange }: CareerOpportunityFormFieldsProps) => {
  return (
    <div className="space-y-4">
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
    </div>
  );
};

export default CareerOpportunityFormFields;
