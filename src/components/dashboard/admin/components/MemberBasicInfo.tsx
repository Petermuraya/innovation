
import { User } from 'lucide-react';
import { Member } from '../types/members';

interface MemberBasicInfoProps {
  member: Member;
}

const MemberBasicInfo = ({ member }: MemberBasicInfoProps) => {
  return (
    <div className="space-y-2">
      <h4 className="font-semibold text-kic-gray flex items-center gap-2">
        <User className="h-4 w-4" />
        Basic Information
      </h4>
      <div className="space-y-1 text-sm">
        <p><strong>Email:</strong> {member.email}</p>
        {member.phone && <p><strong>Phone:</strong> {member.phone}</p>}
        {member.course && <p><strong>Course:</strong> {member.course}</p>}
        {member.year_of_study && <p><strong>Year:</strong> {member.year_of_study}</p>}
      </div>
    </div>
  );
};

export default MemberBasicInfo;
