
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Edit, MoreVertical, Trash2 } from 'lucide-react';

type ComprehensiveRole = 'member' | 'super_admin' | 'general_admin' | 'community_admin' | 'events_admin' | 'projects_admin' | 'finance_admin' | 'content_admin' | 'technical_admin' | 'marketing_admin' | 'chairman' | 'vice_chairman';

interface Member {
  id: string;
  email: string;
  name: string;
  roles: ComprehensiveRole[];
  registration_status: string;
  phone?: string;
  course?: string;
  created_at: string;
}

interface MemberActionsDropdownProps {
  member: Member;
  onEditMember: (member: Member) => void;
  onDeleteMember: (member: Member) => void;
}

const MemberActionsDropdown = ({ member, onEditMember, onDeleteMember }: MemberActionsDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEditMember(member)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Member
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => onDeleteMember(member)}
          className="text-red-600 focus:text-red-600"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Member
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MemberActionsDropdown;
