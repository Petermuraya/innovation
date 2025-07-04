
import { Member } from '../types/members';

interface MemberSkillsSectionProps {
  member: Member;
}

const MemberSkillsSection = ({ member }: MemberSkillsSectionProps) => {
  const hasSkills = member.skills && Array.isArray(member.skills) && member.skills.length > 0;
  const hasInterests = member.interests && Array.isArray(member.interests) && member.interests.length > 0;
  
  if (!hasSkills && !hasInterests) return null;

  return (
    <div className="space-y-4">
      {hasSkills && (
        <div className="space-y-2">
          <h4 className="font-semibold text-kic-gray">Skills</h4>
          <div className="flex flex-wrap gap-2">
            {member.skills!.map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {hasInterests && (
        <div className="space-y-2">
          <h4 className="font-semibold text-kic-gray">Interests</h4>
          <div className="flex flex-wrap gap-2">
            {member.interests!.map((interest, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberSkillsSection;
