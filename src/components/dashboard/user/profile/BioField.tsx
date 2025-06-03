
import { Textarea } from '@/components/ui/textarea';

interface BioFieldProps {
  bio: string;
  setBio: (bio: string) => void;
}

const BioField = ({ bio, setBio }: BioFieldProps) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">Bio</label>
      <Textarea
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        placeholder="Tell us about yourself..."
        rows={4}
      />
    </div>
  );
};

export default BioField;
