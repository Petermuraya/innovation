
import { Member } from '../types/members';

interface MemberRegistrationInfoProps {
  member: Member;
}

const MemberRegistrationInfo = ({ member }: MemberRegistrationInfoProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-600';
      case 'rejected':
        return 'text-red-600';
      case 'pending':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div>
      <h4 className="font-medium text-kic-gray mb-3">Registration Information</h4>
      <div className="space-y-2 text-sm">
        <div>
          <span className="text-kic-gray/70">Status:</span>
          <span className={`ml-2 font-medium capitalize ${getStatusColor(member.registration_status)}`}>
            {member.registration_status}
          </span>
        </div>
        <div>
          <span className="text-kic-gray/70">Course:</span>
          <span className="ml-2">{member.course || 'Not specified'}</span>
        </div>
        <div>
          <span className="text-kic-gray/70">Department:</span>
          <span className="ml-2">{member.department || 'Not specified'}</span>
        </div>
        <div>
          <span className="text-kic-gray/70">Joined:</span>
          <span className="ml-2">{new Date(member.created_at).toLocaleDateString()}</span>
        </div>
        {member.approved_at && (
          <div>
            <span className="text-kic-gray/70">Approved:</span>
            <span className="ml-2">{new Date(member.approved_at).toLocaleDateString()}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberRegistrationInfo;
