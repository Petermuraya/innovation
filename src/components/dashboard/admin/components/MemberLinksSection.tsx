
import { Member } from '../types/members';

interface MemberLinksSectionProps {
  member: Member;
}

const MemberLinksSection = ({ member }: MemberLinksSectionProps) => {
  const hasLinks = member.github_username || member.linkedin_url;
  
  if (!hasLinks) return null;

  return (
    <div className="space-y-2">
      <h4 className="font-semibold text-kic-gray">Links</h4>
      <div className="space-y-1 text-sm">
        {member.github_username && (
          <p>
            <strong>GitHub:</strong> 
            <a 
              href={`https://github.com/${member.github_username}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline ml-1"
            >
              {member.github_username}
            </a>
          </p>
        )}
        {member.linkedin_url && (
          <p>
            <strong>LinkedIn:</strong> 
            <a 
              href={member.linkedin_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline ml-1"
            >
              View Profile
            </a>
          </p>
        )}
      </div>
    </div>
  );
};

export default MemberLinksSection;
