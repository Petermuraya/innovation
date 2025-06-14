
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { CheckCircle, XCircle, Trash2, MoreHorizontal } from 'lucide-react';
import { Member } from '../types/members';

interface MemberActionsDropdownProps {
  member: Member;
  onStatusUpdate: (memberId: string, status: string) => Promise<void>;
  onDeleteMember: (member: Member) => void;
  isLoading: string | null;
}

const MemberActionsDropdown = ({
  member,
  onStatusUpdate,
  onDeleteMember,
  isLoading
}: MemberActionsDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="border-kic-green-200 hover:bg-kic-green-50">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {member.registration_status === 'pending' && (
          <>
            <DropdownMenuItem
              onClick={() => onStatusUpdate(member.id, 'approved')}
              disabled={isLoading === member.id}
              className="text-green-600"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onStatusUpdate(member.id, 'rejected')}
              disabled={isLoading === member.id}
              className="text-red-600"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuItem
          onClick={() => onDeleteMember(member)}
          className="text-red-600"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MemberActionsDropdown;
