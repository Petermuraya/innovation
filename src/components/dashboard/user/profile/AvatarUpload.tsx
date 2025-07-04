
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface AvatarUploadProps {
  avatarUrl: string | null;
  setAvatarUrl: (url: string | null) => void;
  name: string;
  onAvatarUpdate?: () => void;
}

const AvatarUpload = ({ avatarUrl, setAvatarUrl, name, onAvatarUpdate }: AvatarUploadProps) => {
  const { member } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [imageKey, setImageKey] = useState(Date.now()); // Force re-render of image

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${member?.id}/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const newAvatarUrl = data.publicUrl;
      setAvatarUrl(newAvatarUrl);
      setImageKey(Date.now()); // Force image re-render
      
      // Update the member's avatar in the database
      await supabase
        .from('members')
        .update({ avatar_url: newAvatarUrl })
        .eq('user_id', member?.id);

      // Update the profile's avatar in the database
      await supabase
        .from('profiles')
        .upsert({
          user_id: member?.id,
          avatar_url: newAvatarUrl,
        });
      
      toast({
        title: "Avatar uploaded",
        description: "Your profile picture has been updated",
      });

      // Trigger parent component refresh if callback provided
      if (onAvatarUpdate) {
        onAvatarUpdate();
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload avatar. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Avatar className="w-20 h-20">
        <AvatarImage 
          src={avatarUrl ? `${avatarUrl}?t=${imageKey}` : undefined} 
          key={imageKey}
        />
        <AvatarFallback>
          {name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
        </AvatarFallback>
      </Avatar>
      <div>
        <Button
          variant="outline"
          disabled={uploading}
          className="relative overflow-hidden"
        >
          <Camera className="w-4 h-4 mr-2" />
          {uploading ? 'Uploading...' : 'Change Avatar'}
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            className="absolute inset-0 opacity-0 cursor-pointer"
            disabled={uploading}
          />
        </Button>
        <p className="text-sm text-gray-500 mt-1">
          Upload a profile picture
        </p>
      </div>
    </div>
  );
};

export default AvatarUpload;
