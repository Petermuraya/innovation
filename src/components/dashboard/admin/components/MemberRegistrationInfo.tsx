
import { Member } from '../types/members';
import MemberStatusBadge from './MemberStatusBadge';

interface MemberRegistrationInfoProps {
  member: Member;
}

const MemberRegistrationInfo = ({ member }: MemberRegistrationInfoProps) => {
  return (
    <div>
      <h4 className="font-medium text-kic-gray mb-3">Registration Details</h4>
      <div className="space-y-2 text-sm">
        <div className="flex items-center">
          <span className="text-kic-gray/70">Status:</span>
          <div className="ml-2">
            <MemberStatusBadge status={member.registration_status} />
          </div>
        </div>
        <div>
          <span className="text-kic-gray/70">Registered:</span>
          <span className="ml-2">{new Date(member.created_at).toLocaleDateString()}</span>
        </div>
        {member.approved_at && (
          <div>
            <span className="text-kic-gray/70">Approved:</span>
            <span className="ml-2">{new Date(member.approved_at).toLocaleDateString()}</span>
          </div>
        )}
        {member.approved_by && (
          <div>
            <span className="text-kic-gray/70">Approved by:</span>
            <span className="ml-2">Admin</span>
          </div>
        )}
        {member.membership_expires_at && (
          <div>
            <span className="text-kic-gray/70">Membership Expires:</span>
            <span className="ml-2">{new Date(member.membership_expires_at).toLocaleDateString()}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberRegistrationInfo;
