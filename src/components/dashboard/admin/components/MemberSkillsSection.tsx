
import { Badge } from '@/components/ui/badge';
import { Member } from '../types/members';

interface MemberSkillsSectionProps {
  member: Member;
}

const MemberSkillsSection = ({ member }: MemberSkillsSectionProps) => {
  if (!member.skills || member.skills.length === 0) return null;

  return (
    <div className="space-y-2">
      <h4 className="font-semibold text-kic-gray">Skills</h4>
      <div className="flex flex-wrap gap-2">
        {member.skills.map((skill, index) => (
          <Badge key={index} variant="outline" className="text-xs">
            {skill}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default MemberSkillsSection;
