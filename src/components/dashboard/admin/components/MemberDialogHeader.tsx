
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Member } from '../types/members';

interface MemberDialogHeaderProps {
  member: Member;
}

const MemberDialogHeader = ({ member }: MemberDialogHeaderProps) => {
  return (
    <DialogHeader>
      <DialogTitle className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={member.avatar_url} />
          <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
        {member.name}
        <Badge variant="outline" className="ml-2">
          ID: {member.id.slice(0, 8)}
        </Badge>
      </DialogTitle>
      <DialogDescription>
        Member details and registration information
      </DialogDescription>
    </DialogHeader>
  );
};

export default MemberDialogHeader;
