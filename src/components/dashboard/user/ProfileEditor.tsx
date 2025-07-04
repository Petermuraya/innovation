
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import AvatarUpload from './profile/AvatarUpload';
import BasicInfoFields from './profile/BasicInfoFields';
import BioField from './profile/BioField';

interface Profile {
  id: string;
  user_id: string;
  avatar_url: string | null;
  phone: string | null;
  course: string | null;
  bio: string | null;
}

interface ProfileEditorProps {
  memberData: any;
  onUpdate?: () => void;
}

const ProfileEditor = ({ memberData, onUpdate }: ProfileEditorProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [course, setCourse] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (user && memberData) {
      fetchProfile();
      setName(memberData.name || '');
      setEmail(memberData.email || '');
      setAvatarUrl(memberData.avatar_url || null);
    }
  }, [user, memberData]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile({
          id: data.id,
          user_id: data.user_id,
          avatar_url: data.avatar_url,
          phone: data.phone,
          course: data.course,
          bio: data.bio
        });
        setPhone(data.phone || '');
        setCourse(data.course || '');
        setBio(data.bio || '');
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpdate = () => {
    // Refresh the data to get the latest avatar
    if (onUpdate) {
      onUpdate();
    }
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      setSaving(true);

      // Update member info
      await supabase
        .from('members')
        .update({
          name: name.trim(),
          phone: phone.trim() || null,
          course: course.trim() || null,
          avatar_url: avatarUrl,
        })
        .eq('user_id', user.id);

      // Upsert profile
      await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          avatar_url: avatarUrl,
          phone: phone.trim() || null,
          course: course.trim() || null,
          bio: bio.trim() || null,
        });

      toast({
        title: "Profile updated",
        description: "Your profile has been saved successfully",
      });

      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Save failed",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading profile...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <AvatarUpload
          avatarUrl={avatarUrl}
          setAvatarUrl={setAvatarUrl}
          name={name}
          onAvatarUpdate={handleAvatarUpdate}
        />

        <BasicInfoFields
          name={name}
          setName={setName}
          email={email}
          phone={phone}
          setPhone={setPhone}
          course={course}
          setCourse={setCourse}
        />

        <BioField bio={bio} setBio={setBio} />

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Profile'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileEditor;
