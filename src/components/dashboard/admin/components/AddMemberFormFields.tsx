
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AddMemberFormData } from '../hooks/useAddMemberForm';

interface AddMemberFormFieldsProps {
  formData: AddMemberFormData;
  onInputChange: (field: keyof AddMemberFormData, value: string) => void;
}

const AddMemberFormFields = ({ formData, onInputChange }: AddMemberFormFieldsProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => onInputChange('name', e.target.value)}
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
            onChange={(e) => onInputChange('email', e.target.value)}
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
            onChange={(e) => onInputChange('phone', e.target.value)}
            placeholder="+254 700 000 000"
            className="border-kic-green-200 focus:border-kic-green-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="course">Course</Label>
          <Select value={formData.course} onValueChange={(value) => onInputChange('course', value)}>
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
        <Select value={formData.year_of_study} onValueChange={(value) => onInputChange('year_of_study', value)}>
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
          onChange={(e) => onInputChange('bio', e.target.value)}
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
          onChange={(e) => onInputChange('skills', e.target.value)}
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
            onChange={(e) => onInputChange('github_username', e.target.value)}
            placeholder="johndoe"
            className="border-kic-green-200 focus:border-kic-green-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="linkedin_url">LinkedIn Profile URL</Label>
          <Input
            id="linkedin_url"
            value={formData.linkedin_url}
            onChange={(e) => onInputChange('linkedin_url', e.target.value)}
            placeholder="https://linkedin.com/in/johndoe"
            className="border-kic-green-200 focus:border-kic-green-500"
          />
        </div>
      </div>
    </div>
  );
};

export default AddMemberFormFields;
