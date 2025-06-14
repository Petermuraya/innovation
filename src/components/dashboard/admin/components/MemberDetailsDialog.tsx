
import { DialogContent } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Member } from '../types/members';
import MemberDialogHeader from './MemberDialogHeader';
import MemberBasicInfo from './MemberBasicInfo';
import MemberRegistrationInfo from './MemberRegistrationInfo';
import MemberBioSection from './MemberBioSection';
import MemberSkillsSection from './MemberSkillsSection';
import MemberLinksSection from './MemberLinksSection';
import MemberDialogActions from './MemberDialogActions';

interface MemberDetailsDialogProps {
  member: Member;
  onStatusUpdate: (memberId: string, status: string) => Promise<void>;
  onDeleteMember: (member: Member) => void;
  isLoading: string | null;
}

const MemberDetailsDialog = ({ member, onStatusUpdate, onDeleteMember, isLoading }: MemberDetailsDialogProps) => {
  return (
    <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
      <MemberDialogHeader member={member} />
      
      <ScrollArea className="max-h-[60vh] pr-4">
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MemberBasicInfo member={member} />
            <MemberRegistrationInfo member={member} />
          </div>

          {/* Bio */}
          <MemberBioSection member={member} />

          {/* Skills */}
          <MemberSkillsSection member={member} />

          {/* Links */}
          <MemberLinksSection member={member} />

          {/* Actions */}
          <MemberDialogActions
            member={member}
            onStatusUpdate={onStatusUpdate}
            onDeleteMember={onDeleteMember}
            isLoading={isLoading}
          />
        </div>
      </ScrollArea>
    </DialogContent>
  );
};

export default MemberDetailsDialog;
