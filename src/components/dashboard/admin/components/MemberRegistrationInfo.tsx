
import MemberStatusBadge from './MemberStatusBadge';
import { getTimeAgo } from './utils/memberTableUtils';
import { Member } from '../types/members';

interface MemberRegistrationInfoProps {
  member: Member;
}

const MemberRegistrationInfo = ({ member }: MemberRegistrationInfoProps) => {
  return (
    <div className="space-y-2">
      <h4 className="font-semibold text-kic-gray">Registration</h4>
      <div className="space-y-1 text-sm">
        <p><strong>Status:</strong> <MemberStatusBadge status={member.registration_status} /></p>
        <p><strong>Registered:</strong> {new Date(member.created_at).toLocaleDateString()}</p>
        <p><strong>Time ago:</strong> {getTimeAgo(member.created_at)}</p>
      </div>
    </div>
  );
};

export default MemberRegistrationInfo;
