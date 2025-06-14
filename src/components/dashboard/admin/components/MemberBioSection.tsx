
import { Member } from '../types/members';

interface MemberBioSectionProps {
  member: Member;
}

const MemberBioSection = ({ member }: MemberBioSectionProps) => {
  if (!member.bio) return null;

  return (
    <div className="space-y-2">
      <h4 className="font-semibold text-kic-gray">Bio</h4>
      <p className="text-sm text-gray-600">{member.bio}</p>
    </div>
  );
};

export default MemberBioSection;
