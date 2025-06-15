
import { Member } from '../types/members';

interface MemberBasicInfoProps {
  member: Member;
}

const MemberBasicInfo = ({ member }: MemberBasicInfoProps) => {
  return (
    <div>
      <h4 className="font-medium text-kic-gray mb-3">Basic Information</h4>
      <div className="space-y-2 text-sm">
        <div>
          <span className="text-kic-gray/70">Name:</span>
          <span className="ml-2 font-medium">{member.name}</span>
        </div>
        <div>
          <span className="text-kic-gray/70">Email:</span>
          <span className="ml-2">{member.email}</span>
        </div>
        <div>
          <span className="text-kic-gray/70">Phone:</span>
          <span className="ml-2">{member.phone || 'Not provided'}</span>
        </div>
        <div>
          <span className="text-kic-gray/70">Year of Study:</span>
          <span className="ml-2">{member.year_of_study || 'Not specified'}</span>
        </div>
        {member.registration_number && (
          <div>
            <span className="text-kic-gray/70">Registration Number:</span>
            <span className="ml-2">{member.registration_number}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberBasicInfo;
