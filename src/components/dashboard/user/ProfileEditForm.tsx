
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ProfileEditFormProps {
  memberData: any;
  onUpdate: () => void;
}

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({ memberData, onUpdate }) => {
  const [name, setName] = React.useState(memberData?.name || '');
  const [bio, setBio] = React.useState(memberData?.bio || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle profile update logic here
    onUpdate();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your full name"
        />
      </div>
      
      <div>
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell us about yourself"
          rows={4}
        />
      </div>

      <Button type="submit">Update Profile</Button>
    </form>
  );
};

export default ProfileEditForm;
