
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { Member } from '../types/members';

interface MemberDialogActionsProps {
  member: Member;
  onStatusUpdate: (memberId: string, status: string) => Promise<void>;
  onDeleteMember: (member: Member) => void;
  isLoading: string | null;
}

const MemberDialogActions = ({
  member,
  onStatusUpdate,
  onDeleteMember,
  isLoading
}: MemberDialogActionsProps) => {
  return (
    <div className="flex gap-2 pt-4 border-t">
      {member.registration_status === 'pending' && (
        <>
          <Button
            onClick={() => onStatusUpdate(member.id, 'approved')}
            disabled={isLoading === member.id}
            className="bg-green-600 hover:bg-green-700 flex-1"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Approve
          </Button>
          <Button
            onClick={() => onStatusUpdate(member.id, 'rejected')}
            disabled={isLoading === member.id}
            variant="destructive"
            className="flex-1"
          >
            <XCircle className="w-4 h-4 mr-2" />
            Reject
          </Button>
        </>
      )}
      <Button
        onClick={() => onDeleteMember(member)}
        variant="outline"
        className="border-red-200 text-red-600 hover:bg-red-50"
      >
        <Trash2 className="w-4 h-4 mr-2" />
        Delete
      </Button>
    </div>
  );
};

export default MemberDialogActions;
