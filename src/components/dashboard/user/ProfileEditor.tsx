
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Save, User } from 'lucide-react';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  course: string;
  bio: string;
  github_username: string;
  linkedin_url: string;
}

const ProfileEditor: React.FC = () => {
  const { member } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    email: '',
    phone: '',
    course: '',
    bio: '',
    github_username: '',
    linkedin_url: '',
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (member) {
      fetchProfile();
    }
  }, [member]);

  const fetchProfile = async () => {
    if (!member) return;

    try {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('user_id', member.id)
        .single();

      if (error) throw error;

      setProfileData({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        course: data.course || '',
        bio: data.bio || '',
        github_username: data.github_username || '',
        linkedin_url: data.linkedin_url || '',
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to load profile data',
        variant: 'destructive',
      });
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!member) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from('members')
        .update({
          name: profileData.name,
          phone: profileData.phone,
          course: profileData.course,
          bio: profileData.bio,
          github_username: profileData.github_username,
          linkedin_url: profileData.linkedin_url,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', member.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <div>Loading profile...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Edit Profile
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                disabled
                className="bg-muted"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="course">Course</Label>
              <Input
                id="course"
                value={profileData.course}
                onChange={(e) => setProfileData({ ...profileData, course: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={profileData.bio}
              onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
              rows={3}
              placeholder="Tell us about yourself..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="github_username">GitHub Username</Label>
              <Input
                id="github_username"
                value={profileData.github_username}
                onChange={(e) => setProfileData({ ...profileData, github_username: e.target.value })}
                placeholder="your-username"
              />
            </div>
            <div>
              <Label htmlFor="linkedin_url">LinkedIn URL</Label>
              <Input
                id="linkedin_url"
                value={profileData.linkedin_url}
                onChange={(e) => setProfileData({ ...profileData, linkedin_url: e.target.value })}
                placeholder="https://linkedin.com/in/your-profile"
              />
            </div>
          </div>

          <Button type="submit" disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileEditor;
